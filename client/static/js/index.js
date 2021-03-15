const giphy = require('./giphy')
const makeCarousel = giphy.makeCarousel
const renderGif = giphy.vanillaJSGif
const apiFuncs = require('./api')
const handlerFuncs = require('./handlers')

// on page load fetch all posts data and render them as post DOM items.
window.addEventListener("load", async () => {
  const data = await apiFuncs.getData('https://gossip-girl-api.herokuapp.com/posts')
  handlerFuncs.renderList(data)
})

document.querySelector('#popup-post').addEventListener("click", () => {
  const popupPostArea = document.querySelector('#popup-postarea')
  const popupTextArea = document.querySelector('#popup-textarea')
  popupPostArea.classList.toggle('display')
  popupTextArea.focus()
})


document.querySelector('#submit-post').addEventListener("click", () => {
  const textToPost = popupTextArea.value
  const date = new Date().toString()
  apiFuncs.postData('https://gossip-girl-api.herokuapp.com/posts', {text: textToPost, date: date})
})


function giphySearch() {
  const root = document.querySelector('#giphy-root')
  const query = document.querySelector('#giphy-search').value
  const grid = makeCarousel(root, query)
  document.querySelector('#search-giphy').addEventListener("click", () => {
    grid.remove()
    giphySearch()
  })
  document.querySelector('#clear-giphy').addEventListener("click", () => {
    grid.remove()
  })
}
giphySearch() 


