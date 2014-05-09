# git-events-xmpp

Pushes updates from Github, Bitbucket and Gitlab to your xmpp chat room.

Note: This needs a bit more testing...

## Configuration

Set the following environment variables: 

 - `XMPP_USERNAME` xmpp username
 - `XMPP_PASSWORD` xmpp password
 - `XMPP_ROOM` room where messages should be posted

Optional

 - `XMPP_HOST` hostname for connection
 - `XMPP_PORT` port for connection

This project also ships with a `Procfile` and plays well with [foreman](http://ddollar.github.io/foreman/). foreman enables you to generate init scripts for your node project. Further information is available at [UPSTART-EXPORT](http://ddollar.github.io/foreman/#UPSTART-EXPORT)

## Getting Started

    export XMPP_USERNAME=romeo@example.net
    export XMPP_PASSWORD=romeo
    export XMPP_HOST=localhost
    export XMPP_PORT=5222
    export XMPP_ROOM=room@conference.example.net

    # for debugging use DEBUG=* node bin/git-xmpp
    node bin/git-xmpp

    # endpoint will be http://localhost:3000/github/

## Deploying to Heroku

    heroku create
    heroku config:set XMPP_USERNAME=romeo@example.net
    heroku config:set XMPP_PASSWORD=romeo
    heroku config:set XMPP_HOST=localhost
    heroku config:set XMPP_PORT=5222
    heroku config:set XMPP_ROOM=room@conference.example.net
    heroku config
    git push heroku master
    heroku open

## Configure Hook Urls

You need to configure the service endpoint in Github, Bitbucket and Gitlab.

On your local dev environment

 - Github: http://localhost:3000/github/
 - Bitbucket: http://localhost:3000/bitbucket/
 - Gitlab: http://localhost:3000/gitlab/

Heroku:

 - Github: http://yourapp.herokuapp.com/github/
 - Bitbucket: http://yourapp.herokuapp.com/bitbucket/
 - Gitlab: http://yourapp.herokuapp.com/gitlab/

## Author

- Author: Christoph Hartmann <chris@lollyrock.com>

## License

MIT