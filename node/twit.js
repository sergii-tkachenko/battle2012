// Generated by CoffeeScript 1.4.0
var T, Twit, app, express, fs, io, port;

express = require('express');

app = express.createServer();

port = process.env.PORT || 3000;

require('fs');

app.use('/', express["static"]("" + __dirname + "/../public"));

app.use('/H3D', express["static"]("" + __dirname + "/../H3D"));

fs = require('fs');

io = require('socket.io').listen(5150);

io.set('log level', 2);

app.listen(port);

Twit = require('twit');

T = new Twit({
  consumer_key: 'l5z7NIAbLNwqYNC6L3FZA',
  consumer_secret: 'jxYxJNnj4VlShIyQ6xtyufhXU4YY3T7n3VsXY4U',
  access_token: '83815996-wdFgKPMmHuuwqcdv7kotExLRh7iYOINP6I2WdcVVs',
  access_token_secret: 'T1PiQ2mddLfcoCGPyhPwJb1o3u5idenCBwBFPOEo'
});

io.sockets.on('connection', function(socket) {
  var stream;
  stream = T.stream('statuses/filter', {
    track: ["#news"]
  });
  stream.on('tweet', function(tweet, i) {
    var hashtag, hashtags, _i, _len, _ref;
    if (tweet.entities.hashtags) {
      hashtags = [];
      _ref = tweet.entities.hashtags;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        hashtag = _ref[_i];
        if (hashtag.text.toLowerCase() !== 'wesleyfollowspree') {
          hashtags.push(hashtag.text.toLowerCase());
        }
      }
      if (hashtags.length > 1) {
        return socket.emit('tweet', hashtags);
      }
    }
  });
  return socket.on('hashtags', function(data) {
    var d, string, _i, _len;
    if (!data.length) {
      return;
    }
    string = '';
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      d = data[_i];
      string += "#" + d + " ";
    }
    return T.get('search/tweets', {
      q: d,
      lang: 'en'
    }, function(err, reply) {
      if (reply.statuses) {
        return socket.emit('hashtag-tweet', reply.statuses);
      }
    });
  });
});
