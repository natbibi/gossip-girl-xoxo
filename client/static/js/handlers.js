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

    commentButton.addEventListener('click', () => addComment(postContainer, commentButton))




    return postContainer
    

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



//append text to post section
parent.append(newComment)
// commentButton.addEventListener('click', () => newComment.remove())



}


//popup speech bubble - text area 

//right id to submit text 

//create element to put text in

//append on submit, send data to server

module.exports = {
    renderList
}