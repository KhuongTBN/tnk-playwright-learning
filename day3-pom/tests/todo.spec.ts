import {test, expect} from '@playwright/test';
import {TodoPage} from '../pages/todo.page';

test.describe('TodoMVC App - POM', () => {
    let todoPage: TodoPage;

    test.beforeEach(async ({page}) => {
        todoPage = new TodoPage(page);
        await todoPage.goto();
    });

    test('should add a new todo item', async () => {
        await todoPage.addTodo('Learn Playwright');
        await expect(todoPage.todoTitles).toHaveText(['Learn Playwright']);
        await expect(todoPage.todoCount).toHaveText('1 item left');
    });

    test('should mark a todo item as completed', async () => {
        await todoPage.addTodo('Learn Playwright');
        await todoPage.toggleTodo('Learn Playwright');
        await expect(todoPage.todoItems.first()).toHaveClass(/completed/);
        await expect(todoPage.todoCount).toHaveText('0 items left');
    });
    
    test('should delete a todo item', async () => {
        await todoPage.addTodo('Learn Playwright');
        await todoPage.deleteTodo('Learn Playwright');
        await expect(todoPage.todoTitles).not.toBeVisible();
        await expect(todoPage.todoItems).toHaveCount(0);
    });

    test('should filter todos', async () => {
        await todoPage.addTodo('Task1');
        await todoPage.addTodo('Task2');
        await todoPage.toggleTodo('Task1');

        await expect(todoPage.todoItems).toHaveCount(2);
        await expect(todoPage.todoItems.nth(0)).toHaveClass(/completed/);
        await expect(todoPage.todoItems.nth(1)).not.toHaveClass(/completed/);

        await todoPage.filterActive.click();
        await expect(todoPage.todoItems).toHaveCount(1);
        await expect(todoPage.todoTitles).toHaveText(['Task2']);

        await todoPage.filterCompleted.click();
        await expect(todoPage.todoItems).toHaveCount(1);
        await expect(todoPage.todoTitles).toHaveText(['Task1']);

        await todoPage.filterAll.click();
        await expect(todoPage.todoItems).toHaveCount(2);
        await expect(todoPage.todoTitles).toHaveText(['Task1', 'Task2']);
    });

    
});