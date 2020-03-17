const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: 'ZloyT4V+0B9bN0CV5aS8i6i9Gn6LgDwEx6pjTEiZ4qBWob0EfwLOypZ/YUTueF1IEbHoQxMA6zNkO7GUY158A1xNx0XYpy2yzb0R9vue25O355F18qlOg4YNYKPdNnosGWgKqqtoRVAZEd44yYvjaQdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'b62b33a9470cce7d5ccf9f9fe4a5810e',
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`listening on ${port}`);
});