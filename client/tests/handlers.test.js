const handlers = require('../static/js/handlers.js');
const giphy = require('../static/js/giphy.js');

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

global.fetch = require('jest-fetch-mock');


describe('simple handlers', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = `<div id="root"></div>`
        global.root = document.getElementById('root')
    })

    it('should return a comment', () => {
        expect(handlers.renderComment({text: 'hello'}).className).toBe(`comment-item`)
    })

    it('should render an error', () => {
        handlers.renderError('oops')
        expect(root.innerHTML).toBe(`<div class=\"error\">oops</div>`)
    })

    it('should return a random class', () => {
        expect(handlers.randomclass().includes('blog-entry-font-')).toBe(true)
    })

    describe('giphy handlers', () => {

        it('should have a function to render a gif', () => {
            expect(typeof giphy.vanillaJSGif).toBe('function')
        })

        it('should have a function to render a coursel', () => {
            expect(typeof giphy.makeCarousel).toBe('function')
        })

        it('should have a function to submit gif and post text', () => {
            expect(typeof giphy.submit).toBe('function')
        })
    })
})

describe('add comment', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = `<div class="blog-entry"><p class="blog-entry-timestamp">4 days ago</p><p class="blog-entry-font-1 blog-entry-main">Welcome to Gossip Girls!</p><div class="gifCont"><div class="giphy-gif css-7y12f" style="width: 300px; height: 225px;"><div style="width: 300px; height: 225px; position: relative;"><picture><source type="image/webp" srcset="https://media4.giphy.com/media/ASd0Ukj0y3qMM/200.webp?cid=5ec7c15492ebfb87dcc29857034ad87a0985d69e78977608&amp;rid=200.webp&amp;ct=g"><img class="giphy-gif-img giphy-img-loaded" src="https://media4.giphy.com/media/ASd0Ukj0y3qMM/200.gif?cid=5ec7c15492ebfb87dcc29857034ad87a0985d69e78977608&amp;rid=200.gif&amp;ct=g" width="300" height="225" alt="The Simpsons Hello GIF" style="background: rgb(255, 102, 102);"></picture><div></div></div></div></div><button aria-label="love-emoji-button" class="reaction-bttn">😍</button><span class="reaction-badge">0</span><button aria-label="shock-emoji-button" class="reaction-bttn">😱</button><span class="reaction-badge">0</span><button aria-label="laugh-emoji-button" class="reaction-bttn">😂</button><span class="reaction-badge">0</span><button class="first-to-comment tertiary-bttn">comment</button><button aria-label="share" class="share-button"><i class="fas fa-share-square" aria-hidden="true"></i></button><div></div><button class="read-comment-bttn" data-comments="4">show 4 comments</button><div class="comment-cont"><p class="comment-item">new</p><p class="comment-item">test</p><p class="comment-item">test</p><p class="comment-item">test</p></div></div>`
        global.parentO = document.getElementsByClassName('comment-cont')[0]
        global.topParentO = document.getElementsByClassName('blog-entry')[0]
        // global.button = document.getElementsByClassName('first-to-comment')[0]


    })

    it('should add a textarea for posting comments', async () => {
        await handlers.addComment(parentO, topParentO, 1);
        expect(parentO.innerHTML).toBe('<p class=\"comment-item\">new</p><p class=\"comment-item\">test</p><p class=\"comment-item\">test</p><p class=\"comment-item\">test</p><div class=\"post-comment-cont\"><textarea class=\"post-comment-textarea\" placeholder=\"Share your thoughts 💭\"></textarea><button class=\"primary-bttn\">reply</button></div>');
      });

    })