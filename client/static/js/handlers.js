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
    postText.className = "blog-entry-text"
    const postDate = document.createElement('p')
    postDate.textContent = data.date
    postContainer.appendChild(postText)
    postContainer.appendChild(postDate)
    const postGif = document.createElement('div')
    if (data.giphy) {
        postContainer.appendChild(postGif)
        renderGif(postGif, data.giphy)
    }


    //make like button
    const likeButton = document.createElement('button')
    likeButton.className = 'reaction-bttn'
    likeButton.textContent = '😍'
    postContainer.appendChild(likeButton)

    //make shocked/unhappy button 
    const shockedButton = document.createElement('button')
    shockedButton.className = 'reaction-bttn'
    shockedButton.textContent = '😱'
    postContainer.appendChild(shockedButton)

    //make laugh button 
    const laughButton = document.createElement('button')
    laughButton.className = 'reaction-bttn'
    laughButton.textContent = '😂'
    postContainer.appendChild(laughButton)

    //make comment button 
    const commentButton = document.createElement('button')
    commentButton.className = 'comment-bttn'
    commentButton.textContent = 'comment'
    postContainer.appendChild(commentButton)


    //show number of likes 
    const numberOfLikes = data.reactions.happy
    const showTotalLikes = document.createElement('span') 
    showTotalLikes.className = "reaction-number" 
    showTotalLikes.append(numberOfLikes)
    likeButton.append(showTotalLikes)


    //show number of shocks
    const numberOfShocks = data.reactions.unhappy
    const showTotalShocks = document.createElement('span')
    showTotalShocks.className = "reaction-number"
    showTotalShocks.append(numberOfShocks)
    shockedButton.append(showTotalShocks)


    //show number of laughs
    const numberOflaughs = data.reactions.funny
    const showTotallaughs = document.createElement('span')  
    showTotallaughs.className = "reaction-number"
    showTotallaughs.append(numberOflaughs)
    laughButton.append(showTotallaughs)

    console.log(showTotalShocks)




    commentButton.addEventListener('click', () => addComment(postContainer, commentButton, data.id))
    likeButton.addEventListener('click', () => addReaction(data.id))


    return postContainer
    
}

function addReaction(id){
//send click to server

    const url = `https://gossip-girl-api.herokuapp.com/posts/${id}/reactions`
    const data = {reaction: "happy"}
    apiFuncs.patchData(url, data)

//send back number of times it has been clicked


}



function addComment(parent, commentButton, id){
const newComment = document.createElement('div')
//new text area
const textArea = document.createElement('textarea')
newComment.append(textArea)

//comment button to post value from text area
const commentSubmitBttn = document.createElement('button')
commentSubmitBttn.textContent = 'submit comment'

commentSubmitBttn.addEventListener('click', () => {
    const url = `https://gossip-girl-api.herokuapp.com/posts/${id}/comments`
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