var Snoocore = require('snoocore'),
    _ = require('underscore'),
    when = require('when'),
    userAgent = require('crypto').randomBytes(6).toString('hex');

/**
 * This is unidan. He wraps basic functions of Snoocore
 * and allows casting votes.
 */
var unidan = function (account) {

    var reddit,
        defaults = {
        type: 'script',
        scope: ['identity', 'vote', 'history']
    };

    /**
     *
     * @returns {*}
     */
    this.username = function () {
        return account.username;
    };

    /**
     *
     * @param account
     */
    this.login = function () {
        var oauth = _.extend({}, defaults, account);
        return reddit = new Snoocore({
            userAgent: 'node:' + userAgent + ':v1.2.3',
            oauth: oauth
        });
    };

    /**
     *
     */
    this.logout = function () {
        return reddit.deauth();
    };

    /**
     *
     * @param commentID
     * @param direction
     * @param callback
     */
    this.castVote = function (commentID, direction) {
        var commentParams = {
            id: commentID,
            dir: direction
        };

        return reddit('/api/vote').post(commentParams)
    };

    /**
     *
     * @param username
     * @param limit
     * @param callback
     */
    this.getComments = function (username, limit, callback) {

        var commentParams = {
            limit: limit,
            $account: username
        };

        return reddit('/user/$account/comments').get(commentParams);
    };

    this.voteComments = function (commentIDs, punishOrPraise) {
        var self = this;
        var asyncVotes = [];


        _.each(commentIDs, function (commentID) {
            // use randomComment interval
            console.log("\t" + self.username() + ' voting ' + punishOrPraise + ' on ' + commentID);
            var voteReq = self.castVote(commentID, punishOrPraise);
            asyncVotes.push(voteReq);
        });

        return when.all(asyncVotes);
    }
};


exports.unidan = unidan;