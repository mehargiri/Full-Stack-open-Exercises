import mongoose from 'mongoose'
import assert from 'node:assert'
import { after, before, describe, test } from 'node:test'
import supertest from 'supertest'
import app from '../app.js'
import { createHashPassword } from '../controllers/users.js'
import { Blog } from '../models/blog.js'
import { User } from '../models/user.js'
import {
  blogs,
  blogsInDb,
  nonExistingId,
  rootUser,
  testBlog,
} from '../utils/test_helper.js'

const api = supertest(app)

before(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await createHashPassword(rootUser.password)

  const user = new User({ username: rootUser.username, passwordHash })

  const savedUser = await user.save()

  const blogObjs = blogs.map(
    (blog) => new Blog({ ...blog, user: savedUser._id.toString() })
  )

  const blogPromises = blogObjs.map((blog) => blog.save())

  user.blogs = [...blogObjs.map((blog) => blog._id.toString())]

  await Promise.all(blogPromises)
  await user.save()
})

describe('when there is blogs initially saved', async () => {
  let header
  before(async () => {
    const authResponse = await api.post('/api/login').send(rootUser)

    header = {
      Authorization: `Bearer ${authResponse.body.token}`,
    }
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, blogs.length)
  })

  describe('viewing a specific blog', () => {
    test('works with a valid id', async () => {
      const currentBlogs = await blogsInDb()
      const blog = currentBlogs[0]

      const response = await api
        .get(`/api/blogs/${blog.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(response.body, blog)
    })

    test('fails with HTTP 404 if blog does not exist', async () => {
      const validRemovedId = await nonExistingId()

      await api.get(`/api/blogs/${validRemovedId}`).expect(404)
    })

    test('fails with HTTP 400 if id is invalid', async () => {
      const invalidId = 'asdfgddsfdafsfdsfssfds'

      await api.get(`/api/blogs/${invalidId}`).expect(400)
    })
  })

  describe('creating a new blog', async () => {
    test('works with valid data', async () => {
      const newBlog = await api
        .post('/api/blogs')
        .set(header)
        .send(testBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const blogsAtLast = await blogsInDb()
      assert.strictEqual(blogsAtLast.length, blogs.length + 1)
      const blogTitles = blogsAtLast.map((blog) => blog.title)
      assert.ok(blogTitles.includes(testBlog.title))
      await Blog.findByIdAndDelete(newBlog.body.id)
    })
    test("works if data is missing 'likes' property and defaults the 'likes' property to 0", async () => {
      // eslint-disable-next-line no-unused-vars
      const { likes, ...validBlog } = testBlog
      const newBlog = await api
        .post('/api/blogs')
        .set(header)
        .send(validBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const blogsAtLast = await blogsInDb()
      assert.strictEqual(blogsAtLast.length, blogs.length + 1)
      assert.strictEqual(blogsAtLast[blogsAtLast.length - 1].likes, 0)
      await Blog.findByIdAndDelete(newBlog.body.id)
    })
    test('fails with HTTP 400 if data is invalid', async () => {
      // eslint-disable-next-line no-unused-vars
      const { title, url, ...invalidBlog } = testBlog
      await api.post('/api/blogs').set(header).send(invalidBlog).expect(400)
      const blogsAtLast = await blogsInDb()
      assert.strictEqual(blogsAtLast.length, blogs.length)
    })
    test('fails with HTTP 401 if token is not provided and the data is valid', async () => {
      await api.post('/api/blogs').send(testBlog).expect(401)
    })
  })

  describe('deleting a specific blog', () => {
    test('works with HTTP 204 if id is valid', async () => {
      const blogsAtFirst = await blogsInDb()
      const blog = blogsAtFirst[0]

      await api.delete(`/api/blogs/${blog.id}`).set(header).expect(204)

      const blogsAtEnd = await blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtFirst.length - 1)

      const blogTitles = blogsAtEnd.map((blog) => blog.title)
      assert.ok(!blogTitles.includes(blog.title))
    })

    test('fails with HTTP 404 if blog does not exist', async () => {
      const validRemovedId = await nonExistingId()

      await api.delete(`/api/blogs/${validRemovedId}`).set(header).expect(404)
    })

    test('fails with HTTP 400 if id is invalid', async () => {
      const invalidId = 'asdfgddsfdafsfdsfssfds'

      await api.delete(`/api/blogs/${invalidId}`).set(header).expect(400)
    })
  })

  describe('updating a specific blog', () => {
    test('works with valid data', async () => {
      const blogsAtFirst = await blogsInDb()
      const blogToUpdate = blogsAtFirst[0]

      const updatedBlog = await api
        .patch(`/api/blogs/${blogToUpdate.id}`)
        .set(header)
        .send({ likes: 35 })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb()
      const updatedBlogAtEnd = blogsAtEnd.filter(
        (blog) => blog.id === blogToUpdate.id
      )

      assert.strictEqual(updatedBlog.body.likes, updatedBlogAtEnd[0].likes)
    })

    test('fails with HTTP 404 if blog does not exist', async () => {
      const validRemovedId = await nonExistingId()

      await api.patch(`/api/blogs/${validRemovedId}`).set(header).expect(404)
    })

    test('fails with HTTP 400 if id is invalid', async () => {
      const invalidId = 'asdfgddsfdafsfdsfssfds'

      await api.patch(`/api/blogs/${invalidId}`).set(header).expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
