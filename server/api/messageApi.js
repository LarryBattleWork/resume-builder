// messages api ===================
// restful api routes for any backend calls
// front end does not connect to mongo libraries, therefore api routes needed
var express = require('express'); // modules 
var jwt = require('jsonwebtoken');
var config = require('server/config');
var Message = require('server/models/message');

var api = express.Router();

api.post('/', function(req, res) { // add user message to db
    var message = new Message({
        name: req.body.name,
        email: req.body.email,
        message: JSON.stringify(req.body.message)
    });

    message.save(function(err) {
        if (err) {
            console.error(err);
            return res.json({
                msg: 'failed to send message...'
            });
        } else {
            return res.json({
                success: true,
                msg: 'message sent successfully!'
            });
        }
    });
});

// authentication block, 
// place api routes that do not need to be authenticated above this
api.use(function(req, res, next) {
    var token = req.headers.rb_token;
    if (token) {
        jwt.verify(token, config.server.secret, function(err, decoded) {
            if (err) {
                return res.json({
                    msg: 'you must be logged in to perform this function...'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            msg: 'you must be logged in to perform this function...'
        });
    }
});

//retrieve all messages
api.get('/', function(req, res) {
    Message.find(function(err, messages) {
        if (err) {
            console.error(err);
            return res.json({
                success: false,
                msg: 'failed to retrieve all messages'
            });
        }
        return res.json({
            success: true,
            messages: messages
        });
    });
});

//retrieve message based on ID
//TODO get by email instead of id? Currently won't have much use
api.get('/:message_id', function(req, res) {
    Message.findById(req.params.message_id, function(err, message) {
        if (err) {
            console.error(err);
            return res.json({
                success: false,
                msg: 'failed to retrieve message'
            });
        }
        return res.json({
            success: true,
            message: message
        });
    });
});

api.delete('/:message_id', function(req, res) {
    Message.remove({
        _id: req.params.message_id
    }, function(err, message) {
        if (err) {
            console.error(err);
            return res.json({
                success: false,
                msg: 'unable to delete message'
            });
        } else {
            return res.json({
                success: true,
                msg: 'successfully deleted message'
            });
        }
    });
});

module.exports = api;