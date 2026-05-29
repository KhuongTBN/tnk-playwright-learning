import {test, expect} from '@playwright/test';

test.describe('API Mocking - Request Interception', () => {
    const baseURL = 'https://jsonplaceholder.typicode.com';
    test('mock API response to test UI with custom data', async ({page}) => {
        const mockPost = {
            userId: 1,
            id: 1,
            title: 'Mocked Post Title',
            body: 'This is the body of the mocked post.'
        };
        // Intercept the API request and return the mocked response
        await page.route(`${baseURL}/posts/1`, async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockPost)
            });
        });
        
        // Navigate to the page that makes the API request
        await page.goto(`${baseURL}/posts/1`);
        await expect(page.getByText(mockPost.title)).toBeVisible();
        await expect(page.getByText(mockPost.body)).toBeVisible();
    });

    test('mock API error 500', async ({page}) => {
        // Intercept the API request and return a 500 error
        await page.route(`${baseURL}/posts/1`, async (route) => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({error: 'Internal Server Error'})
            });
        });

        // Navigate to the page that makes the API request
        await page.goto(`${baseURL}/posts/1`);
        await expect(page.getByText('Internal Server Error')).toBeVisible();
    });

    test('mock slow API response', async ({page}) => {
        const mockPost = {
            id: 1,
            title: 'Delayed Response'
        };
        await page.route(`**/posts/1`, async (route) => {
            //Delayed 3 seconds before responding
            await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate 3 seconds delay
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockPost)
            });
        });
        await page.goto(`${baseURL}/posts/1`);
        await expect(page.getByText(mockPost.title)).toBeVisible({ timeout: 10000});
    })
});