'use strict';

var request = require('supertest'),
    fs = require('fs'),
    should = require('should'),
    assert = require('assert'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    HookRoutes = require('../lib/hookroutes');



describe('hooks', function () {
    var app;

    function startServer() {

        var app = express();

        // set xmpp options
        var options = {
            jid: 'romeo@example.net',
            password: 'romeo',
            host: 'localhost',
            port: '5222',
            room: 'room1'
        };

        app.use(bodyParser.json({
            limit: '1mb'
        }));

        // load routes
        var hRoutes = new HookRoutes(options);
        app.use('/', hRoutes.routes());

        // error handler
        app.use(function (err, req, res, next) {
            console.log("ERROR handler");
            res.status(500);
            res.send({
                error: 'Internal Error'
            });
        });

        return app;
    }

    beforeEach(function (done) {
        app = startServer();
        setTimeout(done, 1000);
    });

    afterEach(function (done) {
        // nothing to do yet
        done();
    });

    it('bitbucket git', function (done) {

        var data = fs.readFileSync(path.resolve(__dirname, './hooks/bitbucket_git.json'));
        var json = JSON.parse(data);
        request(app)
            .post('/bitbucket')
            .send(json)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                done();
            });
    });

    it('github push', function (done) {

        var data = fs.readFileSync(path.resolve(__dirname, './hooks/github_push.json'));
        var json = JSON.parse(data);
        request(app)
            .post('/github')
            .set('X-GitHub-Event', 'push')
            .set('X-GitHub-Delivery', '12321')
            .send(json)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                done();
            });
    });

    it('github pull_request', function (done) {

        var data = fs.readFileSync(path.resolve(__dirname, './hooks/github_pull_request.json'));
        var json = JSON.parse(data);
        request(app)
            .post('/github')
            .set('X-GitHub-Event', 'pull_request')
            .set('X-GitHub-Delivery', '12321')
            .send(json)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                done();
            });
    });

    it('gitlab 6', function (done) {

        var data = fs.readFileSync(path.resolve(__dirname, './hooks/gitlab6.json'));
        var json = JSON.parse(data);
        request(app)
            .post('/gitlab')
            .send(json)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                done();
            });
    });
});