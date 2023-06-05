import React, { useEffect, useRef } from "react";

export default function VideoHlsStreamPage() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    fetch("http://192.168.178.76:3000/video")
      .then((response) => response.body)
      .then((rb) => {
        const reader = rb.getReader();
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                push();
              });
            }
            push();
          },
        });
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        return videoRef.current.play();
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-3xl">Frontend Live Img Test</h1>
      <div className="w-full border-2 border-red-500">
        {/* <video src="http://192.168.178.76:3000/video" controls /> */}
        <video ref={videoRef} autoPlay controls />
      </div>
    </div>
  );
}
