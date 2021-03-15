(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// get data
async function getData(url = '') {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

// post data
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  //patch

module.exports = {
    postData,
    getData
}
//post


},{}],2:[function(require,module,exports){
function renderList(data){
    for (item of data) {
        document.getElementById('root').prepend(renderItem(item))
    }
    //function to render data to the DOM
}

function renderItem(data){
    console.log(data)
    // return a full post element with text and gif + class names
    const postContainer = document.createElement('div')
    postContainer.className = "blog-entry" 
    const postText = document.createElement('p')
    postText.textContent = data.text
    const postDate = document.createElement('p')
    postDate.textContent = data.date
    postContainer.appendChild(postText)
    postContainer.appendChild(postDate)



    //make buttons
    const likeButton = document.createElement('button')
    likeButton.className = 'like-bttn'
    likeButton.textContent = '*'
    postContainer.appendChild(likeButton)

    const commentButton = document.createElement('button')
    commentButton.className = 'comment-bttn'
    commentButton.textContent = 'comment'
    postContainer.appendChild(commentButton)


    return postContainer

}

module.exports = {
    renderList
}
},{}],3:[function(require,module,exports){
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
},{"./api":1,"./handlers":2}]},{},[3]);
