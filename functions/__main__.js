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
    console.log(context.params.entry);
    for (let entry of context.params.entry) {
      let webhookEvent = entry.messaging[0];
      let senderPSID = webhookEvent.sender.id;

  //    let options = await lib.utils.storage.get(KEY(senderPSID));
  //    options = options || new Conversation().export();
  //    let conversation = new Conversation(options);

      let message = handleText(webhookEvent.message.text);

      try {
        await send(senderPSID, message);
        await lib.utils.storage.set(KEY(senderPSID));
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
      //new Game()
    ];
  }
  return [
    {
      text: 'what?'
    }
    //game
  ];
}

function handlePayload(payload) {
  if (payload === 'start') {
    return [
      {
        text: 'Sure'
      }
    ];
  }
  if (payload === 'quit') {
      return [
        {
          text: 'Bye'
        }
      ];
    }
}
//   if (payload === 'quit') {
//     return handleGameover(game);
//   }
//
//   if (payload === 'hit') {
//     return handleHit(game);
//   }
//
//   if (payload === 'stand') {
//     return handleStand(game);
//   }
//
//   if (payload === 'double') {
//     return handleDouble(game);
//   }
//
//   if (payload === 'split') {
//     return handleSplit(game);
//   }
//
//   if (+payload !== NaN) {
//     return handleBet(+payload, game);
//   }
//
//   return [
//     {
//       text: `${payload} what?`
//     },
//     game
//   ];
// }
//
// function handleHit(game) {
//   game.pHit();
//   if (game.pDidBust()) {
//     game.handIndex--;
//     let message = {
//       text: gameStatusText(game) + '\n\n' + `Bust. Make another bet`,
//       quick_replies: betQuickReplies(game)
//     };
//     return [message, game];
//   } else {
//     return [
//       {
//         text: gameStatusText(game),
//         quick_replies: gameMovesQuickReply(game)
//       },
//       game
//     ];
//   }
// }

// function handleStand(game) {
//   game.handIndex--;
//
//   if (game.handIndex < 0) {
//     return [{}, game];
//   }
//
//   return [
//     {
//       text: gameStatusText + '\n\n' + 'Next hand',
//       quick_replies: gameMovesQuickReply(game)
//     }
//   ];
// }

// function handleDouble(game) {
//   game.playerBets[game.handIndex] += game.playerBets[game.handIndex];
//   game.pHit();
//   game.handIndex--;
//   return [
//     {
//       text: gameStatusText(game),
//       quick_replies: gameMovesQuickReply(game)
//     },
//     game
//   ];
// }

// function handleSplit(game) {
//   game.pSplit();
//   return [
//     {
//       text: gameStatusText(game) + '\n\n' + 'Split!',
//       quick_replies: gameMovesQuickReply(game)
//     },
//     game
//   ];
// }
//
// function handleBet(bet, game) {
//   game.startHand().pBet(bet);
//   if (game.isBlackjack()) {
//     game.bankroll += game.isBlackjack();
//     game.playerBets[game.handIndex] = 0;
//     if (game.handIndex === 0) {
//       return [
//         {
//           text: gameStatusText(game) + '\n\n' + 'Blackjack! Place another bet',
//           quick_replies: betQuickReplies(game)
//         },
//         game
//       ];
//     }
//   }
//   return [
//     {
//       text: gameStatusText(game),
//       quick_replies: gameMovesQuickReply(game)
//     },
//     game
//   ];
// }

// function handOver(game) {
//   let outcome = game.resolveHand();
//   let statusText = gameStatusText(game);
//   game.bankroll += outcome;
//   game.playerBets = [];
//   game.playerHands = [[]];
//   game.dealerHand = [];
//   game.handIndex = 0;
//
//   if (outcome > 0) {
//     return [
//       {
//         text:
//           statusText +
//           '\n\n' +
//           `You won ${outcome}! Place another bet (max ${game.bankroll})`,
//         quick_replies: betQuickReplies(game)
//       },
//       game
//     ];
//   } else if (outcome < 0) {
//     if (game.bankroll <= 0) {
//       return [
//         {
//           text: statusText + '\n\n' + `You lost. Type blackjack to play again.`
//         },
//         game
//       ];
//     } else {
//       return [
//         {
//           text:
//             statusText + '\n\n' + `Dealer won ${-outcome}. Place another bet`,
//           quick_replies: betQuickReplies(game)
//         },
//         game
//       ];
//     }
//   } else {
//     [
//       {
//         text: statusText + '\n\n' + `Push. Place another bet`,
//         quick_replies: betQuickReplies(game)
//       },
//       game
//     ];
//   }
// }

// function handleStart(game) {
//   return [
//     {
//       text: `You have $${game.bankroll}, how much would you like to bet?`,
//       quick_replies: betQuickReplies(game)
//     },
//     game
//   ];
// }

// function handleGameover(game) {
//   return [{ text: 'Game over!' }, new Game()];
// }

// function gameStatusText(game) {
//   //let pCards = game.playerHands.map(hand => hand + ' | ');
//   let dealerHand = game.handIndex < 0 ? game.dealerHand : [game.dealerHand[0]];
//   return `Bankroll $${game.bankroll}
// Dealer Cards ${showCards(dealerHand)}
// Your Hand(s) ${showCards(game.playerHands)}
// Your Bet(s) ${game.playerBets}`;
// }

// function showCards(hands) {
//   const ppCard = {
//     C: card => `${card}♣`,
//     D: card => `${card}♦`,
//     H: card => `${card}♥`,
//     S: card => `${card}♠`
//   };
//
//   if (!(hands[0] instanceof Array)) {
//     hands = [hands];
//   }
//
//   if (hands === []) {
//     return '';
//   }
//
//   if (hands.length === 1) {
//     return hands[0].reduce((hand, card) => {
//       return `${hand} ${ppCard[card[0]](card.slice(1))}`;
//     }, '');
//   }
//
//   return hands
//     .reduce((hands, hand) => {
//       return (
//         hand.reduce((hand, card) => {
//           return `${hand} ${ppCard[card[0]](card.slice(1))}`;
//         }, '') +
//         ' | ' +
//         hands
//       );
//     }, '')
//     .slice(0, -2);
// }
//
// function betQuickReplies(game) {
//   let bankrollLeft = game.bankroll - game.sumBets();
//   let bets = [10, 25, 50, 100].filter(bet => {
//     return bet < bankrollLeft;
//   });
//   bets.push(bankrollLeft);
//   return bets.map(bet => {
//     return {
//       content_type: 'text',
//       title: bet.toString(),
//       payload: bet.toString()
//     };
//   });
// }

// function gameMovesQuickReply(game) {
//   let quickReplies = [
//     {
//       content_type: 'text',
//       title: 'Hit',
//       payload: 'hit'
//     },
//     {
//       content_type: 'text',
//       title: 'Stand',
//       payload: 'stand'
//     }
//   ];
//
//   if (
//     game.playerHands[game.handIndex].length === 2 &&
//     game.playerBets[game.handIndex] * 2 <= game.bankroll
//   ) {
//     quickReplies.push({
//       content_type: 'text',
//       title: 'Double',
//       payload: 'double'
//     });
//   }
//
//   // if (game.pCanSplit()) {
//   //   quickReplies.push({
//   //     content_type: 'text',
//   //     title: 'Split',
//   //     payload: 'split'
//   //   });
//   // }
//
//   return quickReplies;
// }
