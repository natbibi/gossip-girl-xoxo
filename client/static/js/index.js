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

//async submit function in order to post then refresh on mobile browsers
// async function submit(data) {
// await apiFuncs.postData('https://gossip-girl-api.herokuapp.com/posts', data)
// location.reload()
// }
// document.querySelector('#submit-post').addEventListener("click", () => {
//   const popupTextArea = document.querySelector('#popup-textarea')
//   const textToPost = popupTextArea.value
//   const date = new Date().toString()
//   const data = { text: textToPost, date: date, giphy: giphy.makeCarousel() }
//   console.log(data)
//   submit(data)
// })


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