const giphy = require('./giphy')
const makeCarousel = giphy.makeCarousel
const renderGif = giphy.vanillaJSGif
const apiFuncs = require('./api')
const handlerFuncs = require('./handlers')

// on page load fetch all posts data and render them as post DOM items check url to find query to sort by.
async function runPage() {
  if (window.location.href.includes('post')) {
    try {
      const index = window.location.search.substring(1)
      const singleData = await apiFuncs.getData(`https://gossip-girl-api.herokuapp.com/posts/${index}`)
      handlerFuncs.renderList([singleData])
    } catch (err) {
      handlerFuncs.renderError('404: post not found 😞')
      throw err
    }
  }
  else {
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
            if (newData.length === 0) throw new Error('You\'re up to date 🎉 ')
            handlerFuncs.renderList(newData)
          }
          else {
            const newData = await apiFuncs.getData(`https://gossip-girl-api.herokuapp.com/posts/${currentIndex}/${currentIndex + 5}`)
            if (newData.length === 0) throw new Error('You\'re up to date 🎉 ')
            handlerFuncs.renderList(newData)
          }
          currentIndex += 5
        } catch (err) {
          alert('You\'re up to date 🎉 ')
          throw err
        }
      })
    })

    function updateUrlQuery(query) {
      window.location.search = query
    }



function giphySearch() {
  const cancelGiphy = document.getElementById('cancel-giphy-bttn')
  const root = document.querySelector('#giphy-root')
  const query = document.querySelector('#giphy-search')
  const grid = makeCarousel(root, query.value)
  document.querySelector('#search-giphy').addEventListener("click", () => {
  try {
      if (query.value.length < 1) throw new Error('no query entered')
      cancelGiphy.classList.add('display')
      grid.remove()
      giphySearch()
      cancelGiphy.addEventListener("click", () => {
        query.value = ''
        cancelGiphy.classList.remove('display')
        grid.remove()
      })
  } catch(err) {
    alert('You haven\'t written anything')
    throw err
  }
})
}
giphySearch()


    document.querySelector('#hot-sort').addEventListener("click", () => updateUrlQuery('hot'))
    document.querySelector('#new-sort').addEventListener("click", () => updateUrlQuery('new'))

 const popupTextArea = document.querySelector('#popup-textarea')
 const popupPostArea = document.querySelector('#popup-postarea')

    document.querySelector('#popup-post').addEventListener("click", (event) => {
      event.currentTarget.classList.toggle('rotate')
      popupPostArea.classList.toggle('display')
      popupTextArea.focus()

    })

    popupTextArea.addEventListener('input', () => updateCharacterValue(popupTextArea, popupPostArea))

  }
}
runPage()

function updateCharacterValue(popupTextArea, popupPostArea){
  const logCharacterInput = popupTextArea.value.length
  const displayCharacterLength = document.querySelector('#the-count')
  
  displayCharacterLength.textContent = `${logCharacterInput}/300 characters`
  if (logCharacterInput > 0 && logCharacterInput < 200){
  displayCharacterLength.style.color = "var(--text-color)"
 } else {
   displayCharacterLength.style.color = "limegreen"
 }
}


// Nav button opens and closes on click
document.querySelector('.icon').addEventListener('click', () => {
  document.querySelector(".sidenav").style.width = "50%";
})

document.querySelector('.close-icon').addEventListener('click', () => {
  document.querySelector(".sidenav").style.width = "0%";
})

// Dark Mode 

document.querySelector('.dark-mode-button').addEventListener('click', () => {
  document.body.classList.toggle('dark')
})
