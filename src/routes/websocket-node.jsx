import { useEffect, useState } from "react";

export default function WebsocketNodePage() {
  const [imageData, setImageData] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.178.76:8080");

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      let base64Image = event.data;
      setImageData("data:image/jpeg;base64," + base64Image);
      // console.log(new Blob([arrayBufferView], { type: "image/jpeg" }));
      // // console.log(new Uint8Array(event.data));
      // const base64Image =
      //   "data:image/jpeg;base64," +
      //   btoa(
      //     new Uint8Array(event.data).reduce(
      //       (data, byte) => data + String.fromCharCode(byte),
      //       ""
      //     )
      // );
      // console.log(base64Image);
      // setImageData(base64Image);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      // Clean up the WebSocket connection when the component unmounts
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl">Websocket</h1>
      <div className="relative w-1/2 h-96">
        <div className="text-purple-500 text-xl font-bold absolute top-8 left-2">
          <span className="ml-2">{new Date().toISOString()}</span>
        </div>
        <img
          className="border-2 border-red-500"
          src={`${imageData}`}
          alt="Received Image"
        />
      </div>
    </div>
  );
}
