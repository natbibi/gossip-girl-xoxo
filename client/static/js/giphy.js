const key = require('./key')
const GiphyJsFetchApi = require('@giphy/js-fetch-api')
const giphyComponents =  require('@giphy/js-components')
const renderCarousel = giphyComponents.renderCarousel
const GiphyFetch = GiphyJsFetchApi.GiphyFetch
const renderGif = giphyComponents.renderGif
const apiFuncs = require('./api')


//helper funcs for select styles
function toggleBorder(element){
    element.style.border = 'solid limegreen 4px'
}
function removeAllBorders(){
    const giphyGifs = document.getElementsByClassName('giphy-gif')
    for(let i=0; i<giphyGifs.length; i++) {
        giphyGifs[i].style.border = 'solid 4px transparent'
        giphyGifs[i].style.borderRadius = '12px'

    }
}
//async submit function in order to post then refresh on mobile browsers
async function submit(data) {
    await apiFuncs.postData('https://gossip-girl-api.herokuapp.com/posts', data)
    location.reload()
  }

const popupTextArea = document.querySelector('#popup-textarea')
const submitNewPost = document.querySelector('#submit-post')
let giphSelected = false
function prepPost(gifId){
    giphSelected = true
    let data = {}
    submitNewPost.onclick = () => {
        data.text = popupTextArea.value
        data.date = new Date().toString()
        data.giphy = gifId
        console.log(data)
        submit(data)
    }
}
submitNewPost.addEventListener("click", () => { 
    if (!giphSelected) {
    let data = {}
    data.text = popupTextArea.value
    data.date = new Date().toString()
    submit(data)
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
                  removeAllBorders()
                  toggleBorder(event.currentTarget)
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