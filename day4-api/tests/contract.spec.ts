import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
const ajv = new Ajv();
const baseURL = 'https://jsonplaceholder.typicode.com';
    
test.describe('API Contract Testing with JSON Schema Validation', () => {
        test('User API - validate response schema', async ({request}) => {
            const userSchema = {
          type: 'object',
          required: ['id', 'name', 'username', 'email', 'address',
                      'phone', 'website', 'company'],
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            website: { type: 'string' },
            address: {
              type: 'object',
              required: ['street', 'suite', 'city', 'zipcode', 'geo'],
              properties: {
                street: { type: 'string' },
                suite: { type: 'string' },
                city: { type: 'string' },
                zipcode: { type: 'string' },
                geo: {
                  type: 'object',
                  required: ['lat', 'lng'],
                  properties: {
                    lat: { type: 'string' },
                    lng: { type: 'string' }
                  }
                }
              }
            },
            company: {
              type: 'object',
              required: ['name', 'catchPhrase', 'bs'],
              properties: {
                name: { type: 'string' },
                catchPhrase: { type: 'string' },
                bs: { type: 'string' }
              }
            }
          }
        };
    
        const response = await request.get(`${baseURL}/users/1`);
        expect(response.status()).toBe(200);
    
        const responseData = await response.json();
    
        // Validate response against schema
        const validate = ajv.compile(userSchema);
        const isValid = validate(responseData);
        if(!isValid) {
            console.error('Schema validation errors:', validate.errors);
        }
        expect(isValid).toBe(true);
    });
    
    test('Posts API - validate list schema - solution 1', async ({request}) => {
        const postsSchema = {
            type: 'array',
            items: {
                type: 'object',
                required: ['userId', 'id', 'title', 'body'],
                properties: {
                    userId: { type: 'number' },
                    id: { type: 'number' },
                    title: { type: 'string' , minLength: 1},
                    body: { type: 'string' , minLength: 1}
                }
            }
        };
    
        const response = await request.get(`${baseURL}/posts`);
        expect(response.status()).toBe(200);
        const responseData = await response.json();
    
        const validate = ajv.compile(postsSchema);
        const isValid = validate(responseData);
        if(!isValid) {
            console.error('Schema validation errors:', validate.errors);
        }
        expect(isValid).toBe(true);
    });
    

    test('Posts API - validate list schema - solution 2', async ({ request }) => {
        const postSchema = {
            type: 'object',
            required: ['userId', 'id', 'title', 'body'],
            properties: {
                userId: { type: 'number' },
                id: { type: 'number' },
                title: { type: 'string', minLength: 1 },
                body: { type: 'string', minLength: 1 }
            }
        };
        const response = await request.get(`${baseURL}/posts`);
        expect(response.status()).toBe(200);
        const responseData = await response.json();

        expect(Array.isArray(responseData)).toBe(true);
        expect(responseData.length).toBeGreaterThan(0);

        const validate = ajv.compile(postSchema);
        let allValid = true;
        for (const post of responseData) {
            const isValid = validate(post);
            if (!isValid) {
                console.error(`Schema validation errors for post ID ${post.id}:`, validate.errors);
                allValid = false;
            }
        }
        expect(allValid).toBe(true);
    });

test('Posts API - best practice', async ({ request }) => {
    // Schema mô tả đúng structure (Solution 1)
    const postsSchema = {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['userId', 'id', 'title', 'body'],
        properties: {
          userId: { type: 'number' },
          id: { type: 'number' },
          title: { type: 'string', minLength: 1 },
          body: { type: 'string', minLength: 1 }
        }
      }
    };

    const response = await request.get(`${baseURL}/posts`);
    expect(response.status()).toBe(200);
    const body = await response.json();

    // Validate toàn bộ 1 lần
    const validate = ajv.compile(postsSchema);
    const isValid = validate(body);

    // Error report chi tiết (Solution 2 idea)
    if (!isValid) {
      console.error('Schema errors:', JSON.stringify(validate.errors, null, 2));
    }
    expect(isValid).toBe(true);
});

    test('Posts API - validate no extra fields', async ({ request }) => {
        const strictSchema = {
            type: 'object',
            required: ['userId', 'id', 'title', 'body'],
            properties: {
                userId: { type: 'number' },
                id: { type: 'number' },
                title: { type: 'string' },
                body: { type: 'string' }
            },
            additionalProperties: false  // Không cho phép field thừa
        };

        const response = await request.get(`${baseURL}/posts/1`);
        const body = await response.json();

        const validate = ajv.compile(strictSchema);
        const isValid = validate(body);

        expect(isValid).toBe(true);
    });
});


import userSchema from '../schemas/user.schema.json';
import postSchema from '../schemas/post.schema.json';


test.describe('Contract Tests - Schema from Files', () => {

  test('validate single post schema', async ({ request }) => {
    const response = await request.get(`${baseURL}/posts/1`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    const validate = ajv.compile(userSchema);
    const isValid = validate(body);

    if (!isValid) {
      console.error('Errors:', JSON.stringify(validate.errors, null, 2));
    }
    expect(isValid).toBe(true);
  });

  test('validate posts list schema', async ({ request }) => {
    const response = await request.get(`${baseURL}/posts`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    const validate = ajv.compile(postSchema);
    expect(validate(body)).toBe(true);
  });

});

// require('fs');
// require('path');
import * as fs from 'fs';
import * as path from 'path';

// Helper function: load schema by name
function loadSchema(schemaName: string) {
  const filePath = path.join(__dirname, '..', 'schemas', `${schemaName}.schema.json`);
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

test.describe('Contract Tests - Dynamic Schema Loading', () => {

  test('validate post schema', async ({ request }) => {
    const schema = loadSchema('user');  // loads schemas/user.schema.json

    const response = await request.get(
      'https://jsonplaceholder.typicode.com/posts/1'
    );
    const body = await response.json();

    const validate = ajv.compile(schema);
    expect(validate(body)).toBe(true);
  });

});