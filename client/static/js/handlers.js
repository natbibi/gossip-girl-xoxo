const giphy = require('./giphy')
const renderGif = giphy.vanillaJSGif

const apiFuncs = require('./api') 

function renderList(data){
    for (item of data) {
        document.getElementById('root').prepend(renderItem(item))
    }
    //function to render data to the DOM
}

function renderItem(data){
    // console.log(data)
    // return a full post element with text and gif + class names
    const postContainer = document.createElement('div')
    postContainer.className = "blog-entry" 
    const postText = document.createElement('p')
    postText.textContent = data.text
    const postDate = document.createElement('p')
    postDate.textContent = data.date
    postContainer.appendChild(postText)
    postContainer.appendChild(postDate)
    const postGif = document.createElement('div')
    if (data.giphy) {
        postContainer.appendChild(postGif)
        renderGif(postGif, data.giphy)
    }


    //make buttons
    const likeButton = document.createElement('button')
    likeButton.className = 'reaction-bttn'
    likeButton.textContent = '😍'
    postContainer.appendChild(likeButton)

    // const dislikeButton = document.createElement('button')
    // dislikeButton.className = 'reaction-bttn'
    // dislikeButton.textContent = '😱'
    // postContainer.appendChild(dislikeButton)

    // const laughButton = document.createElement('button')
    // laughButton.className = 'reaction-bttn'
    // laughButton.textContent = '😂'
    // postContainer.appendChild(laughButton)

    const commentButton = document.createElement('button')
    commentButton.className = 'comment-bttn'
    commentButton.textContent = 'comment'
    postContainer.appendChild(commentButton)

    commentButton.addEventListener('click', () => addComment(postContainer, commentButton))
    likeButton.addEventListener('click', () => addReaction())


    return postContainer
    
}

function addReaction(){
//send click to server

    const url = `https://gossip-girl-api.herokuapp.com/posts/1/reactions`
    const data = {reaction: "happy"}
    apiFuncs.patchData(url, data)

//send back number of times it has been clicked

}



function addComment(parent, commentButton){
const newComment = document.createElement('div')
//new text area
const textArea = document.createElement('textarea')
newComment.append(textArea)

//comment button to post value from text area
const commentSubmitBttn = document.createElement('button')
commentSubmitBttn.textContent = 'submit comment'

commentSubmitBttn.addEventListener('click', () => {
    const url = `https://gossip-girl-api.herokuapp.com/posts/1/comments`
    const commentValue = textArea.value
    const date = new Date().toString()
    const data = {text: commentValue, date: date}
    apiFuncs.patchData(url, data)
})
newComment.append(commentSubmitBttn)

parent.append(newComment)
// commentButton.addEventListener('click', () => newComment.remove())

}



module.exports = {
    renderList
}