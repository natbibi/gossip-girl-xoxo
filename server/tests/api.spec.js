const request = require("supertest");
// import server
const server = require("../server");
const data = require("../data.json");

const testPost = {
  date: "Fri Mar 12 2021 22:39:25 GMT+0000 (Greenwich Mean Time)",
  text: "post text here",
  giphy: null,
};

const testComment = {
  date: "Fri Mar 12 2021 22:39:25 GMT+0000 (Greenwich Mean Time)",
  text: "post text here",
};

describe("API server", () => {
  let api;
  beforeAll(() => {
    // start the server and store it in the api variable
    api = server.listen(5000, () =>
      console.log("Test server running on port 5000")
    );
  });
  afterAll((done) => {
    // close the server, then run done
    console.log("Gracefully stopping test server");
    api.close(done);
  });
  it("responds to get / with status 200", (done) => {
    request(api).get("/").expect(200, done);
  });
  it("responds to non existing paths with 404", (done) => {
    request(api).get("/no").expect(404, done);
  });

  it("responds to get get /posts with 200 and all posts data", (done) => {
    request(api).get("/posts").expect(200).expect(data, done);
  });

  it("responds to get get /posts/:id with 200 and a specific post data", (done) => {
    request(api).get("/posts/1").expect(200).expect(data[0], done);
  });

  it("responds to post /posts/ with 200 and creates new post", (done) => {
    request(api)
      .post("/posts/new")
      .send(testPost)
      .expect(200)
      .expect({ id: 2, ...testPost }, done);
  });

  it("responds to patch posts/:id/comments with 200 and updates post comments", (done) => {
    request(api)
      .patch("/posts/1/comments")
      .send(testComment)
      .expect(204, done)
    // request get posts/1 comments to include testComment
  });

  it("responds to patch posts/:id/reactions with 200 and updates post reactions", (done) => {
    request(api).patch("/posts/1/reaction").send("happy").expect(204, done);
    // request get posts/1 reactions to include new reaction
  });
});
