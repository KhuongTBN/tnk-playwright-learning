import {test, expect} from '@playwright/test';

test.describe('TodoMVC App', () => {

    test.beforeEach(async ({page}) => {
        await page.goto('https://demo.playwright.dev/todomvc');
    });

    test('should add a new todo item', async ({page}) => {
        await page.getByPlaceholder('What needs to be done?').fill('Learn Playwright');
        await page.getByPlaceholder('What needs to be done?').press('Enter');

        await expect(page.getByTestId('todo-title')).toHaveText('Learn Playwright');
        await expect(page.getByText('1 item left')).toBeVisible();
    });

    test('should mark a todo item as completed', async ({page}) => {
        await page.getByPlaceholder('What needs to be done?').fill('Learn Playwright');
        await page.getByPlaceholder('What needs to be done?').press('Enter');

        await page.getByRole('checkbox', {name: 'Toggle Todo'}).check();
        await expect (page.getByTestId('todo-item')).toHaveClass('completed');
        await expect(page.getByText('0 items left')).toBeVisible();
    });

    test('should delete a todo item', async ({page}) => {
        await page.getByPlaceholder('What needs to be done?').fill('Learn Playwright');
        await page.getByPlaceholder('What needs to be done?').press('Enter');

        // await page.getByTestId('todo-item').hover();
        // await page.getByRole('button', { name: 'Delete' }).click();
        const todoItem = page.getByTestId('todo-item');
        await todoItem.hover();
        await todoItem.getByRole('button', { name: 'Delete' }).click();
        await expect (page.getByTestId('todo-item')).toHaveCount(0);
    });

    test('should filter active and completed todos', async ({ page }) => {
  await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('Task One');
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('Task Two');
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

  await page.getByRole('listitem').filter({ hasText: 'Task One' }).getByLabel('Toggle Todo').check();
  
  await page.getByRole('link', { name: 'Active' }).click();

  await expect(page.getByText('Task Two')).toBeVisible();
  await expect(page.getByTestId('todo-title')).toHaveText('Task Two');

  await page.getByRole('link', { name: 'Completed' }).click();
  await expect(page.getByText('Task One')).toBeVisible();
  await expect(page.getByTestId('todo-title')).toHaveText('Task One');

  await page.getByRole('link', { name: 'All' }).click();
   await expect(page.getByTestId('todo-title')).toHaveText(['Task One', 'Task Two'] );
    });

    test('should edit a todo item', async ({ page }) => {
   
  await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('abc');
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  await page.getByText('abc').dblclick();
  await page.getByRole('textbox', { name: 'Edit' }).fill('abc11111');
  await page.getByRole('textbox', { name: 'Edit' }).press('Enter');
    await expect(page.getByTestId('todo-title')).toHaveText('abc11111');
});
});
