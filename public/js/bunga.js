const socket = io();

const roomCode = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.emit("new player", roomCode);

let draw = document.createElement("button");
draw.setAttribute("id", "draw-button");
draw.setAttribute("disabled", "true");
draw.innerHTML = "Draw Card";
document.querySelector("#output").appendChild(draw);

socket.on("msg", (msg) => {
  console.log(msg);
});

socket.on("you are host", () => {
  document.querySelector("#start-button").removeAttribute("disabled");
});

draw.addEventListener("click", () => socket.emit("draw card"));

socket.on("receive card", (card) => {
  console.log(card);
});

document
  .querySelector("#start-button")
  .addEventListener("click", () => socket.emit("start game"));

socket.once("receive hand", (hand) => {
  for (let i = 0; i < hand.length; i++) {
    let card = document.createElement("div");
    card.textContent = `${hand[i].value} of ${hand[i].suit}`;
    document.querySelector("#output").appendChild(card);
  }
});

socket.on("set turn", (socketId) => {
  if (socket.id === socketId) {
    draw.removeAttribute("disabled");
  } else {
    draw.setAttribute("disabled", true);
  }
});

socket.on("player list", (playerList) => {
  document.querySelector("#player-list").innerHTML = "";
  for (let i = 0; i < playerList.length; i++) {
    let playerObject = document.createElement("div");
    playerObject.textContent = `${playerList[i].username}`;
    document.querySelector("#player-list").appendChild(playerObject);
  }
});
