import { io } from "socket.io-client";

const URL = window.webpackHotUpdate ? "http://localhost:3000" : "https://sixtakesgame.openode.io";
const createSocket = (gamecode) => {
  console.log(URL)
  const options = { autoConnect: false }
  if (gamecode) {
    options.query = `gamecode=${gamecode}`
  }
  console.log(options)
  return io(URL, options);
}

export default createSocket;