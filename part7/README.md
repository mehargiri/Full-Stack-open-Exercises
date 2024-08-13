# Part 7: React Router, custom hooks, styling app with CSS and webpack

- React Router
- Custom hooks
- More about styles
- Webpack
- Class components, Miscellaneous
- Exercises: extending the bloglist

---

> The seventh part of the course touches on several different themes. First, we'll get familiar with React Router. React Router helps us divide the application into different views that are shown based on the URL in the browser's address bar. After this, we'll look at a few more ways to add CSS styles to React applications. During the entire course, we've used Vite to build all of our applications. It is also possible to configure the whole toolchain yourself, and in this part we will see how this can be done with a tool called Webpack. We shall also have a look at hook functions and how to define a custom hook.

---

## Solutions of Part 7 exercises

### Requirements

- [Node.js](https://nodejs.org/en)
- [PNPM](https://pnpm.io/)

### Setup

```shell
# There are various exercises in this part

# For any folders in part 7, do the following to download the necessary packages
cd routed-anecdotes # or other folders
pnpm i # to install the necessary packages
pnpm dev # to start the development server for react using vite

# The folders (bloglist-query and bloglist-redux) are just implementation of part5 bloglist using either React Query and Context or Redux ToolKit. These two folder need a backend (part4 bloglist) server to be turned on in order to function

# Bloglist-views has its own backend and frontend folder

# Country-hook folder uses external API so the vite development server can be started directly

# Routed-anecdotes does not use any API so the vite development server can be started directly

# Ultimate-hooks uses a json-server script to start a local backend server from a json file. After starting that, you can start the vite development server.
```
