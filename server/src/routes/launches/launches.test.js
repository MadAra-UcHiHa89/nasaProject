const request = require("supertest");

const app = require("../../app");
const { connectToDB } = require("../../services/mongo");

describe("Testing the whole API", () => {
  beforeAll(async () => {
    await connectToDB();
  });

  describe("Test /GET lauches", () => {
    test("it should give a 200 response", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Test POST /launches", () => {
    const completeLaunchData = {
      mission: "USS Entr",
      rocket: "Falcon 9",
      target: "Kepler-186 f",
      launchDate: "January 1, 2024",
    };

    const launchDataWithoutDate = {
      mission: "USS Entr",
      rocket: "Falcon 9",
      target: "Kepler-186 f",
    };

    const launchDataWithoutMission = {
      rocket: "Falcon 9",
      target: "Kepler-186 f",
      launchDate: "January 1, 2024",
    };

    const launchDataWithInvalidDate = {
      mission: "USS Entr",
      rocket: "Falcon 9",
      target: "Kepler-186 f",
      launchDate: "hello",
    };

    test("It should respond with 201 created ", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201); // Supertest assertions to check the response

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const respsonseDate = new Date(response.body.launchDate).valueOf();

      expect(requestDate).toBe(respsonseDate); //Jest asserstion to check that the date which are in different format
      // represent the same date or not.

      expect(response.body).toMatchObject(launchDataWithoutDate); // Checking if the respsonse body has same
      // expected fields as the one sent in the request body with the .toMatchObject() method
    });
    test("It should catch missing fields / poperties ", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutMission)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Please provide all the required fields",
      });
    });
    test("It should  catch invalid dates ", async () => {
      const respsonse = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect(400);

      expect(respsonse.body).toStrictEqual({
        error: "Please provide a valid date",
      });
    });
  });
});
