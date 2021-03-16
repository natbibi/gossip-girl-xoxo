const data = require('../data');

var moment = require('moment'); // require

// Create formatter (English).

class Comment {
    constructor(data) {
        this.id = data.id;
        this.text = data.text
        this.date = moment(data.date).fromNow()
        this.dateData = data.date
    }
}

module.exports = Comment
