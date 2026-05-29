import { test, expect } from '@playwright/test';
const toJsonSchema = require('to-json-schema');
const fs = require('fs');
const path = require('path');

test.describe('Schema Generator', () => {

  test('generate schema from API response', async ({ request }) => {
    // Gọi API lấy response thật
    const response = await request.get(
      'https://jsonplaceholder.typicode.com/posts/1'
    );
    const body = await response.json();

    // Generate schema từ response
    const schema = toJsonSchema(body, {
      required: true,           // tất cả fields thành required
      objects: { additionalProperties: false }
    });

    console.log(JSON.stringify(schema, null, 2));

    // Auto-save schema to file
    const filePath = path.join(__dirname, '..', 'schemas', 'post-generated.schema.json');
    fs.writeFileSync(filePath, JSON.stringify(schema, null, 2));
    console.log('Schema saved to:', filePath);
  });

});