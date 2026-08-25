const socket = io("http://localhost:9000");

socket.on("connect", () => {
    console.log("connected 2");
    socket.emit("clientConnect", { text: "Hello from the client!" });
});

socket.on("welcome", (dataFromServer) => {
    console.log("Data from server: ", dataFromServer);
});