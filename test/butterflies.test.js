import request from "supertest";
import { app, server } from "../app.js";
import db_connection from "../database/db_connection.js";
import ButterflyModel from "../models/ButterflyModel.js";

test("Estamos usando la base de datos de TEST", async () => {
    const [rows] = await db_connection.query("SELECT DATABASE() AS db");
    expect(rows[0].db).toMatch(/test/i);
});


describe("test butterfly crud", () => {

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
        test('should return array all of butterflies', async () => { // que devuelba una array con todos los libros
            expect(response.body).toBeInstanceOf(Array);
        })
    })
    describe("GET /butterflies/:id", () => {
        let response;
        let testButterfly;
        beforeEach(async () => {
            try {
                testButterfly = await ButterflyModel.create({
                    common_name: "test",
                    scientific_name: "test",
                    location: "test",
                    description: "esto es un test largo",
                    habitat: "test",
                    image: "https://test.com",
                    migratory: true
                });
            } catch (e) {
                console.error(
                    "Create failed:",
                    e.name,
                    e.message,
                    e.errors?.map(x => x.message),
                    e.parent?.sqlMessage //MySQL dice la columna exacta (ej: "Column 'createdAt' cannot be null")
                );
                throw e;
            }
            // Guardamos la respuesta que es que nos la creado de la petición GET en una constante reutilizable
            response = await request(app).get(`/butterflies/${testButterfly.id}`).send();

        });
        // Esto hace limpieza y aunque este aqui esto se ejecuta en cada test. Se podria poner despues de los test tambien para orden mental
        afterEach(async () => {
            if (testButterfly?.id) {
                await ButterflyModel.destroy({ where: { id: testButterfly.id } })
            }
        });

        test("should return 200 and the butterfly when id exists", () => {
            //Esperamos que el código de estado de la respuesta sea 200, que significa OK (todo correcto).
            expect(response.status).toBe(200);
            //erificamos que el body (JSON) que devolvió el servidor tiene una propiedad id y que su valor coincide con el id de la mariposa creada en beforeEach.
            expect(response.body).toHaveProperty("id", testButterfly.id);
            //Revisamos que dentro del JSON, la propiedad common_name sea exactamente "test"
            expect(response.body.common_name).toBe("test");
        });
        test("should return 404 when butterfly does not exist", async () => { // cuando la mariposa no existe 
            //Hacemos una petición GET a /butterflies/999999, un id inventado que sabemos que no está en la BD.
            const notFoundRes = await request(app).get("/butterflies/999999");
            //Esperamos que el servidor responda con el código 404 Not Found (recurso no encontrado).
            expect(notFoundRes.status).toBe(404);
            //Comprobamos que en el body hay una propiedad error.
            expect(notFoundRes.body).toHaveProperty("error");
        });

    })
    describe("DELETE /butterfly", () => {
        let response;
        let testButterfly;
        beforeEach(async () => {
            try {
                testButterfly = await ButterflyModel.create({
                    common_name: "test",
                    scientific_name: "test",
                    location: "test",
                    description: "esto es un test largo",
                    habitat: "test",
                    image: "https://test.com",
                    migratory: true
                });
            } catch (e) {
                console.error(
                    "Create failed:",
                    e.name,
                    e.message,
                    e.errors?.map(x => x.message),
                    e.parent?.sqlMessage //  MySQL dice la columna exacta (ej: "Column 'createdAt' cannot be null")
                );
                throw e;
            }

            response = await request(app).delete(`/butterflies/${testButterfly.id}`).send();

        });
        test('should return a response with status 200 and type json', async () => {
            expect(response.status).toBe(200); // responde en todo 200 o sea ok
            expect(response.headers['content-type']).toContain('json');
        })
        test('should return a message butterflies deleted successfully and delete the butterfly', async () => {
            expect(response.body.message).toContain("The butterfly has been deleted successfully!");
            const foundButterfly = await ButterflyModel.findOne({ where: { id: testButterfly.id } });
            expect(foundButterfly).toBeNull();// certifica que se ha elimiando
        })

    });
    describe("POST /butterflies", () => {
        let createdId;

        afterEach(async () => {
            if (createdId) {
                await ButterflyModel.destroy({ where: { id: createdId } });
                createdId = null;
            }
        });

        test("201: create butterfly when the body is valid", async () => {
            const res = await request(app)
                .post("/butterflies")
                .send({
                    common_name: "test",
                    scientific_name: "test",
                    location: "test",
                    description: "Descripción válida con más de diez caracteres.",
                    habitat: "test",
                    image: "https://example.com/morpho.jpg",
                    migratory: false
                })
                .set("Content-Type", "application/json");

            expect(res.status).toBe(201);
            expect(res.headers["content-type"]).toContain("json");
            expect(res.body.message).toBe("Mariposa creada correctamente");
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toHaveProperty("id");
            createdId = res.body.data.id;

            // Verifica en BD
            const inDb = await ButterflyModel.findByPk(createdId);
            expect(inDb).not.toBeNull();
            expect(inDb.common_name).toBe("test");
        });

        test("400: returns validation errors with invalid body", async () => {
            const res = await request(app)
                .post("/butterflies")
                .send({
                    common_name: "",
                    scientific_name: "",
                    location: "",
                    description: "corta",
                    habitat: "",
                    image: "no-url",
                    migratory: "quizas"
                })
                .set("Content-Type", "application/json");

            expect(res.status).toBe(400);
            expect(Array.isArray(res.body.errors)).toBe(true);
            expect(res.body.errors.length).toBeGreaterThan(0);
        });
    });
    //Test put
    describe("PUT /butterflies/:id", () => {

        let testButterfly;

        beforeEach(async () => {
            try {
                testButterfly = await ButterflyModel.create({
                    common_name: "test",
                    scientific_name: "test",
                    location: "test",
                    description: "esto es un test largo",
                    habitat: "test",
                    image: "https://test.com",
                    migratory: true
                });
            } catch (e) {
                console.error(
                    "Create failed:",
                    e.name,
                    e.message,
                    e.errors?.map(x => x.message),
                    e.parent?.sqlMessage //  MySQL dice la columna exacta (ej: "Column 'createdAt' cannot be null")
                );
                throw e;
            }

            
        });
        // Despues de cada test
        afterEach(async () => {
            if (testButterfly?.id) {
                await ButterflyModel.destroy({ where: { id: testButterfly.id } }); // Borra de la tabla la fila que tenga el id de mi mariposa de prueba
                testButterfly = null;//Después de borrar en la base de datos, dejas la variable vacía (null) para que no quede ningún dato guardado en memoria.
            }
        });
        test("200: update butterfly when is valid", async () => {

            const updatedButterfly = {
                common_name: "new test",
                scientific_name: "new test",
                location: "test",
                description: "esto es un test largo",
                habitat: "test",
                image: "https://newtest.com",
                migratory: true
            };
            const res = await request(app)
                .put(`/butterflies/${testButterfly.id}`)// llamamos a la creada arriba
                .send(updatedButterfly) // actualizamos la que hemos llamado
                .set("Content-Type", "application/json");//  Indica al servidor que el body que enviamos está en formato JSON,
            //   para que Express lo entienda y lo convierta en req.body.

            expect(res.status).toBe(200);//actualizacion correcta
            expect(res.headers["content-type"]).toContain("json")// respuesta en json
            expect(res.body.message).toBe("Mariposa actualizada correctamente");//Asegura que el mensaje sea igual que el del controlador
            expect(res.body).toHaveProperty("data")//revisa que exista la propiedad data en el body
            expect(res.body.data).toMatchObject({//compara que sea la misma actualizacioon
                id: testButterfly.id,
                common_name: "new test",
                scientific_name: "new test",
                migratory: true

            });
            //verificacion en la BD real que quede guardado
            const inDb = await ButterflyModel.findByPk(testButterfly.id);
            expect(inDb.common_name).toBe("new test");
            expect(inDb.migratory).toBe(true);


        });

        test("400: returns validation errors with an invalid body", async () => {
            const res = await request(app)
                .put(`/butterflies/${testButterfly.id}`)
                .send({
                    common_name: "",
                    scientific_name: "",
                    location: "",
                    description: "corta",
                    habitat: "",
                    image: "no-url",
                    migratory: "quizas"
                })
                .set("Content-Type", "application/json");

            expect(res.status).toBe(400);
            expect(Array.isArray(res.body.errors)).toBe(true);
            expect(res.body.errors.length).toBeGreaterThan(0);
        });
        test("404: returns a Not Found error when the ID does not exist", async () => {
            const res = await request(app)
                .put(`/butterflies/999999`)
                .send({
                    common_name: "X",
                    scientific_name: "Y",
                    location: "Z",
                    description: "Descripción válida con más de diez.",
                    habitat: "H",
                    image: "https://example.com/z.jpg",
                    migratory: true
                })
                .set("Content-Type", "application/json");

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("error");
        });
    });


});
