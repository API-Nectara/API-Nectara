import request from "supertest";
import {app, server} from "../app.js";
import db_connection from "../database/db_connection.js";

describe("test butterfly crud", () => {
    beforeAll(async () => {
        await db_connection.authenticate();
    })
    describe("GET /butterflies", () => {
        let response
        beforeEach(async () => {
            response = await request(app).get('/butterflies').send()// aqui se necesita el supertest
        })
        test('should return a response with status 200 and type json', async () => {
            //como tengo el befreEach ya no necesito esta parte:
            // const response = await request(app).get('/butterflies').send()
            expect(response.status).toBe(200); // responde en todo 200 o sea ok
            expect(response.headers['content-type']).toContain('json');
        })
        test('should return array all of butterflies', async() => { // que devuelba una array con todos los libros
            expect(response.body).toBeInstanceOf(Array);
        })
    })
    
    afterAll( async() =>{
   await db_connection.close()
    server.close()
    })
  
})
