import { expect, test } from '@playwright/test';
import { createBlog, loginWith } from './helper.js';

const testUser = {
	username: 'root',
	password: 'password',
	name: 'John Doe',
};

const testBlog = {
	title: 'Test Title',
	author: 'Test Author',
	url: 'Test URL',
};

test.describe('Blog app', () => {
	test.beforeEach(async ({ page, request }) => {
		// empty db here
		await request.post('/api/testing/reset');
		// create user for backend here
		await request.post('/api/users', {
			data: testUser,
		});

		await page.goto('/');
	});

	test('login form is shown', async ({ page }) => {
		await expect(
			page.locator('h1:has-text("log in to blogs application")')
		).toBeVisible();
		await expect(page.locator('input#username')).toBeVisible();
		await expect(page.locator('input#password')).toBeVisible();
		await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
	});

	test.describe('Login', () => {
		test('succeeds with correct credentials', async ({ page }) => {
			await loginWith(page, testUser.username, testUser.password);
			await expect(page.getByText(`${testUser.name} logged in`)).toBeVisible();
		});

		test('fails with wrong credentials', async ({ page }) => {
			await loginWith(page, testUser.username, 'wrong');

			const errorDiv = page.locator('.error');
			await expect(errorDiv).toContainText('wrong username or password');
			await expect(errorDiv).toHaveCSS('border-style', 'solid');
			await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');

			await expect(
				page.getByText(`${testUser.name} logged in`)
			).not.toBeVisible();
		});
	});

	test.describe('When logged in', () => {
		test.beforeEach(async ({ page }) => {
			await loginWith(page, testUser.username, testUser.password);
		});

		test('a new blog can be created', async ({ page }) => {
			await createBlog(page, testBlog, testUser.name);
			expect(page.getByRole('button', { name: 'view' })).toBeVisible();

			await expect(
				page.getByText(`${testBlog.title} ${testBlog.author}`)
			).toBeVisible();
		});

		test.describe('and several blogs exists', () => {
			test.beforeEach(async ({ page }) => {
				await createBlog(
					page,
					{ ...testBlog, title: 'Test Title 1' },
					testUser.name
				);
				await createBlog(
					page,
					{ ...testBlog, title: 'Test Title 2' },
					testUser.name
				);
				await createBlog(
					page,
					{ ...testBlog, title: 'Test Title 3' },
					testUser.name
				);
			});

			test('one of the existing blog can be liked', async ({ page }) => {
				const blog = page.locator('.blog').filter({ hasText: 'Test Title 1' });

				await blog.getByRole('button', { name: 'view' }).click();

				await expect(blog.getByText('likes 0')).toBeVisible();

				await blog.getByRole('button', { name: 'like' }).click();

				await expect(blog.getByText('likes 1')).toBeVisible();
			});

			test('the user who created the blog can delete the blog', async ({
				page,
			}) => {
				const blog = page.locator('.blog').filter({ hasText: 'Test Title 2' });

				await blog.getByRole('button', { name: 'view' }).click();

				await expect(
					blog.getByRole('button', { name: 'remove' })
				).toBeVisible();

				page.on('dialog', async (dialog) => {
					expect(dialog.message()).toEqual(
						`Remove blog Test Title 2 by ${testBlog.author}`
					);
					await dialog.accept();
				});

				await page.getByRole('button', { name: 'remove' }).click();

				await expect(blog).not.toBeVisible();
			});

			test('only the user who created the blog can see the delete button', async ({
				page,
				request,
			}) => {
				const blog = page.locator('.blog').filter({ hasText: 'Test Title 3' });

				await blog.getByRole('button', { name: 'view' }).click();

				await expect(
					blog.getByRole('button', { name: 'remove' })
				).toBeVisible();

				await page.getByRole('button', { name: 'logout' }).click();

				await request.post('/api/users', {
					data: {
						username: 'test-user',
						password: 'test-password',
						name: 'John Cena',
					},
				});

				await loginWith(page, 'test-user', 'test-password');

				await blog.getByRole('button', { name: 'view' }).click();
				await expect(
					blog.getByRole('button', { name: 'remove' })
				).not.toBeVisible();
			});

			test('blogs are arranged in decreasing order according to total likes', async ({
				page,
			}) => {
				const blog1 = page.locator('.blog').filter({ hasText: 'Test Title 1' });
				const blog2 = page.locator('.blog').filter({ hasText: 'Test Title 2' });
				const blog3 = page.locator('.blog').filter({ hasText: 'Test Title 3' });

				await blog1.getByRole('button', { name: 'view' }).click();
				await blog2.getByRole('button', { name: 'view' }).click();
				await blog3.getByRole('button', { name: 'view' }).click();

				await blog2.getByRole('button', { name: 'like' }).click();
				await blog3.getByRole('button', { name: 'like' }).click();
				await blog3.getByRole('button', { name: 'like' }).click();

				await expect(blog1).toContainText('likes 0');
				await expect(blog2).toContainText('likes 1');
				await expect(blog3).toContainText('likes 2');

				await expect(page.locator('.blog').first()).toContainText(
					'Test Title 3'
				);
				await expect(page.locator('.blog').nth(1)).toContainText(
					'Test Title 2'
				);
				await expect(page.locator('.blog').last()).toContainText(
					'Test Title 1'
				);
			});
		});
	});
});
