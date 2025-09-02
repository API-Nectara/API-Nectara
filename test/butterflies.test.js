import request from "supertest"
import {app, server} from "../app.js"
import db_connection from "../database/db_connection.js"

describe("test butterfly crud", ()=>{
    beforeAll(async() => {
        await db_connection.authenticate()
    });
    describe("GET /butterflies", ()=>{
    let response
    beforeEach( async() => {
        response = await request(app).get('/butterflies').send()
    })
    test('should return a response with status 200 and type json', async() => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        })
    test('should return all butterflies', async() => {
            expect(response.body).toBeInstanceOf(Array);
        })
}) 
afterAll(async() =>{
        await db_connection.close()
        server.close()
    })
})