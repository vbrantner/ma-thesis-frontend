import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

export default function QRCodeDetector() {
  const [rps, setRps] = useState(0); // rps = reads per readsPerSecond
  const [rps2, setRps2] = useState(0); // rps = reads per readsPerSecond
  const [qrReads, setQrReads] = useState(0);
  const [timeStart, setTimeStart] = useState(0);
  const videoRef = useRef(null);
  const videoRef2 = useRef(null);
  let qrScanner;
  let qrScanner2;

  function startScan() {
    const start = performance.now();
    let timeOne;
    let timeTwo;
    let counter = 0;
    qrScanner = new QrScanner(
      videoRef.current,
      (result) => {
        timeOne = Number(result.data);
        counter += 1;
        setRps(counter / ((performance.now() - start) / 1000));
      },
      {
        preferredCamera: 0,
        maxScansPerSecond: 100,
        highlightScanRegion: true,
      }
    );
    qrScanner.start();

    qrScanner2 = new QrScanner(
      videoRef2.current,
      (result) => {
        timeTwo = Number(result.data);
        console.log(timeOne, timeTwo, Math.abs((timeOne - timeTwo) / 1000));
      },
      {
        maxScansPerSecond: 100,
        preferredCamera:
          "d44d49c606eaacdecafa078299740e03b31f7dd82b2bb2dcdb019dba640d1849",
        highlightScanRegion: true,
      }
    );
    qrScanner2.start();

    setTimeStart(performance.now());
  }

  function startScan2() {
    let counter = 0;
    setTimeStart(performance.now());
  }

  function listCameras() {
    QrScanner.listCameras().then((devices) => {
      console.log(devices);
    });
  }

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <div className="flex space-x-2">
        <button
          className="p-2 bg-gray-300 rounded-md"
          onClick={() => startScan()}
        >
          start cam 1
        </button>
        <button
          className="p-2 bg-gray-300 rounded-md"
          onClick={() => listCameras()}
        >
          check camera
        </button>
        <button
          className="p-2 bg-gray-300 rounded-md"
          onClick={() => startScan2()}
        >
          start cam 2
        </button>
      </div>
      <div className="flex flex-col">
        <video className="w-full h-64 border border-red-500" ref={videoRef} />
        <video className="w-full h-64 border border-red-500" ref={videoRef2} />
      </div>
      {/* <p>{result}</p> */}
      {rps}
    </div>
  );
}
