import { test, expect } from '@playwright/test';

test.describe('API Testing - ReqRes', () => {
    const baseURL = 'https://jsonplaceholder.typicode.com';

    // GET Request Test
    test('GET - list users', async ({ request }) => {
        const response = await request.get(`${baseURL}/users`);

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.length).toBe(10);
        expect(body[0]).toHaveProperty('id');
        expect(body[0]).toHaveProperty('name');
        expect(body[0]).toHaveProperty('email');
    });

    // ═══ GET by ID ═══
    test('GET - user by ID', async ({ request }) => {
        const userId = 1;
        const response = await request.get(`${baseURL}/users/${userId}`);

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body).toHaveProperty('id', userId);
        expect(body.name).toBe('Leanne Graham');
        expect(body.email).toBe('Sincere@april.biz');
        expect(body.address).toHaveProperty('street', 'Kulas Light');
    });

    // ═══ POST ═══
    test('POST - create new user', async ({ request }) => {
        const newUser = {
            title: 'Playwright API Test',
            body: 'Testing API with Playwright',
            userId: 1
        };
        const response = await request.post(`${baseURL}/posts`, {
            data: newUser
        });

        expect(response.status()).toBe(201);

        const body = await response.json();
        expect(body).toHaveProperty('id');
        expect(body.title).toBe(newUser.title);
        expect(body.body).toBe(newUser.body);
        expect(body.userId).toBe(newUser.userId);
        expect(body.id).toBeTruthy;
    });

    // ═══ PUT ═══
    test('PUT - update user', async ({ request }) => {
        const updatedUser = {
            title: 'Updated Title',
            body: 'Updated Body',
            userId: 1
        };
        const response = await request.put(`${baseURL}/posts/${updatedUser.userId}`, {
            data: updatedUser
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.title).toBe(updatedUser.title);
        expect(body.body).toBe(updatedUser.body);
        expect(body.userId).toBe(updatedUser.userId);
    });

    // ═══ DELETE ═══
    test('DELETE - delete user', async ({ request }) => {
        const userIdToDelete = 1;
        const response = await request.delete   (`${baseURL}/posts/${userIdToDelete}`);
        expect(response.status()).toBe(200);
    });
});