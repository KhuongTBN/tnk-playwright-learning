import {type Page, type Locator, expect} from '@playwright/test';

export class TodoPage{
    readonly page: Page;
    readonly inputField: Locator;
    readonly todoItems: Locator;
    readonly todoTitles: Locator;
    readonly todoCount: Locator;
    readonly filterAll: Locator;
    readonly filterActive: Locator;
    readonly filterCompleted: Locator;

    constructor(page: Page){  
        this.page = page;
        this.inputField = page.getByPlaceholder('What needs to be done?');
        this.todoItems = page.getByTestId('todo-item');
        this.todoTitles = page.getByTestId('todo-title');
        this.todoCount = page.locator('.todo-count');
        this.filterAll = page.getByRole('link', { name: 'All' });
        this.filterActive = page.getByRole('link', { name: 'Active' });
        this.filterCompleted = page.getByRole('link', { name: 'Completed' });
      }
      async goto(){
        await this.page.goto('https://demo.playwright.dev/todomvc/#/');
      }

      async addTodo(text: string){
        await this.inputField.fill(text);
        await this.inputField.press('Enter');
      }

      async deleteTodo(text: string){
        const item = this.todoItems.filter({ hasText: text });
        await item.hover();
        await item.getByRole('button', { name: 'Delete' }).click();
      }

      async toggleTodo(text: string){
        const item = this.todoItems.filter({ hasText: text });
        await item.getByRole('checkbox').click();
      }

      async editTodo(oldText: string, newText: string){
        const item = this.todoItems.filter({ hasText: oldText });
        await item.dblclick();
        const editInput = item.getByRole('textbox');
        await editInput.fill(newText);
        await editInput.press('Enter');
      }

}