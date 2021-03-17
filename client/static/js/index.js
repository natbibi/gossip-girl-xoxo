const giphy = require('./giphy')
const makeCarousel = giphy.makeCarousel
const renderGif = giphy.vanillaJSGif
const apiFuncs = require('./api')
const handlerFuncs = require('./handlers')

// on page load fetch all posts data and render them as post DOM items check url to find query to sort by.
let currentIndex = 0
window.addEventListener("load", async () => {
  const sortOrder = window.location.search
  if (sortOrder === '?hot') {
    const data = await apiFuncs.getData(`https://gossip-girl-api.herokuapp.com/posts/hot/${currentIndex}/${currentIndex + 5}`)
    handlerFuncs.renderList(data)
  }
  else {
    const data = await apiFuncs.getData(`https://gossip-girl-api.herokuapp.com/posts/${currentIndex}/${currentIndex + 5}`)
    handlerFuncs.renderList(data)
  }
  currentIndex += 5
  document.getElementById('get-more-posts').addEventListener("click", async () => {
    try {
      if (sortOrder === '?hot') {
        const newData = await apiFuncs.getData(`https://gossip-girl-api.herokuapp.com/posts/hot/${currentIndex}/${currentIndex + 5}`)
        if (newData.length === 0) throw new Error('no more posts')
        handlerFuncs.renderList(newData)
      }
      else {
        const newData = await apiFuncs.getData(`https://gossip-girl-api.herokuapp.com/posts/${currentIndex}/${currentIndex + 5}`)
        if (newData.length === 0) throw new Error('no more posts')
        handlerFuncs.renderList(newData)
      }
      currentIndex += 5
  } catch(err) {
    alert(err)
    throw err
  }
  })
})

function updateUrlQuery(query){
  window.location.search = query
}

document.querySelector('#hot-sort').addEventListener("click", () => updateUrlQuery('hot'))
document.querySelector('#new-sort').addEventListener("click", () => updateUrlQuery('new'))



document.querySelector('#popup-post').addEventListener("click", (event) => {
  event.currentTarget.classList.toggle('rotate')
  const popupPostArea = document.querySelector('#popup-postarea')
  const popupTextArea = document.querySelector('#popup-textarea')
  popupPostArea.classList.toggle('display')
  popupTextArea.focus()
})

function giphySearch() {
  const root = document.querySelector('#giphy-root')
  const query = document.querySelector('#giphy-search').value
  const grid = makeCarousel(root, query)
  document.querySelector('#search-giphy').addEventListener("click", () => {
    grid.remove()
    giphySearch()
  })
}
giphySearch()

document.querySelector('.icon').addEventListener('click', () => {
  document.querySelector(".sidenav").style.width = "50%";
})

document.querySelector('.close-icon').addEventListener('click', () => {
  document.querySelector(".sidenav").style.width = "0%";
})