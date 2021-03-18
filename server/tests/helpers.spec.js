//import helpers
const helpers = require('../helpers')

describe('helper functions', () => {
    const testData = [
        {
        reactions: {
        happy: 2,
        unhappy: 1,
        funny: 0
    }, comments: [1,2,3]},
    {
        reactions: {
        happy: 2,
        unhappy: 1,
        funny: 4
    }, comments: [1,2,3]}
]

    it('should return total number of reactions', () => {
        expect(helpers.totalEngagement(testData[0])).toBe(6)
    })

    it('should rank an array of objects in order of reactions', () => {
        expect(helpers.compare(testData[0],testData[1])).toBe(1)
        expect(helpers.compare(testData[1],testData[0])).toBe(-1)
        expect(helpers.compare(testData[0],testData[0])).toBe(0)
    })

})