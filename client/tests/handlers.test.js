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
