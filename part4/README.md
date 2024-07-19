# Part 4: Testing Express servers, user administration

- Structure of backend application, introduction to testing
- Testing the backend
- User administration
- Token authentication

---

> In this part, we will continue our work on the backend. Our first major theme will be writing unit and integration tests for the backend. After we have covered testing, we will take a look at implementing user authentication and authorization.

---

## Solutions of Part 4 exercises

### Requirements

- [Node.js](https://nodejs.org/en)
- [PNPM](https://pnpm.io/)

### Setup

```shell
# Go to the bloglist folder
cd bloglist
pnpm install # to install all the packages
pnpm dev # to start the development build
# OR
pnpm start # to start the production build
# OR
pnpm test # to perform the tests for the backend controller functions

# You also need to create a .env file with the following values
PROD_MONGO_URI=
PORT=
TEST_MONGO_URI=
JWT_SECRET=
```
