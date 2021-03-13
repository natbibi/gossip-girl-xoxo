const Comment = require('./comment.js')
const data = require('../data');
postsData = data.posts

class Post extends Comment {
    constructor(data) {
        super(data)
        this.comments = [] 
        this.reactions = {happy: 0, funny: 0, unhappy: 0}
    }
    static get all() {
        //get all comments of a parent post
    }
    static findById(id) {
        try {
            const postData = postsData.filter((post) => post.id === id)[0];
            const post = new Post(postData);
            return post;
        } catch (err) {
            throw new Error('That post does not exist!');
        }
    }
    addComment(commentData) {
        const comment = new Comment(commentData)
        postsData.filter(post => post.id = this.id)[0].comments.push(comment)
    }
    addReaction(reaction) {
        postsData.filter(post => post.id = this.id)[0].reactions[reaction]++
    }

    static create(comment) {
        //create and append comment to parent post
    }
}

module.exports = Post