import request from "supertest";
import { app, server } from "../app.js";
import db_connection from "../database/db_connection.js";
import ButterflyModel from "../models/ButterflyModel.js";

describe("test butterfly crud", () => {
    beforeAll(async () => {
        await db_connection.authenticate();
        await db_connection.sync({ alter: true }); // o { force: true } si es BD solo de test
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
                    e.parent?.sqlMessage // 👈 MySQL dice la columna exacta (ej: "Column 'createdAt' cannot be null")
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

    });
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
                    e.parent?.sqlMessage // 👈 MySQL dice la columna exacta (ej: "Column 'createdAt' cannot be null")
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
            expect(response.body.message).toContain( "The butterfly has been deleted successfully!");
            const foundButterfly = await ButterflyModel.findOne({ where: { id: testButterfly.id } });
            expect(foundButterfly).toBeNull();// certifica que se ha elimiando
        })

    });
    
describe("POST /butterflies", () => {
        let response, newButterflyData;

        beforeEach(async () => {
            newButterflyData = {
                common_name: "New Butterfly",
                scientific_name: "Novus butterflyus",
                location: "New Location",
                description: "Descripción larga y suficiente para test",
                habitat: "New Habitat",
                image: "https://test.com/image.jpg",
                migratory: true
            };

            response = await request(app).post("/butterflies").send(newButterflyData);
        });

        afterEach(async () => {
            if (response.body?.id) {
                await ButterflyModel.destroy({ where: { id: response.body.id } });
            }
        });

        test("should return 201 and JSON response", () => {
            expect(response.status).toBe(201);
            expect(response.headers["content-type"]).toContain("json");
        });

        test("should return success message and saved butterfly", async () => {
            expect(response.body.message).toMatch(/creada correctamente/i); // flexible con el mensaje
            const saved = await ButterflyModel.findOne({ where: { id: response.body.id } });
            expect(saved).not.toBeNull();
        });

        test("should fail validation if required field missing", async () => {
            const invalidData = { ...newButterflyData, common_name: "" };
            const res = await request(app).post("/butterflies").send(invalidData);
            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].msg).toMatch(/obligatorio/i);
        });
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
        common_name: "Mariposa Azul",
        scientific_name: "Morpho peleides",
        location: "América Central",
        description: "Descripción válida con más de diez caracteres.",
        habitat: "Selva tropical",
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
    expect(inDb.common_name).toBe("Mariposa Azul");
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




    afterAll(async () => {
        await db_connection.close()
        server.close()
    })

})
