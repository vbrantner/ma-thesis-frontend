import { useEffect, useState } from "react";

export default function WebsocketPage() {
  const [imageData, setImageData] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.178.76:8000");

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      setImageData(event.data);
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
      <img
        className="border-2 border-red-500"
        src={`data:image/jpeg;base64, ${imageData}`}
        alt="Received Image"
      />
    </div>
  );
}
