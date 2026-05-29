import { test, expect } from '@playwright/test';

test.describe('API + UI Hydrid Tests', () => {
    const baseURL = 'https://jsonplaceholder.typicode.com';

    test('verify API data is displayed correctly on the UI', async ({ page, request }) => {
        const apiResponse = await request.get(`${baseURL}/posts/1`);
        const postData = await apiResponse.json();

        await page.goto(`${baseURL}/posts/1`);
        await expect(page.getByText(postData.title)).toBeVisible();
        await expect(page.getByText(postData.body.replace(/\n/g, '\\n'))).toBeVisible();
    });

    test('use API to set up data and verify it on the UI', async ({ page, request }) => {
        const newPost = {
            title: 'Test Post',
            body: 'This is a test post created via API.',
            userId: 1
        };
        
        const apiResponse = await request.post(`${baseURL}/posts`, {
            data: newPost
        });

        expect(apiResponse.status()).toBe(201);

        const createdPost = await apiResponse.json();
        expect(createdPost.id).toBeTruthy();

       //Mock GET response cho post vừa tạo
       await page.route(`**/posts/${createdPost.id}`, async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(createdPost)
            });
        });

        //Navigate — request bị intercept, trả về data đã tạo
        await page.goto(`${baseURL}/posts/${createdPost.id}`);
        await expect(page.getByText(newPost.title)).toBeVisible();
        await expect(page.getByText(newPost.body)).toBeVisible();
    });
});