//import helpers
const helpers = require('../helpers')

describe('total engagement', () => {
    const testReactions = {
        reactions: {
        happy: 2,
        unhappy: 1,
        funny: 5
    }, comments: [1, 2, 3]}

    it('it should return an object of reactions', () => {
    expect(testReactions).toBe(reactions: {happy: 2, unhappy: 1, funny: 5})
    })
})