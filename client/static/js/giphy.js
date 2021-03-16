const key = require('./key')

const GiphyJsFetchApi = require('@giphy/js-fetch-api')
const giphyComponents =  require('@giphy/js-components')
const renderCarousel = giphyComponents.renderCarousel
const GiphyFetch = GiphyJsFetchApi.GiphyFetch
const renderGif = giphyComponents.renderGif

//helper funcs for select styles
function toggleBorder(element){
    element.style.border = 'solid pink 4px'
}
function removeAllBorders(){
    const giphyGifs = document.getElementsByClassName('giphy-gif')
    for(let i=0; i<giphyGifs.length; i++) {
        giphyGifs[i].style.border = 'solid 4px transparent'
        giphyGifs[i].style.borderRadius = '12px'

    }
}
// create a GiphyFetch with your api key
// apply for a new Web SDK key. Use a separate key for every platform (Android, iOS, Web)
const gf = new GiphyFetch(key)

// Creating a carousel with window resizing and remove-ability
const makeCarousel = (targetEl, query) => {
    const fetchGifs = (offset) => {
        return gf.search(query, {offset, sort: 'relevant', lang: 'en', limit: 3})
    }
    const render = () => {
        // here is the @giphy/js-components import
        return renderCarousel(
            {
              gifHeight: 100,
              noLink: true,
              hideAttribution: true,
              user: {},
              fetchGifs,
              gutter: 0,
              onGifClick: (gif, event) => {
                  event.preventDefault();
                  console.log(gif)
                  removeAllBorders()
                  toggleBorder(event.currentTarget)
                }
            },
            targetEl
          );
    }
    const remove = render()
    return {
        remove: () => {
            remove()
        },
    }
}

// create a GiphyFetch with your api key
// apply for a new Web SDK key. Use a separate key for every platform (Android, iOS, Web)

const vanillaJSGif = async (mountNode, id) => {
    // render a single gif
    const { data: gif1 } = await gf.gif(id)
    renderGif({ gif: gif1, width: 300 }, mountNode)
}

// To remove
// grid.remove()

module.exports = { 
    makeCarousel,
    vanillaJSGif
} 