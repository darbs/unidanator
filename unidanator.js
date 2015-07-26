/*
 * unidanator
 * https://github.com/darbs/unidanator
 *
 * Copyright (c) 2015 darbs
 * Licensed under the MIT license.
 */

'use strict';

var args = process.argv.slice(2);
var username = args[0];
var dir = args[1];

if (!username && !dir) {
    console.error("All arguments must be supplied");
    return;
}

var fs = require('fs'),
    _ = require('underscore'),
    unidan = require('./lib/unidan').unidan,
    utility = require('./lib/utils').utils,
    when = require('when');

var configuration = JSON.parse(fs.readFileSync('configuration.json', 'utf8'));

/**
 *
 * @param username
 * @param punishOrPraise
 * @param callback
 */
var unidanator = function (username, punishOrPraise, callback) {
    console.log('UNIDANATING: ' + username);

    // First get random slave accouns
    var commentLimit = configuration.maxComments;
    var numOfSlaves = configuration.useAccounts; // number of slaves to use

    var getSlave = function (reset) {
        var randomSlave = utility.randomAccount(configuration.slaves, reset);
        if (!randomSlave) {
            console.log("NO SLAVE ZONE");
            return;
        }

        console.log("--slavename: " + randomSlave.username);
        console.log("--slaves left: " + numOfSlaves);
        return new unidan(randomSlave);
    };

    var voteComments = function (commentIDs) {
        console.log("VOTING COMMENTS " + commentIDs);

        var currentSlave = getSlave();
        var deferred = when.defer();

        if (!currentSlave) {
            deferred.resolve();
            return deferred.promise;
        }
        currentSlave.login();
        console.log('--using slave:' + currentSlave.username());

        var voteReq = currentSlave.voteComments(commentIDs, punishOrPraise);

        voteReq.then(function () {
            currentSlave.logout().done(function () {
                deferred.resolve();
            });
        });

        return deferred.promise;
    };

    var getComments = function (username, limit) {
        console.log("GETTING COMMENTS FOR " + username);

        var deferred = when.defer();
        var commentUsername = configuration.slaves[0];
        var currentSlave = new unidan(commentUsername);
        currentSlave.login();

        console.log("--using slave: " + currentSlave.username());
        var commentReq = currentSlave.getComments(username, limit);

        commentReq.done(function (comments) {
            currentSlave.logout().done(function () {
                deferred.resolve(comments);
            });
        });

        return deferred.promise;
    };

    if (false /** specific comment **/) {
        // TODO
    } else if (false /** vote post **/) {

    } else {
        // soft limit
        var commentReq = getComments(username, commentLimit);

        commentReq.done(function (comments) {
            var commentIDs = utility.getCommentIDs(comments);
            var manipulate = function () {
                if (numOfSlaves > 0) {
                    console.log("Unidanating...");
                    numOfSlaves--;
                    voteComments(commentIDs).done(manipulate);
                } else {
                    console.log("Unidanated");
                }
            };

            manipulate();
        });
    }


};

unidanator(username, dir);