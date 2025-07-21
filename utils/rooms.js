const rooms = [];

export function createRoom(roomID) {
  const room = { id: roomID, players: 0 };

  const roomCheck = rooms.find((Room) => Room.id === room.id);
  if (roomCheck) {
    return { message: "Room already exists" };
  }

  rooms.push(room);
  return room;
}

export function checkRoom(id) {
  const room = rooms.find((room) => room.id === id);

  if (room) {
    return room;
  } else {
    return { message: "Could not find room" };
  }
}
