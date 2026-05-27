import {test, expect} from '@playwright/test';

test.describe('Locator Strategies - The Internet', () => {
  // ═══ LOGIN PAGE ═══
  // Practice: getByRole, getByLabel, CSS selector, assertions
    test ('Login - valid credentials', async ({page}) => {
      await page.goto('https://the-internet.herokuapp.com/login');
      await page.getByRole('textbox', {name: 'Username'}).fill('tomsmith');
      await page.getByLabel('Password').fill('SuperSecretPassword!');
      await page.getByRole('button', {name: 'Login'}).click();
      await expect(page.getByRole('alert')).toHaveText(/You logged into a secure area!/); // -> Failed
      await expect(page.getByText('You logged into a secure area!')).toBeVisible(); // -> Passed
      await expect(page).toHaveURL('https://the-internet.herokuapp.com/secure');
    });

    test ('Login - invalid credentials', async ({page}) => {
      await page.goto('https://the-internet.herokuapp.com/login');
      await page.getByLabel('Username').fill('invalidUser');
      await page.getByLabel('Password').fill('invalidPass');
      await page.getByRole('button', {name: 'Login'}).click();
      await expect(page.getByText('Your username is invalid!')).toBeVisible();
    });

    // ═══ DROPDOWN ═══
  // Practice: getByRole('combobox'), selectOption, toHaveValue
    test('Dropdown - select option', async ({page}) => {    
        await page.goto('https://the-internet.herokuapp.com/dropdown');
        const dropdown = page.getByRole('combobox');
        await dropdown.selectOption({label: 'Option 1'});
        await expect(dropdown).toHaveValue('1');
        await dropdown.selectOption({label: 'Option 2'});
        await expect(dropdown).toHaveValue('2');

    });


  // ═══ CHECKBOXES ═══
  // Practice: check, uncheck, toBeChecked
    test('Checkboxes - check and uncheck', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/checkboxes');
        const checkboxes = page.getByRole('checkbox');
        await expect(checkboxes.nth(0)).not.toBeChecked();
        await checkboxes.nth(0).click();
        await expect(checkboxes.nth(0)).toBeChecked();
        await checkboxes.nth(0).uncheck();
        await expect(checkboxes.nth(0)).not.toBeChecked();

        await expect(checkboxes.nth(1)).toBeChecked();
        await checkboxes.nth(1).click();
        await expect(checkboxes.nth(1)).not.toBeChecked();
        await checkboxes.nth(1).check();
        await expect(checkboxes.nth(1)).toBeChecked();
    });


// ═══ DYNAMIC LOADING ═══
  // Practice: auto-waiting, toBeVisible with loading state
    test('Dynamic Loading - wait for element', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
        await page.getByRole('button', {name: 'Start'}).click();
        const loadingIndicator = page.getByText('Loading...');
        // await expect(loadingIndicator).toBeVisible();
        // await expect(loadingIndicator).not.toBeVisible({timeout: 5900});
        await expect(page.getByText('Hello World!')).toBeVisible({timeout: 6000});
        // await expect(page.getByText('Hello World!')).toBeVisible();
    })


// ═══ FILE UPLOAD ═══
  // Practice: setInputFiles, locator('input[type="file"]')
    test('File Upload - upload a file', async ({page}) => {
        //Declare a file path and create a test file
        const filePath = 'tests/test-upload.txt';
        const fs = require('fs');
        fs.writeFileSync(filePath, 'This is a test file for upload.');

        await page.goto('https://the-internet.herokuapp.com/upload');
        await page.locator('#file-upload').setInputFiles(filePath);
        await page.getByRole('button', {name: 'Upload'}).click();

        await expect(page.getByText('File Uploaded!')).toBeVisible();
        await expect (page.locator('#uploaded-files')).toHaveText('test-upload.txt');

        
        fs.unlinkSync(filePath);

    });

// ═══ HOVERS ═══
  // Practice: hover, locator chaining, nth
    test('Hovers - reveal hidden info on hover', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/hovers');
        const figures = page.locator('.figure');
        await figures.nth(0).hover();
        await expect(figures.nth(0).getByRole('heading', {name: 'name: user1'})).toBeVisible();
        await expect(figures.nth(0).getByRole('link', {name: 'View profile'})).toBeVisible();
        await figures.nth(1).hover();
        await expect(figures.nth(1).getByRole('heading', {name: 'name: user2'})).toBeVisible();
        await expect(figures.nth(1).getByRole('link', {name: 'View profile'})).toBeVisible();
        await figures.nth(2).hover();
        await expect(figures.nth(2).getByRole('heading', {name: 'name: user3'})).toBeVisible();
        await expect(figures.nth(2).getByRole('link', {name: 'View profile'})).toBeVisible();
    });

});