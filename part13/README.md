# Part 13: Using relational databases

- Using relational databases with Sequelize
- Join tables and queries
- Migrations, many-to-many relationships

---

> In the previous sections of the course we used MongoDB for storing data, which is a so called NoSQL database. NoSQL databases became very common just over 10 years ago, when the scaling of the internet started to produce problems for relational databases that utilized the older generation SQL query language.

> Relational databases have since then experienced a new beginning. Problems with scalability have been partially resolved and they have also adopted some of the features of NoSQL databases. In this section we explore different NodeJS applications that use relational databases, we will focus on using the database PostgreSQL which is the number one in the open source world.

---

## Solutions of Part 13 exercises

### Requirements

> Node.js version has to be version 20 or higher because Node.js built in test runner is used for API testing

- [Node.js](https://nodejs.org/en)
- [PNPM](https://pnpm.io/)
- [Docker](https://www.docker.com/)

### Setup

```shell
# First setup a docker instance using the docker compose file
docker compose -f docker-compose.yml up

# You may enter into the postgres database once docker is setup
docker container ls

# Find the name of the docker container like database-container and run the following command
docker exec -it database-container psql -U postgres postgres

# You need to run migrations before running the tests. You can run migration when starting the server
pnpm start

# For testing, you can run
pnpm test

# For test-coverage, you can run
pnpm test:cover
```
