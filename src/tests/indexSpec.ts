import * as supertest from "supertest";
import app from "../index";

const request = supertest(app);
const width = 100;
const height = 100;
const name = "nature";

describe("***API routes***", () => {
    it("expects 'home' route to respond with status 200 success", async done => {
        const response = await request.get("/api");
        expect(response.status).toBe(200);
        done();
    });

    it("expects 'placeholder' route to respond with status 200", async done => {
        const response = await request.get(
            `/api/placeholder/${width}/${height}`
        );
        expect(response.status).toBe(200);
        done();
    });

    it("expect 'placeholder' route to respond with image buffer", async done => {
        const response = await request.get(
            `/api/placeholder/${width}/${height}`
        );
        expect(typeof response.body === "object").toBeTruthy();
        done();
    });

    it("expect 'image' resize route to respond with status 200", async done => {
        const response = await request.get(
            `/api/image?name=${name}&width=${width}&height=${height}`
        );
        expect(response.status).toBe(200);
        done();
    });

    it("expect 'image' resize route to respond with image buffer", async done => {
        const response = await request.get(
            `/api/image?name=${name}&width=${width}&height=${height}`
        );
        expect(typeof response.body === "object").toBeTruthy();
        done();
    });
});
