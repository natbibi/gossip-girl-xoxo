const giphy = require('./giphy')
const renderGif = giphy.vanillaJSGif

const apiFuncs = require('./api')

function renderList(data) {
    for (item of data) {
        document.getElementById('root').append(renderItem(item))
    }
    //function to render data to the DOM
}

function renderItem(data) {
    // return a full post element with text and gif + class names
    const postContainer = document.createElement('div')
    postContainer.className = "blog-entry"

    //append the parsed date
    const postDate = document.createElement('p')
    postDate.textContent = data.dateFrom
    postDate.className = 'blog-entry-timestamp'
    postContainer.appendChild(postDate)

    //append the main text content for post
    const postText = document.createElement('p')
    postText.textContent = data.text

    function randomclass() {
        const differentFontClass = ["blog-entry-font-1", "blog-entry-font-2", "blog-entry-font-3", "blog-entry-font-4", "blog-entry-font-5"]
        const randNum = Math.floor(Math.random() * differentFontClass.length)
        return differentFontClass[randNum]
    }
    postText.className = `${randomclass()} blog-entry-main`

    postContainer.appendChild(postText)

    //apend a gif if post has one
    const postGif = document.createElement('div')
    postGif.className = 'gifCont'
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
    commentButton.className = 'primary-bttn'
    commentButton.textContent = 'comment'
    postContainer.appendChild(commentButton)

    //show number of likes 
    const showTotalLikes = document.createElement('span')
    showTotalLikes.className = 'reaction-badge'
    showTotalLikes.textContent = data.reactions.happy
    likeButton.after(showTotalLikes)


    //show number of shocks
    const showTotalShocks = document.createElement('span')
    showTotalShocks.className = 'reaction-badge'
    showTotalShocks.textContent = data.reactions.unhappy
    shockedButton.after(showTotalShocks)


    //show number of laughs
    const showTotallaughs = document.createElement('span')
    showTotallaughs.className = 'reaction-badge'
    showTotallaughs.textContent = data.reactions.funny
    laughButton.after(showTotallaughs)

    //append share button 
    const shareButton = document.createElement('button')
    shareButton.className = 'primary-bttn'
    shareButton.textContent = 'share'
    postContainer.append(shareButton)
    //share click event
    shareButton.addEventListener("click", () => {
        copyUrl(data.id, postContainer)
    })

    //create div to append comment input container - before comments
    const commentPostCont = document.createElement('div')
    postContainer.append(commentPostCont)
    commentButton.addEventListener('click', () => addComment(commentPostCont, postContainer, data.id))


    likeButton.addEventListener('click', (event) => addReaction(event, 'happy', data.id))
    shockedButton.addEventListener('click', (event) => addReaction(event, 'unhappy', data.id))
    laughButton.addEventListener('click', (event) => addReaction(event, 'funny', data.id))


    //number of comments on button
    const numberOfComments = data.comments.length
    if (numberOfComments > 1) {

        //button to display comments
        const readCommentsBttn = document.createElement('button')
        readCommentsBttn.classList.add("read-comment-bttn")
        readCommentsBttn.textContent = `read comments: ${numberOfComments}`
        readCommentsBttn.addEventListener('click', () => {
            commentCont.classList.toggle('display-comments')
        })

        postContainer.append(readCommentsBttn)

    } else if (numberOfComments == 1) {
        const readCommentsBttn = document.createElement('button')
        readCommentsBttn.classList.add("read-comment-bttn")
        readCommentsBttn.textContent = `read comment`
        readCommentsBttn.addEventListener('click', () => {
            commentCont.classList.toggle('display-comments')
        });
        postContainer.append(readCommentsBttn)
    } else {
        const firstToComment = document.createElement('div')
        firstToComment.classList.add('first-to-comment')
        firstToComment.textContent = "Be the first to comment!"
        postContainer.append(firstToComment)
    }


    //append the comments 
    const commentCont = document.createElement('div')
    commentCont.className = 'comment-cont'
    for (comment of data.comments) {
        //append each comment
        commentCont.appendChild(renderComment(comment))
    }

    postContainer.append(commentCont)


    return postContainer

}

function addReaction(event, reactionType, id) {
    //send click to server
    const url = `https://gossip-girl-api.herokuapp.com/posts/${id}/reactions`
    const data = { reaction: reactionType }
    apiFuncs.patchData(url, data)
    //update emoji number for client
    event.currentTarget.nextSibling.textContent++
}



async function addComment(parent, topParent, id) {
    if (typeof parent.getElementsByClassName('post-comment-cont')[0] === 'undefined') {
        const newComment = document.createElement('div')
        newComment.className = 'post-comment-cont'
        //new text area
        const textArea = document.createElement('textarea')
        textArea.className = 'post-comment-textarea'
        textArea.placeholder = "Share your thoughts 💭"
        newComment.append(textArea)

        //comment button to post value from text area
        const commentSubmitBttn = document.createElement('button')
        commentSubmitBttn.classList.add('primary-bttn')
        commentSubmitBttn.textContent = 'reply'

        commentSubmitBttn.addEventListener('click', () => {
            try {
                const commentValue = textArea.value
                if (commentValue.length < 1) throw new Error('comment too short')
                const url = `https://gossip-girl-api.herokuapp.com/posts/${id}/comments`
                const date = new Date().toString()
                const data = { text: commentValue, date: date }
                apiFuncs.patchData(url, data)
                //apend comment for client too
                topParent.getElementsByClassName('comment-cont')[0].append(renderComment({ text: commentValue }))
                parent.getElementsByClassName('post-comment-cont')[0].remove()
            } catch (err) {
                alert("add some text")
                throw err
            }
        })
        newComment.append(commentSubmitBttn)

        await parent.append(newComment)
        textArea.focus()

    }
    else {
        parent.getElementsByClassName('post-comment-cont')[0].remove()
    }
}

function copyUrl(id, parent) {
    const copyText = document.createElement('textarea')
    copyText.value = `https://gossip-girl-xoxo.netlify.app/post?${id}`
    parent.append(copyText)
    copyText.select();
    document.execCommand("copy");
    copyText.remove()
    alert('link copied')
}

function renderComment(comment) {
    const commentPara = document.createElement('p')
    commentPara.classList.add('comment-item')
    commentPara.textContent = comment.text
    return commentPara
}

function renderError(error) {
    const errorCont = document.createElement('div')
    errorCont.className = 'error'
    errorCont.textContent = `${error}`
    document.getElementById('root').prepend(errorCont)
}



module.exports = {
    renderList,
    renderItem,
    renderError
}