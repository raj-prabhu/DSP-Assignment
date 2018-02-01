/**
* Stateless Blackjack functionality.
*   To simulate a table session, use new Blackjack.Table()
* @namespace
*/
class Member {

  constructor(state = {}) {
    this.captainid = state.captainid;
  }
  /**
  * Determines if hand is a Blackjack
  * @param {string} senderPSID The hand of the player
  * @returns {boolean}
  */
  static isCaptain (senderPSID) {
    if (senderPSID === this.captainid)
    return 1;
    else {
    return 0;
    }
  }


  }

};

module.exports = Member;
