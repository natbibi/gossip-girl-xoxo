const Comment = require('./comment.js')
const data = require('../data');
postsData = data.posts

class Post extends Comment {
    constructor(data) {
        super(data)
        this.comments = data.comments || [] 
        this.reactions = data.reactions || {happy: 0, funny: 0, unhappy: 0}
        this.giphy = data.giphy || null
    }
    static get all() {
        const posts = postsData.map((post) => new Post(post));
        return posts;
    }
    static create(post) {
        const newPostId = postsData.length + 1
        const newPost = new Post({ id: newPostId, ...post });
        postsData.unshift(newPost);
        return newPost;
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
        postsData.filter(post => post.id === this.id)[0].comments.push(comment)
    }
    addReaction(reaction) {
        postsData.filter(post => post.id === this.id)[0].reactions[reaction]++
    }
}

module.exports = Post