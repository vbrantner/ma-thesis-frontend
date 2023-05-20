import { useEffect, useRef, useState } from "react";

export default function YieldFetchStreamPage() {
  const [messageCount, setMessageCount] = useState(0);
  const [rps, setRps] = useState(0);
  const lastUpdateTime = useRef(Date.now());
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    // Define the process function
    const process = ({ done, value }) => {
      if (done) {
        return;
      }
      // Convert the Uint8Array to a Blob
      const blob = new Blob([value], { type: "image/jpeg" });
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      // Update the state with the new URL
      setImgSrc(url);
      // Continue reading the stream
      return reader.read().then(process);
    };

    fetch("/image_feed")
      .then((response) => {
        const reader = response.body.getReader();
        return reader.read().then(process);
      })
      .catch(console.error);

    // Cleanup function to cancel the stream reading if the component unmounts
    return () => {
      if (reader) {
        reader.cancel();
      }
    };
  }, []);

  useInterval(() => {
    const currentTime = Date.now();
    const timeDiff = (currentTime - lastUpdateTime.current) / 1000;
    console.log(timeDiff);
    const currentRps = messageCount / timeDiff;
    setRps(currentRps);
    setMessageCount(0);
    lastUpdateTime.current = currentTime;
  }, 1000);

  return (
    <>
      <div className="bg-gray-200 min-h-screen p-5">
        <h1 className="text-3xl">Frontend Live Img Test</h1>
        <div className="w-full border-2 border-red-500">
          {imgSrc && <img src={imgSrc} alt="streaming" />}
        </div>
        <p>{rps}</p>
        <div className="mt-10 h-72 w-full border-2 border-yellow-500">
          <video src="http://172.20.10.2:5000/stream/stream.m3u8" />
        </div>
      </div>
    </>
  );
}
