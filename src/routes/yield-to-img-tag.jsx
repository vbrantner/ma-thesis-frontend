import { useRef, useState, useEffect } from "react";

export default function YieldToImgTagPage() {
  return (
    <div className="relative">
      <h1 className="text-2xl">Yield to Image tag</h1>
      <InteractiveCanvas>
        <img className="" src={"http://localhost:3000/video_feed"} />
      </InteractiveCanvas>
    </div>
  );
}

function InteractiveCanvas(props) {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [receivedCoordinates, setReceivedCoordinates] = useState(null);
  const [socket, setSocket] = useState(null);
  const elementRef = useRef(null);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8000");
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleSocketMessage = (event) => {
      const data = JSON.parse(event.data);
      setReceivedCoordinates(data);
    };

    socket.addEventListener("message", handleSocketMessage);

    return () => {
      socket.removeEventListener("message", handleSocketMessage);
    };
  }, [socket]);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const elementRect = elementRef.current.getBoundingClientRect();
    const offsetX = clientX - elementRect.left;
    const offsetY = clientY - elementRect.top;
    const newCoordinates = { x: offsetX, y: offsetY };
    setCoordinates(newCoordinates);

    if (socket) {
      socket.send(JSON.stringify(newCoordinates));
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="border-2 border-blue-500 w-3/4 h-1/2 relative"
    >
      <div className="absolute top-0 left-0 bg-gray-50/50 p-2 rounded-md m-2 ring-1 ring-black ring-opacity-20">
        <p className="">Mouse Coordinates</p>
        <div className="flex space-x-4">
          <div>
            <p>Computer</p>
            <p>X: {coordinates.x}</p>
            <p>Y: {coordinates.y}</p>
          </div>
          {receivedCoordinates && (
            <div>
              <p>Via Websocket</p>
              <p>X: {receivedCoordinates.x}</p>
              <p>Y: {receivedCoordinates.y}</p>
            </div>
          )}
        </div>
      </div>
      <div ref={elementRef}>{props.children}</div>
      {receivedCoordinates && (
        <div
          className={`h-4 w-4 bg-red-600 rounded-full`}
          // className={`h-4 w-4 bg-red-600 rounded-full top-10 left-10 absolute`}
          style={{
            position: "absolute",
            top: `${receivedCoordinates.y}px`,
            left: `${receivedCoordinates.x}px`,
          }}
        ></div>
      )}
    </div>
  );
}
