const totalEngagement = (post) => {
    const reactions = post.reactions
    const comments = post.comments.length 
    return reactions.happy + reactions.unhappy + reactions.funny + comments
  }
  
  function compare(a, b) {
    if (totalEngagement(a) < totalEngagement(b)) {
      return 1;
    }
    if (totalEngagement(a) > totalEngagement(b)) {
      return -1;
    }
    // a must be equal to b
    return 0;
  }

  module.exports = {
    totalEngagement,
    compare
  }