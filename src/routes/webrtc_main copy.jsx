import React, { useEffect, useRef, useState } from "react";

export default function WebRTCPage() {
  const pc = useRef();
  const ws = useRef();
  const [connectionStatus, setConnectionStatus] = useState(false);

  // Use the useEffect hook to setup the WebSocket connection and WebRTC peer connection when the component mounts
  useEffect(() => {
    // Create a new WebSocket connection
    ws.current = new WebSocket("ws://192.168.178.76:8080");

    ws.current.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    // Create a new RTCPeerConnection
    pc.current = new RTCPeerConnection();

    // Setup handlers for the WebSocket messages
    ws.current.onmessage = (event) => {
      console.log(event);
      const message = JSON.parse(event.data);
      console.log("Received message:", message);

      switch (message.type) {
        case "offer":
          handleOffer(message.data);
          break;
        case "ice-candidate":
          handleIceCandidate(message.data);
          break;
        default:
          console.log("Unknown message type:", message.type);
      }
    };

    // Setup handler for when a new ICE candidate is generated by the RTCPeerConnection
    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        // Send the ICE candidate to the other peer via the WebSocket server
        const message = JSON.stringify({
          type: "ice-candidate",
          data: event.candidate,
        });
        ws.current.send(message);
      }
    };

    pc.onconnectionstatechange = () => {
      // Update the connection status
      setConnectionStatus(pc.connectionState ? true : false);
      console.log("Connection status:", pc.connectionState);
    };

    return () => {
      // Cleanup function is run when the component is unmounted
      ws.current.close();
      // pc.current.close();
    };
  }, []); // Only run this hook once, when the component is first mounted

  const handleOffer = (offer) => {
    // Set the received offer as the remote description of the RTCPeerConnection
    console.log("Received offer, now sending answer...");
    pc.current
      .setRemoteDescription(new RTCSessionDescription(offer))
      // Create an answer
      .then(() => pc.current.createAnswer())
      // Set the generated answer as the local description of the RTCPeerConnection
      .then((answer) => pc.current.setLocalDescription(answer))
      // Send the answer to the other peer via the WebSocket server
      .then(() => {
        const message = JSON.stringify({
          type: "answer",
          data: pc.current.localDescription,
        });
        ws.current.send(message);
      })
      .catch(console.error);
  };

  const handleIceCandidate = (candidate) => {
    // Add the received ICE candidate to the RTCPeerConnection
    pc.current
      .addIceCandidate(new RTCIceCandidate(candidate))
      .catch(console.error);
  };

  return (
    <div>
      <h1>WebRTC Receiver</h1>
      {connectionStatus ? "connected" : "not connected"}
    </div>
  );
}
