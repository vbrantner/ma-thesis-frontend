import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function WebRTCPage() {
  const videoRef = useRef(null);
  useEffect(() => {
    console.log("try to connect to socket.io server");
    const socket = io("http://localhost:8080/test");

    // socket.onAny((event, ...args) => {
    //   console.log(`got ${event}`);
    // });

    socket.on("new_frame", (msg) => {
      if (videoRef.current) {
        videoRef.current.src = msg.image;
        console.log(msg.image);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1 className="text-xl">WebRTC</h1>
      <img id="stream" ref={videoRef} alt="video stream" />
    </div>
  );
}
