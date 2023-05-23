import { useEffect, useState, useRef } from "react";
import { useInterval } from "../utils";

export default function WebsocketPage() {
  const [imageData, setImageData] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [rps, setRps] = useState(0);
  const lastUpdateTime = useRef(Date.now());
  const [delay, setDelay] = useState();

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.178.51:8000");

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      setMessageCount((prevCount) => prevCount + 1);
      const img = event.data.split(",")[0];
      const timestamp = event.data.split(",")[1];
      console.log(new Date(timestamp), new Date().toUTCString());
      setImageData(img);
      setDelay(
        new Date().getMilliseconds() - new Date(timestamp).getMilliseconds()
      );
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      // Clean up the WebSocket connection when the component unmounts
      socket.close();
    };
  }, []);

  useInterval(() => {
    const currentTime = Date.now();
    const timeDiff = (currentTime - lastUpdateTime.current) / 1000;
    const currentRps = messageCount / timeDiff;
    setRps(currentRps);
    setMessageCount(0);
    lastUpdateTime.current = currentTime;
  }, 1000);

  return (
    <div>
      <h1 className="text-2xl">Websocket</h1>
      <div className="relative w-1/2 h-96">
        <p className="text-yellow-500 text-xl font-bold absolute top-2 left-2">
          {rps}
        </p>
        <p className="text-purple-500 text-xl font-bold absolute top-8 left-2">
          {delay}
        </p>
        <img
          className="border-2 border-red-500"
          src={`data:image/jpeg;base64, ${imageData}`}
          alt="Received Image"
        />
      </div>
    </div>
  );
}
