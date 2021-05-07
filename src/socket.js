import { io } from "socket.io-client";

const URL = window.webpackHotUpdate ? "http://localhost:3000" : "https://sixtakesgame.azurewebsites.net";
const createSocket = (gamecode) => {
  const options = { autoConnect: false }
  if (gamecode) {
    options.query = `gamecode=${gamecode}`
  }
  return io(URL, options);
}

export default createSocket;