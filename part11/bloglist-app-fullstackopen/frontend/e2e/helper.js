import { expect } from "@playwright/test";
export const loginWith = async (page, username, password) => {
	await page.locator("input#username").fill(username);
	await page.locator("input#password").fill(password);
	await page.getByRole("button", { name: "login" }).click();
};

export const createBlog = async (page, blog, user) => {
	await page.getByRole("button", { name: "new blog" }).click();
	await page.locator("input#title").fill(blog.title);
	await page.locator("input#author").fill(blog.author);
	await page.locator("input#url").fill(blog.url);
	await page.getByRole("button", { name: "create" }).click();

	const successDiv = page.locator(".success");

	await expect(successDiv).toContainText(
		`a new blog ${blog.title} by ${user} added`
	);

	await expect(successDiv).toHaveCSS("border-style", "solid");
	await expect(successDiv).toHaveCSS("color", "rgb(0, 128, 0)");
};
