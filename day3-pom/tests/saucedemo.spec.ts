import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';

test.describe('SauceDemo Ecommerce - POM', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
    });

    test('should login successfully', async ({ page }) => {
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(inventoryPage.title).toHaveText('Products');
        await expect(page).toHaveURL(/inventory.html/);
    });

    test('should show error for locked out user', async () => {
        await loginPage.goto();
        await loginPage.login('locked_out_user', 'secret_sauce');
        await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
    });

    test('should add product to cart', async () => {
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.addToCartByName('Sauce Labs Backpack');
        await expect(inventoryPage.cartBadge).toHaveText('1');
        await expect(inventoryPage.inventoryItems.filter({ hasText: 'Sauce Labs Backpack' }).getByRole('button', { name: 'Remove' })).toBeVisible();
        await expect(inventoryPage.inventoryItems.filter({ hasText: 'Sauce Labs Backpack' }).getByRole('button', { name: 'Add to cart' })).not.toBeVisible();
    });

    test('should add and remove product from cart', async () => {
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.addToCartByName('Sauce Labs Backpack');
        await expect(inventoryPage.cartBadge).toHaveText('1');

        await inventoryPage.removeFromCartByName('Sauce Labs Backpack');
        await expect(inventoryPage.cartBadge).not.toBeVisible();
        await expect(inventoryPage.inventoryItems.filter({ hasText: 'Sauce Labs Backpack' }).getByRole('button', { name: 'Add to cart' })).toBeVisible();
    });

    test('should complete shopping flow', async () => {
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');

        await inventoryPage.addToCartByName('Sauce Labs Backpack');
        await inventoryPage.addToCartByName('Sauce Labs Bike Light');
        await expect(inventoryPage.cartBadge).toHaveText('2');

        await inventoryPage.goToCart();
        await expect(cartPage.cartItems).toHaveCount(2);
        await expect(cartPage.getItemByName('Sauce Labs Backpack')).toBeVisible();
        await expect(cartPage.getItemByName('Sauce Labs Bike Light')).toBeVisible();
    });
});
