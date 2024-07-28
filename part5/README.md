# Part 5: Testing React apps

- Login in frontend
- props.children and proptypes
- Testing React apps
- End to end testing: Playwright

---

> In this part we return to the frontend, first looking at different possibilities for testing the React code. We will also implement token based authentication which will enable users to log in to our application.

---

## Solutions of Part 5 exercises

### Requirements

- [Node.js](https://nodejs.org/en)
- [PNPM](https://pnpm.io/)

### Setup

```shell
# There are two folders for this part
# One folder holds the frontend and one folder holds the e2e tests

# Steps to run the e2e tests
# Run the backend bloglist
cd ../part4/bloglist
pnpm start:test # to start the test server for backend

# Then run the frontend bloglist
cd /part5/bloglist-frontend
pnpm dev # to start the development server

# Then run the e2e tests
cd /part5/bloglist-e2e
pnpm test
```
