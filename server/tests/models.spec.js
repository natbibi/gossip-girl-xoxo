// import data
const data = require('../data');
const postsData = data.posts
// import models
const Comment = require('../models/comment');
const Post = require('../models/post');
var moment = require('moment');

 const checkData = {
    comments:  [],
    date: "Fri Mar 12 2021 22:39:25 GMT+0000 (Greenwich Mean Time)",
    dateFrom: moment(Date.parse('Fri Mar 12 2021 22:39:25 GMT+0000 (Greenwich Mean Time)')).fromNow(),
       giphy: null,
       id: 2,
        reactions:  {
         funny: 0,
         happy: 0,
         unhappy: 0,
       },
       text: "This is a test post",
     }

describe('Comment model', () => {
    const testComment = {
        text: 'This is a test comment',
        date: "Fri Mar 12 2021 22:39:25 GMT+0000 (Greenwich Mean Time)",
        dateFrom: "5 days ago"
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
        expect(posts[0].text).toEqual('Welcome to Gossip Girl! Use this space to post annonymous blog entries which you can like, comment and share. \n xoxo Gossip Girl')
    })
    it('should return a post with specific id and throw error if no post with id', () => {
        expect(Post.findById(1).text).toBe('Welcome to Gossip Girl! Use this space to post annonymous blog entries which you can like, comment and share. \n xoxo Gossip Girl')
        function testError() {
            Post.findById(-1);
        }
        expect(testError).toThrowError('That post does not exist!');
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
        expect(newPost).toEqual(checkData)
    })
    it('should create and append a new comment to a post', () => {
        const testComment = {
                date: "Fri Mar 12 2021 22:39:25 GMT+0000 (Greenwich Mean Time)",     
                text: 'This is a new test comment'
            
            }
            const testComment2 = {
                date: "Fri Mar 12 2021 22:39:25 GMT+0000 (Greenwich Mean Time)",
                text: 'This is a new test comment as well'
               
            }       
        const postToUpdate = Post.findById(1)
        postToUpdate.addComment(testComment)
        expect(postsData[1].comments[0].text).toBe("This is a new test comment")
        // postToUpdate.addComment(testComment2)
        // expect(postsData[0].comments[1].text).toBe("This is a new test comment as well")
    })
    it('should update a posts reactions', () => {
        const postToUpdate = Post.findById(1)
        postToUpdate.addReaction("happy")
        postToUpdate.addReaction("funny")
        postToUpdate.addReaction("happy")
        expect(postsData[1].reactions).toEqual({funny: 1, happy: 2, unhappy: 0})
    })
});