// import data
const data = require('../data');
const postsData = data.posts
// import models
const Comment = require('../models/comment');
const Post = require('../models/post');

describe('Comment model', () => {
    const testComment = {
        text: 'This is a test comment',
        date: new Date.toString()
    };
    it('should make an instance of a comment', () => {
        const comment = new Comment({ id: 10, ...testComment });
        expect(comment.id).toBe(10);
        expect(comment.text).toBe('This is a test comment');
    });
});

describe('Post model', () => {
    it('should return all posts', () => {
        const posts = Post.all
        expect(posts).toEqual(postsData)
    })
    const testPost = {
        date: "Fri Mar 12 2021 22:39:25 GMT+0000 (Greenwich Mean Time)",
        text: 'This is a test post',
    };
    it('should make an instance of a post', () => {
        const post = new Post({ id: 10, ...testPost });
        expect(post.id).toBe(10);
        expect(typeof post.date).toBe('string');
        expect(post.text).toBe('This is a test post');
    });
    it('should create a new post', () => {
        const newPost = Post.create(testPost);
        expect(newPost).toEqual({id:2, comments: [], giphy: null, reactions: {happy:0, funny:0, unhappy:0}, ...testPost})
    })
    it('should create and append a new comment to a post', () => {
        const testComment = {
                parentId: 1,
                date: "Fri Mar 12 2021 22:39:25 GMT+0000 (Greenwich Mean Time)",
                text: 'This is a new test comment',
            }
            const testComment2 = {
                parentId: 1,
                date: "Fri Mar 12 2021 22:39:25 GMT+0000 (Greenwich Mean Time)",
                text: 'This is a new test comment as well',
            }       
        const postToUpdate = Post.findById(1)
        postToUpdate.addComment(testComment)
        expect(postsData[0].comments[0].text).toBe("This is a new test comment")
        postToUpdate.addComment(testComment2)
        expect(postsData[0].comments[1].text).toBe("This is a new test comment as well")
    })
    it('should update a posts reactions', () => {
        const postToUpdate = Post.findById(1)
        postToUpdate.addReaction("happy")
        postToUpdate.addReaction("funny")
        postToUpdate.addReaction("happy")
        expect(postsData[0].reactions).toStrictEqual({happy: 2, funny: 1, unhappy: 0})
    })
});