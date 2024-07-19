export const dummy = (blogs) => {
	return 1;
};

export const totalLikes = (blogs) => {
	return blogs.reduce((total, current) => total + current.likes, 0);
};

export const favoriteBlog = (blogs) => {
	if (blogs.length === 0) return {};

	return blogs.reduce(
		(maxBlog, current) => (current.likes > maxBlog.likes ? current : maxBlog),
		blogs[0]
	);
};

export const mostBlogs = (blogs) => {
	if (blogs.length === 0) return {};

	const authorBlogs = blogs.reduce((totalBlogs, currentBlog) => {
		totalBlogs[currentBlog.author] = (totalBlogs[currentBlog.author] ?? 0) + 1;
		return totalBlogs;
	}, {});

	const topAuthor = Object.keys(authorBlogs).reduce((maxAuthor, currAuthor) =>
		authorBlogs[maxAuthor] > authorBlogs[currAuthor] ? maxAuthor : currAuthor
	);

	return {
		author: topAuthor,
		blogs: authorBlogs[topAuthor],
	};
};

export const mostLikes = (blogs) => {
	if (blogs.length === 0) return {};

	const authorLikes = blogs.reduce((totalLikes, currentBlog) => {
		totalLikes[currentBlog.author] =
			(totalLikes[currentBlog.author] ?? 0) + currentBlog.likes;
		return totalLikes;
	}, {});

	const topAuthor = Object.keys(authorLikes).reduce((maxAuthor, currAuthor) =>
		authorLikes[maxAuthor] > authorLikes[currAuthor] ? maxAuthor : currAuthor
	);

	return {
		author: topAuthor,
		likes: authorLikes[topAuthor],
	};
};
