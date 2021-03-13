const data = require('../data');

class Comment {
    constructor(data) {
        this.id = data.id;
        this.text = data.text
        this.date = data.date
        this.parent = data.parent
    }
    static get all() {
        //get all comments of a parent post
    }

}

module.exports = Comment
