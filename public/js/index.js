const socket = io();

const createForm = document.querySelector("#create-form");
const joinForm = document.querySelector("#join-form");

socket.on("msg", (msg) => {
  console.log(msg);
});

createForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const roomCode = Math.floor(Math.random() * 90000 + 10000);
  document.querySelector("#code-input").value = roomCode;

  socket.emit("create room", { code: roomCode });

  setTimeout(() => {
    const usernameValue = encodeURIComponent(
      document.querySelector("#username").value
    );
    window.location.href = `/bunga.html?code=${roomCode}&username=${usernameValue}`;
  }, 500);
});

joinForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const roomCode = document.querySelector("#join-input").value;
  socket.emit("room check", roomCode);

  socket.on("successful room check", () => {
    const usernameValue = encodeURIComponent(
      document.querySelector("#username").value
    );
    window.location.href = `/bunga.html?code=${roomCode}&username=${usernameValue}`;
  });
});
