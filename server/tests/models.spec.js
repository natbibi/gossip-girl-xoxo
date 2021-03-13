// import data
const data = require('../data');
const postsData = data.posts
// import models
const Comment = require('../models/comment');
const Post = require('../models/post');

describe('Comment model', () => {
    const testComment = {
        parentPost: null,
        text: 'This is a test comment',
    };
    it('should make an instance of a comment', () => {
        const comment = new Comment({ id: 10, ...testComment });
        expect(comment.id).toBe(10);
        expect(comment.text).toBe('This is a test comment');
    });
});

describe('Post model', () => {
    const testPost = {
        parentPost: null,
        date: "Fri Mar 12 2021 22:39:25 GMT+0000 (Greenwich Mean Time)",
        text: 'This is a test post',
        comments: [1,2,3]
    };
    it('should make an instance of a post', () => {
        const post = new Post({ id: 10, ...testPost });
        expect(post.id).toBe(10);
        expect(typeof post.date).toBe('string');
        expect(post.text).toBe('This is a test post');
    });
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
        expect(postsData[0].reactions).toStrictEqual({happy: 1, funny: 0, unhappy: 0})
    })
});