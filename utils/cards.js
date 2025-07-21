const cards = [];

const suits = ["clubs", "hearts", "diamonds", "spades"];

export function generateCards() {
  for (let i = 0; i < suits.length; i++) {
    for (let j = 1; j <= 13; j++) {
      let card = {};
      card.suit = suits[i];
      card.value = j;
      console.log(card);
      cards.push(card);
    }
  }
}

export function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    const cardIndex = Math.floor(Math.random() * (i + 1));

    [cards[i], cards[cardIndex]] = [cards[cardIndex], cards[i]];
  }
}

export function createHand() {
  let hand = [];

  for (let i = 0; i < 4; i++) {
    let [currentCard] = cards.splice(1, 1);
    hand.push(currentCard);
  }

  console.log(cards);
  console.log(cards.length);
  return hand;
}

export function drawCard() {
  let [card] = cards.splice(1, 1);

  return card;
}

export function regenerateCards() {
  cards.length = 0;

  generateCards();
}
