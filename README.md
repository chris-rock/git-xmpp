# git-events-xmpp

Pushes updates from Github, Bitbucket and Gitlab to your xmpp chat room.

## Configuration

Set the following environment variables: 

 - `XMPP_USERNAME` xmpp username
 - `XMPP_PASSWORD` xmpp password
 - `XMPP_ROOM` room where messages should be posted

Optional

 - `XMPP_HOST` hostname for connection
 - `XMPP_PORT` port for connection

## Getting Started

    export XMPP_USERNAME=romeo@example.net
    export XMPP_PASSWORD=romeo
    export XMPP_HOST=localhost
    export XMPP_PORT=5222
    export XMPP_ROOM=room@conference.example.net

## Author

- Author: Christoph Hartmann <chris@lollyrock.com>

## License

MIT