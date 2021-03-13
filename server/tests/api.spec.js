const request = require('supertest');
// import server
const server = require('../server');

const data = require('../data.json')

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

  // it('responds to patch posts/:id with 200 and updates post data', (done) => {
  //     request(api).patch('/posts/1')
  // .send(data to update - testing response comments & emoji reactions)
  // .expect(200)
  // .expect(patchedData, done);
  // })

  // it('responds to post posts/:id with 200 and creates new post', (done) => {
  //     request(api).post('/posts/new')
  // .send(data to create)
  // .expect(200)
  // .expect(1 new post in posts list)
  // .expect(newPost, done);
  // })
});