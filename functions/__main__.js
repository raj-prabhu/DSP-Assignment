const lib = require('lib')({
  token: process.env.STDLIB_TOKEN
});

//const Member = require('../src/member');
const send = require('../src/sendMessage');
//const KEY = id => `BJ1${id}`;

/**
 * @bg params hub.challenge
 * @returns {any}
 */
module.exports = async context => {
  if (context.params['hub.challenge']) {
    // Facebook is authenticating the webhook
    const hub = {
      mode: context.params['hub.mode'],
      challenge: context.params['hub.challenge'],
      verifyToken: context.params['hub.verify_token']
    };
    return await lib[`${context.service.identifier}.auth`](hub);
  }
  if (context.params.object === 'page') {
    // Actual event was sent to webhook
    //console.log(context.params.entry);
    for (let entry of context.params.entry) {
      let webhookEvent = entry.messaging[0];
      let senderPSID = webhookEvent.sender.id;
    //  let options = await lib.utils.storage.get(KEY(senderPSID));
  //    options = options || new Conversation().export();
  //    let conversation = new Conversation(options);

    //  let message = handleText(webhookEvent.message.text);      //
      let [message] =
        webhookEvent.message && webhookEvent.message.quick_reply && webhookEvent.message.quick_reply.payload
          ? handlePayload(webhookEvent.message.quick_reply.payload)
          : handleText(webhookEvent.message.text);

      try {
        await send(senderPSID, message);
        //await lib.utils.storage.set(KEY(senderPSID));
      } catch (error) {
        console.log(error);
      }
    }
    return 'OK';
  }
  throw new Error('Error receiving event');
};

/*
* @param {string} text message as input
* @returns {array}
*/
function handleText(text) {
  if (text === 'Meeting') {
    return [
    {
      text: 'Would you like to set a meeting?',
      quick_replies: [
        {
          content_type: 'text',
          title: 'Yes',
          payload: 'start'
        },
        {
          content_type: 'text',
          title: 'No',
          payload: 'quit'
        }
      ]
    }
  ];
    //new Game()
    //];
  }

  return[
      {
      text: 'what?'
    }
  ];

    //game;
}

function handlePayload(payload) {
  if (payload === 'start') {
    return[
      {
        text: 'Sure'
      }
    ];
  }
  if (payload === 'quit') {
      return[
        {
          text: 'Bye'
        }
      ];
  }
}
