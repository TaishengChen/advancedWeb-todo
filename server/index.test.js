import {initializeTestDb, insertTestUser, getToken} from "./helpers/test.js";

const base_url = 'http://localhost:3001'

import {expect} from "chai"
import dotenv from "dotenv";

dotenv.config();

describe('GET Tasks', () => {
    beforeEach(async () => {
        await initializeTestDb();
        await insertTestUser('testname@foo.com', 'test1234');
    });

    it('should get all tasks', async () => {
        const response = await fetch('http://localhost:3001')
        const data = await response.json()

        expect(response.status).to.equal(200)
        expect(data).to.be.an('array').that.is.not.empty
        expect(data[0]).to.include.all.keys('id', 'description')
    })
})

describe('POST task', () => {
    const email = 'testname@foo.com'
    const password = 'test1234'
    insertTestUser(email, password)
    // const token = getToken(email)
    const token = `Bearer ${getToken(email)}`;

    it('should post a task', async () => {
        const response = await fetch(base_url + '/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify({'description': 'Task from unit test'})
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })

    it('should not post a task without description', async () => {
        const response = await fetch(base_url + '/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify({'description': null})
        })
        const data = await response.json()
        expect(response.status).to.equal(400)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it('should not post a task without zero length description', async () => {
        const response = await fetch(base_url + '/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify({'description': ""})
        })
        const data = await response.json()
        expect(response.status).to.equal(400,data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
})

describe('DELETE task', () => {
    const token = `Bearer ${getToken('testname@foo.com')}`;

    it('should delete a task', async () => {
        const response = await fetch(base_url + '/delete/5', {
            method: 'delete',
            headers: {
                Authorization: token
            },
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })

    it('should not delete a task with SQL injection', async () => {
        const response = await fetch(base_url + '/delete/id = 0 or id > 0', {
            method: 'delete',
            headers: {
                Authorization: token
            },
        })
        const data = await response.json()
        expect(response.status).to.equal(500)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
})

describe('POST register', () => {
    const email = `test${Math.random() * Math.random()}@foo.com`
    const password = 'test12345'
    it('should register with a valid email and password', async () => {
        const response = await fetch(base_url + '/user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email': email, 'password': password})
        })
        const data = await response.json()
        expect(response.status).to.equal(201, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id', 'email')
    })

    it('should not post a user with less than 8 character password', async () => {
        const email = `test${Math.random() * Math.random()}@foo.com`
        const password = 'short1'
        const response = await fetch(base_url + '/user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': email, 'password': password })
        })
        const data = await response.json()
        expect(response.status).to.equal(400, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

})

describe('POST login', () => {
    const email = 'testname@foo.com'
    const password = 'test1234'
    insertTestUser(email, password)
    it('should login with a valid credentials', async () => {
        const response = await fetch(base_url + '/user/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email': email, 'password': password})
        })
        const data = await response.json()
        expect(response.status).to.equal(200, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id', 'email', 'token')
    })
})