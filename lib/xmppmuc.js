'use strict';

var ltx = require('ltx'),
    XmppClient = require('node-xmpp-client'),
    debug = require('debug')('gitxmpp:muc');

var XmppMuc = function (options) {
    this.options = options;
    this.nickname = options.nickname || 'bot';


    this.client = new XmppClient({
        reconnect: true,
        jid: options.jid,
        password: options.password,
        host: options.host,
        port: options.port
    });

    var self = this;
    this.client.on('online', function () {
        debug('online');

        // announce the bot
        // join room
        this.send(self.joinPresence());
        // send message
        this.send(self.roomMessage('I wait for git events and will send them to this room'));
        // leave room
        this.send(self.leavePresence());
    });

    this.client.on('error', function (err) {
        console.error(err);
    });

};

XmppMuc.prototype.generateMessage = function (eventdata) {
    var message = '';
    message += '[' + eventdata.repo.name + '] ';

    if (eventdata.type === 'push') {
        message += eventdata.user.name + ' ';

        if (eventdata.before.match(/000000/)) {
            message += 'pushed new branch #{ref} \n';
        } else if (eventdata.after.match(/000000/)) {
            message += 'removed branch #{ref} \n';
        } else {
            message += 'pushed ' + eventdata.commits.length + ' commits to ' + eventdata.ref + '. ';
            message += eventdata.compare;
        }
    } else if (eventdata.type === 'pull_request') {

        if (eventdata.user.name) {
            message += eventdata.user.name + ' ';
        } else {
            message += eventdata.user.username + ' ';
        }

        message += 'created a new pull request with ' + eventdata.commits + ' commits. ';
        message += eventdata.html_url;
    }

    return message;
};

XmppMuc.prototype.handleEvent = function (eventdata) {

    // generate text message
    var msg = this.generateMessage(eventdata);

    // join room
    this.send(this.joinPresence());
    // send message
    this.send(this.roomMessage(msg));
    // leave room
    this.send(this.leavePresence());
};

XmppMuc.prototype.clientJid = function () {
    return this.client.jid;
};

XmppMuc.prototype.roomJid = function () {
    return this.options.room;
};

XmppMuc.prototype.send = function (msg) {
    if (this.client) {
        this.client.send(msg);
    }
};

XmppMuc.prototype.joinPresence = function () {

    var presence = new ltx.Element('presence', {
        to: this.roomJid() + '/' + this.nickname,
        from: this.clientJid()
    });

    debug(presence.root().toString());

    return presence;
};

XmppMuc.prototype.leavePresence = function () {

    var presence = new ltx.Element('presence', {
        to: this.roomJid() + '/' + this.nickname,
        from: this.clientJid(),
        type: 'unavailable'
    });

    debug(presence.root().toString());

    return presence;
};

XmppMuc.prototype.roomMessage = function (msg) {
    var message = new ltx.Element('message', {
        to: this.roomJid(),
        from: this.clientJid(),
        type: 'groupchat'
    });
    message.c('body')
        .t(msg);

    debug(message.root().toString());

    return message;
};

XmppMuc.prototype.privateMessage = function (eventdata) {

    var message = new ltx.Element('message', {
        to: this.roomJid(),
        from: this.clientJid(),
        type: 'chat'
    });
    message.c('body')
        .t(this.generateMessage(eventdata));

    debug(message.root().toString());

    return message;
};

module.exports = XmppMuc;