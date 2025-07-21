let players = [];

export function addPlayer(user) {
  const player = { username: user.username, roomCode: user.code, hand: [] };
  players.push(player);
}

export function trackPlayerHand(user, __hand) {
  const index = players.findIndex(
    (player) =>
      player.username === user.username && player.roomCode === user.code
  );

  players[index].hand = __hand;
}

export function removePlayer(user) {
  const index = players.findIndex(
    (player) =>
      player.username === user.username && player.roomCode === user.code
  );

  if (index !== -1) {
    players.splice(index, 1);
  }
}

export function getPlayers(roomCode) {
  const playersInRoom = players.filter(
    (player) => Number(player.roomCode) === roomCode
  );

  if (playersInRoom) {
    return playersInRoom;
  } else {
    console.log("could not find players in that room");
  }
}
