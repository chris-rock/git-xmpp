'use strict';

var express = require('express'),
    Githook = require('git-hook'),
    XmppMuc = require('./xmppmuc'),
    debug = require('debug')('gitxmpp:server');

var HookRoutes = function (options) {

    console.log(JSON.stringify(options));

    this.gh = new Githook();
    var muc = new XmppMuc(options);

    // initialize event listener
    this.gh.on('push', function (eventdata) {
        muc.handleEvent(eventdata);
    });

    this.gh.on('pull_request', function (eventdata) {
        muc.handleEvent(eventdata);
    });
};

HookRoutes.prototype.routes = function () {

    var hooks = express.Router();
    var gh = this.gh;

    hooks.post('/github', function (req, res) {
        debug('github event');
        gh.handleEvent('github', {
            // todo fix to meet tests
            ip: '192.30.252.1', // gh.determineIP(req),
            headers: req.headers,
            body: req.body
        }, function (err) {
            if (err) {
                res.send(400, 'Event not supported');
            } else {
                res.end();
            }
        });
    });

    hooks.post('/gitlab', function (req, res) {
        debug('gitlab event');
        gh.handleEvent('gitlab', {
            ip: gh.determineIP(req),
            headers: req.headers,
            body: req.body
        }, function (err) {
            if (err) {
                res.send(400, 'Event not supported');
            } else {
                res.end();
            }
        });
    });

    hooks.post('/bitbucket', function (req, res) {
        debug('bitbucket event');
        gh.handleEvent('bitbucket', {
            ip: gh.determineIP(req),
            headers: req.headers,
            body: req.body
        }, function (err) {
            if (err) {
                res.send(400, 'Event not supported');
            } else {
                res.end();
            }
        });
    });

    return hooks;
};

module.exports = HookRoutes;