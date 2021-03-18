const key = require('./key')
const GiphyJsFetchApi = require('@giphy/js-fetch-api')
const giphyComponents =  require('@giphy/js-components')
const renderCarousel = giphyComponents.renderCarousel
const GiphyFetch = GiphyJsFetchApi.GiphyFetch
const renderGif = giphyComponents.renderGif
const apiFuncs = require('./api')

const giphyHelpers = require('./giphyHelpers.js')

//async submit function in order to post then refresh on mobile browsers
async function submit(data) {
    await apiFuncs.postData('https://gossip-girl-api.herokuapp.com/posts', data)
    window.location.search = ''
    window.location.reload()
  }

const popupTextArea = document.querySelector('#popup-textarea')
const submitNewPost = document.querySelector('#submit-post')
let giphSelected = false
function prepPost(gifId){
    giphSelected = true
    let data = {}
    submitNewPost.onclick = () => {
        try {
            console.log(!document.getElementsByClassName('giphy-carousel')[0])
            if (!document.getElementsByClassName('giphy-carousel')[0]) gifId = null
            if (popupTextArea.value.length < 1) throw new Error('add some text!')
            data.text = popupTextArea.value
            data.date = new Date().toString()
            data.giphy = gifId
            console.log(data)
            submit(data)
        } catch(err) {
            alert('add some text!')
            throw err
        }
    }
}
submitNewPost.addEventListener("click", () => { 
    
    if (!giphSelected) {
        try {
            if (popupTextArea.value.length < 1) throw new Error('add some text!')
            let data = {}
            data.text = popupTextArea.value
            data.date = new Date().toString()
            submit(data)
        } catch(err) {
            alert('You haven\'t written anything')
            throw err
        }
    }
})



// create a GiphyFetch with your api key
// apply for a new Web SDK key. Use a separate key for every platform (Android, iOS, Web)
const gf = new GiphyFetch(key)

// Creating a carousel with window resizing and remove-ability
const makeCarousel = (targetEl, query) => {
    
    let selectedGif
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
                  giphyHelpers.removeAllBorders()
                  giphyHelpers.toggleBorder(event.currentTarget)
                  prepPost(gif.id)
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
    renderGif({ gif: gif1, width:  300, noLink: true }, mountNode)
}

// To remove
// grid.remove()

module.exports = { 
    makeCarousel,
    vanillaJSGif,
} 