const data = require('../data');

var moment = require('moment'); // require

// Create formatter (English).

class Comment {
    constructor(data) {
        this.id = data.id;
        this.text = data.text
        this.date = data.date
        this.dateFrom = moment(Date.parse(data.date)).fromNow()
    }
}

module.exports = Comment
