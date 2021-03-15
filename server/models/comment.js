const data = require('../data');

class Comment {
    constructor(data) {
        this.id = data.id;
        this.text = data.text
        this.date = data.date
    }
}

module.exports = Comment
