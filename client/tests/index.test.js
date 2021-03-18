const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

global.fetch = require('jest-fetch-mock');
const app = require('../static/js/api.js');

describe('app', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();


    })

    afterEach(() => {
        fetch.resetMocks();
    })

    describe('requests', () => {
        describe('getData', () => {
            test('it makes a get request to /posts', () => {
                app.getData('https://gossip-girl-api.herokuapp.com/posts');
                // expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/posts$/))
                expect(fetch.mock.calls[0][0]).toMatch(/posts$/)
            })
        });

        describe('postData', () => {
            test('it makes a post request to /posts with the blog entry data', () => {
                const fakeSubmitEvent = {
                    preventDefault: jest.fn(),
                    target: {
                        text: { value: 'Wow this test is the best!' },
                        hello: { value: 'hi' }
                    }
                }

                app.postData(fakeSubmitEvent);
                expect(fetch.mock.calls[0][1]).toHaveProperty('method', 'POST');
                expect(fetch.mock.calls[0][1]).toHaveProperty('body');
            })
        })

        describe('getData', () => {
            test('it makes a request to /', () => {
                app.getData('https://gossip-girl-api.herokuapp.com/');
                expect(fetch).toHaveBeenCalled();
            })
        })
    })

    describe('render handlers', () => {
        describe('renderItem', () => {
            test('it renders an element', () => {
                const handle = require('../static/js/handlers.js');
                const data = {
                    "id": 1,
                    "text": "Welcome to Gossip Girls!",
                    "date": "Mon Mar 15 2021 09:39:25 GMT+0000 (Greenwich Mean Time)",
                    "dateFrom": "2 days ago",
                    "comments": [],
                    "reactions": {
                        "happy": 0,
                        "funny": 0,
                        "unhappy": 0
                    },
                    "giphy": "ASd0Ukj0y3qMM"
                }
                expect(handle.renderItem(data).textContent).toContain("Welcome to Gossip Girls");

            })
        })

        describe('appendBlogEntry', () => {
            test('it renders a new div on the page with the entry data', () => {

            })
        })
        
        describe('addReaction', () => {
            test('if reaction calls patch data', () => {
            app.patchData('https://gossip-girl-api.herokuapp.com/posts/1/reactions');
            expect(fetch).toHaveBeenCalled()  
            })
        })

        describe('hot feature', () => {
            test('if hot button fetches the most engaging post', () => {
            app.getData('https://gossip-girl-api.herokuapp.com/')
            expect(fetch).toHaveBeenCalled()
     
            })
        })

        describe('new feature', () => {
            test('if new button fetches the most recent post', () => {
            app.getData('https://gossip-girl-api.herokuapp.com/')
            expect(fetch).toHaveBeenCalled()
     
            })
        })
    
     
            })
        })

