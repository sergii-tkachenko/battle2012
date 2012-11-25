express = require('express')
app = express.createServer();
port = process.env.PORT || 3000;

require 'fs'
app.use '/', express.static("#{__dirname}/../public")
app.use '/H3D', express.static("#{__dirname}/../H3D")

fs = require('fs')
io = require('socket.io').listen(5150)
# io.configure ->
#   io.set "transports", ["xhr-polling"]
#   io.set "polling duration", 10
io.set 'log level', 2

app.listen(port);

Twit = require('twit')
T = new Twit {
  consumer_key:        'l5z7NIAbLNwqYNC6L3FZA'
  consumer_secret:     'jxYxJNnj4VlShIyQ6xtyufhXU4YY3T7n3VsXY4U'
  access_token:        '83815996-wdFgKPMmHuuwqcdv7kotExLRh7iYOINP6I2WdcVVs'
  access_token_secret: 'T1PiQ2mddLfcoCGPyhPwJb1o3u5idenCBwBFPOEo'
}

# gm = require('gm')

io.sockets.on 'connection', (socket) ->
  stream = T.stream 'statuses/filter', {
    track: ["#news"]
    # lang: "en"
  }

  stream.on 'tweet', (tweet, i) ->
    if tweet.entities.hashtags
      hashtags = []
      for hashtag in tweet.entities.hashtags
        hashtags.push(hashtag.text.toLowerCase()) unless hashtag.text.toLowerCase() == 'wesleyfollowspree'
      socket.emit 'tweet', hashtags if hashtags.length > 1


  socket.on 'hashtags', (data) ->
    return unless data.length
    string = ''
    for d in data
      string += "##{d} "

    T.get 'search/tweets', { q: d, lang: 'en' }, (err, reply) ->
      socket.emit 'hashtag-tweet', reply.statuses if reply.statuses


        # hashtag = hashtag.text.toLowerCase();
        # socket.emit 'tweet', hashtag.text.toLowerCase()

  # socket.on 'button', (data) ->
  #   console.log "test"
  #   gm("http://byaki.net/uploads/posts/1176231449_11.jpg")
  #     .monochrome()
  #     .write "/Users/sergii/Projects/battle2012/node.jpg", (err) ->
  #       console.log err
     # .monochrome()
     # .write '/Users/sergii/Projects/battle2012/node.jpg',(err) ->
     #  if (!err) console.log('done');

    # im.convert ["http://www.1024x600.ru/526-3/1024x600_ru+-+Suprise.jpg", '-monochrome'], (err, stdout) ->
      # console.log('stdout:', stdout)

