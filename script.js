//GAME STATES
var GAME_START = 'game start';
var GAME_CARDS_DRAWN = 'cards are drawn';
var GAME_RESULTS_SHOWN = 'results are shown';
var GAME_HIT_OR_STAND = 'hit or stand';
var currentGameMode = GAME_START;

//player cards
var playerHand = [];

//dealer cards
var dealerHand = [];

//deck of cards
var gameDeck = [];

// creats deck of cards
var createDeck = function () {
  // deck array
  var deck = [];
  var suits = ['Diamonds', 'Clubs', 'Hearts', 'Spades'];
  var imageSuits = ["H", "D", "C", "S"];
  var indexSuits = 0;
  while (indexSuits < suits.length) {
    var currSuit = suits[indexSuits];
    // 13 ranks... ace to king - rank to define "card positions"
    var indexRanks = 1;
    while (indexRanks <= 13) {
      var cardName = indexRanks;
      var imageName = indexRanks + "-" + imageSuits[indexSuits] + ".png";
      // define card value - differentiate from rank: 'ace' = 1 / 11, 'jack' & 'queen' & 'king' = 10
      if (cardName == 1) {
        cardName = 'ace';
      }
      if (cardName == 11) {
        cardName = 'jack';
      }
      if (cardName == 12) {
        cardName = 'queen';

      }
      if (cardName == 13) {
        cardName = 'king';

      }
      var card = {
        name: cardName,
        suit: currSuit,
        rank: indexRanks,
      };
      deck.push(card);
      indexRanks = indexRanks + 1;
    }
    indexSuits = indexSuits + 1;
  }
  return deck;
};

// Function that generates a random number, used by shuffle deck function
var getRandomIndex = function (size) {
  return Math.floor(Math.random() * size);
};

// Function that shuffles a deck, used by createNewDeck function
var shuffleDeck = function (cards) {
  var index = 0;
  while (index < cards.length) {
    var randomIndex = getRandomIndex(cards.length);
    var currentItem = cards[index];
    var randomItem = cards[randomIndex];
    cards[index] = randomItem;
    cards[randomIndex] = currentItem;
    index = index + 1;
  }
  return cards;
};

// Function that creates and shuffles a deck
var createNewDeck = function () {
  var newDeck = createDeck();
  var shuffledDeck = shuffleDeck(newDeck);
  return shuffledDeck;
};

// Function that checks a hand for black jack
var checkForBlackJack = function (handArray) {
  // Loop through player hand 
  // if there is a blackjack return true
  // else return false
  var playerCardOne = handArray[0];
  var playerCardTwo = handArray[1];
  var isBlackJack = false;

  // Possible black jack scenerios  
  // First card is Ace +  Second card is 10 or suits
  // Second card is Ace +  First card is 10 or suits
  if (  
    (playerCardOne.name == 'ace' && playerCardTwo.rank >= 10) ||
    (playerCardTwo.name == 'ace' && playerCardOne.rank >= 10)
  ) {
    isBlackJack = true;
  }

  return isBlackJack;
};

// Function that calculates a hand
var calculateTotalHandValue = function (handArray) {
  var totalHandValue = 0;
  // Counter to keep track of the number of aces found within the given hand
  var aceCounter = 0;

  // Loop through player or dealers hand and add up the ranks
  var index = 0;
  while (index < handArray.length) {
    var currCard = handArray[index];

    // In blackjack, the value of king, queen, and jack are counted as 10 by default
    if (currCard.name == 'king' || currCard.name == 'queen' || currCard.name == 'jack') {
      totalHandValue = totalHandValue + 10;
    }
    // We count the value of ace as 11 by default
    else if (currCard.name == 'ace') {
      totalHandValue = totalHandValue + 11;
      aceCounter = aceCounter + 1;
    // Else, all other numbered cards are valued by their ranks
    } else {
      totalHandValue = totalHandValue + currCard.rank;
    }
    index = index + 1;
  }
  
  // Reset index for ace counter
  index = 0;
  // Loop for the number of aces found and only deduct 10 from total hand value 
  // when totalHandValue is more than 21.
  while (index < aceCounter) {
    if (totalHandValue > 21) {
      totalHandValue = totalHandValue - 10;
    }
    index = index + 1;
  }

  return totalHandValue;
};

// Function that displays the player and dealers hand in a message
var displayPlayerAndDealerHands = function (playerHandArray, dealerHandArray) {
  var playerMessage = 'Player hand:<br>';
  var index = 0;
  while (index < playerHandArray.length) {
    playerMessage = playerMessage + '- ' + playerHandArray[index].name + ' of ' + playerHandArray[index].suit + '<br>';
    index = index + 1;
  }

  index = 0;
  var dealerMessage = 'Dealer hand:<br>';
  while (index < dealerHandArray.length) {
    dealerMessage = dealerMessage + '- ' + dealerHandArray[index].name + ' of ' + dealerHandArray[index].suit + '<br>';
    index = index + 1;
  }

  return playerMessage + '<br>' + dealerMessage;
};

// Function that displays the total hand values of the player and the dealer in a message
var displayHandTotalValues = function (playerHandValue, dealerHandValue) {
  var totalHandValueMessage = '<br>Player total hand value: ' + playerHandValue + '<br>Dealer total hand value: ' + dealerHandValue;
  return totalHandValueMessage;
};

var resetGame = function() {
  currentGameMode = GAME_START;
  playerHand = [];
  dealerHand = [];
}

var main = function (input) {
  var outputMessage = '';

  // FIRST CLICK
  if (currentGameMode == GAME_START) {
    // create a deck of cards 
    gameDeck = createNewDeck();

    // deal 2 cards to player and dealer
    playerHand.push(gameDeck.pop());
    playerHand.push(gameDeck.pop());
    dealerHand.push(gameDeck.pop());
    dealerHand.push(gameDeck.pop());

    // update gameMode
    currentGameMode = GAME_CARDS_DRAWN;

    // reassign output message
    outputMessage = 'Everyone has been dealt a card. Click "Draw" to calculate cards!';

    // return message
    return outputMessage;
  }

  // SECOND CLICK
  if (currentGameMode == GAME_CARDS_DRAWN) {
    // check for blackjack
    var playerHasBlackJack = checkForBlackJack(playerHand);
    var dealerHasBlackJack = checkForBlackJack(dealerHand);

    console.log("Does Player have Black Jack? ==>", playerHasBlackJack);
    console.log("Does Dealer have Black Jack? ==>", dealerHasBlackJack);

    // Condition when either player or dealer has black jack
    if (playerHasBlackJack == true || dealerHasBlackJack == true) {
      // Condition where both have black jack
      if (playerHasBlackJack == true && dealerHasBlackJack == true) {
        outputMessage = displayPlayerAndDealerHands(playerHand, dealerHand) + '<br>Its a Black Jack Tie!';
      } 
      // Condition when only player has black jack
      else if (playerHasBlackJack == true && dealerHasBlackJack == false) {
        outputMessage = displayPlayerAndDealerHands(playerHand, dealerHand) + '<br>Player wins by Black Jack!';
      } 
      // Condition when only dealer has black jack
      else {
        outputMessage = displayPlayerAndDealerHands(playerHand, dealerHand) + '<br>Dealer wins by Black Jack!';
      }
    }

    // Condition where neither player nor dealer has black jack
    // ask player to input 'hit' or 'stand'
    else {
      outputMessage = displayPlayerAndDealerHands(playerHand, dealerHand) + '<br> There are no Black Jacks. <br>Please input "hit" or "stand".';
      
      // update gameMode
      currentGameMode = GAME_HIT_OR_STAND;
    }

    // return message
    return outputMessage;
  }

  // THIRD CLICK
  if (currentGameMode == GAME_HIT_OR_STAND) {
    //HIT
    if (input == "hit" || input == "HIT") {
      // CALCULATE HANDS
      var playerHandTotalValue = calculateTotalHandValue(playerHand);
      playerHand.push(gameDeck.pop());
      outputMessage = `${displayPlayerAndDealerHands(
        playerHand,
        dealerHand
      )} <br> You drew another card. <br> Click HIT or STAND button if you would like to draw another.`;
    }
    //STAND
    else if (input == "stand" || input == "STAND") {
      // CALCULATE HANDS
      var playerHandTotalValue = calculateTotalHandValue(playerHand);
      var dealerHandTotalValue = calculateTotalHandValue(dealerHand);
      // DEALERS HAND
      while (dealerHandTotalValue < 17) {
        dealerHand.push(gameDeck.pop());
        dealerHandTotalValue = calculateTotalHandValue(dealerHand);
      }
      // SAME VALUE = TIE
      if (
        playerHandTotalValue == dealerHandTotalValue ||
        (playerHandTotalValue > 21 && dealerHandTotalValue > 21)
      ) {
        outputMessage =
          displayPlayerAndDealerHands(playerHand, dealerHand) +
          "It is a tie!" +
          displayHandTotalValues(playerHandTotalValue, dealerHandTotalValue);
      }
      // PLAYER VALUE > DEALER VALUE = PLAYER WINS
      else if (
        (playerHandTotalValue > dealerHandTotalValue &&
          playerHandTotalValue <= 21) ||
        (playerHandTotalValue <= 21 && dealerHandTotalValue > 21)
      ) {
        outputMessage =
          displayPlayerAndDealerHands(playerHand, dealerHand) +
          "Player wins!" +
          "<br>" +
          displayHandTotalValues(playerHandTotalValue, dealerHandTotalValue);
      }
      // DEALER VALUE > PLAYER VALUE = DEALER WINS
      else {
        outputMessage =
          displayPlayerAndDealerHands(playerHand, dealerHand) +
          "Dealer wins!" +
          "<br>" +
          displayHandTotalValues(playerHandTotalValue, dealerHandTotalValue);
      }
      resetGame();
    }
    return outputMessage;
  }
};