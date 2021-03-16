const giphy = require('./giphy')
const renderGif = giphy.vanillaJSGif

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
    // apend the giphy gif if it exists
    // const postGif = document.createElement('div')
    // postContainer.appendChild(postGif)
    // renderGif(data.giphy, postGif)


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