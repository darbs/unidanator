var _ = require('underscore');

var getRandomInteger = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
};

var generateIndexArray = function (arr) {
    var indices = [];
    for (var i = 0; i < arr.length; i++) {
        indices.push(i);
    }
    return indices;
};

var _indices;

exports.utils = {
    randomAccount: function (accounts, reset) {
        if (reset || !_indices) {
            _indices = generateIndexArray(accounts);
        }

        var index = getRandomInteger(0, Math.max(_indices.length - 1, 0));
        var randomIndex = _indices.splice(index, 1);
        return accounts[randomIndex];
    },
    getCommentIDs: function (comments) {
        var retrievedComments = comments.data.children;
        return _.map(retrievedComments, function (comment) {
            return comment.data.name;
        })
    }
};
