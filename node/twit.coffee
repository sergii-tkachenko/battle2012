io = require('socket.io').listen(5051)
io.set 'log level', 2

Twit = require('twit')
T = new Twit {
  consumer_key:        'l5z7NIAbLNwqYNC6L3FZA'
  consumer_secret:     'jxYxJNnj4VlShIyQ6xtyufhXU4YY3T7n3VsXY4U'
  access_token:        '83815996-wdFgKPMmHuuwqcdv7kotExLRh7iYOINP6I2WdcVVs'
  access_token_secret: 'T1PiQ2mddLfcoCGPyhPwJb1o3u5idenCBwBFPOEo'
}

# im = require('imagemagick');
fs = require('fs')
gm = require('gm')

io.sockets.on 'connection', (socket) ->
  stream = T.stream 'statuses/sample', {
    # track: ["news"]
    lang: "en"
  }

  stream.on 'tweet', (tweet, i) ->
    if tweet.entities.hashtags
      hashtags = []
      for hashtag in tweet.entities.hashtags
        hashtags.push(hashtag.text.toLowerCase()) unless hashtag.text.toLowerCase() == 'wesleyfollowspree'
      socket.emit 'tweet', hashtags if hashtags.length > 1




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

