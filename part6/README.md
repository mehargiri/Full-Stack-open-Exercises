# Part 6: Advanced State Management

- Flux-architecture and Redux
- Many reducers
- Communicating with server in a Redux application
- React Query, useReducer and the context

---

> So far, we have placed the application's state and state logic directly inside React components. When applications grow larger, state management should be moved outside React components. In this part, we will introduce the Redux library, which is currently the most popular solution for managing the state of React applications.

---

## Solutions of Part 6 exercises

### Requirements

- [Node.js](https://nodejs.org/en)
- [PNPM](https://pnpm.io/)

### Setup

```shell
# There are three folders for this part
# Two folders (redux-anecdotes and unicafe-redux) uses Redux for state management
# (query-anecdotes) uses React Query and React Context API for state management

# Steps to run redux-anecdotes or query-anecdotes application
cd ../part6/redux-anecdotes
pnpm db # to start the backend json-server
pnpm dev # to start the vite react front-end

# Steps to run the unicafe-redux application
cd ../part6/unicafe-redux
pnpm dev # to start the vite react front-end
pnpm test # to perform tests
```
