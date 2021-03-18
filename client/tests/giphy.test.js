const path = require('path');

global.fetch = require('jest-fetch-mock');
const giphyFuncs = require('../static/js/giphyHelpers')

describe('dom tests for giphy', () => {

    beforeEach(() => {
        document.documentElement.innerHTML = `<div class="giphy-gif"></div>`
        global.giphyGif = document.getElementsByClassName('giphy-gif')[0]
    })
    it('should remove a border on all giphy', () => { 
        giphyFuncs.removeAllBorders()
        expect(giphyGif.style.border).toBe('4px solid transparent')
        expect(giphyGif.style.borderRadius).toBe('12px')
     })
     it('should add a border to a element', () => {
        giphyFuncs.toggleBorder(giphyGif)
        expect(giphyGif.style.border).toBe('4px solid limegreen')
     })

    
})

