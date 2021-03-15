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
  const popupTextArea = document.querySelector('#popup-textarea')
  const textToPost = popupTextArea.value
  const date = new Date().toString()
  apiFuncs.postData('https://gossip-girl-api.herokuapp.com/posts', {text: textToPost, date: date})
  location.reload()
})