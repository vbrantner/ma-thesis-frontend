import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import { useRef } from "react";

export default function QRCodeGenerator() {
  const canvasRef = useRef(null);
  const barcodeRef = useRef(null);

  function startGenerator() {
    let count = 0;
    const size = 180;
    const positions = [
      { x: 0 * size, y: 0 * size },
      { x: 0 * size, y: 1 * size + 1 },
      { x: 0 * size, y: 2 * size + 1 },
      { x: 0 * size, y: 3 * size + 1 },
      { x: 1 * size + 1, y: 0 * size },
      { x: 1 * size + 1, y: 1 * size + 1 },
      { x: 1 * size + 1, y: 2 * size + 1 },
      { x: 1 * size + 1, y: 3 * size + 1 },
      { x: 2 * size + 1, y: 0 * size },
      { x: 2 * size + 1, y: 1 * size + 1 },
      { x: 2 * size + 1, y: 2 * size + 1 },
      { x: 2 * size + 1, y: 3 * size + 1 },
      { x: 3 * size + 1, y: 0 * size },
      { x: 3 * size + 1, y: 1 * size + 1 },
      { x: 3 * size + 1, y: 2 * size + 1 },
      { x: 3 * size + 1, y: 3 * size + 1 },
    ];
    setInterval(() => {
      QRCode.toCanvas(canvasRef.current, Date.now().toString(), {
        width: 175,
        height: 175,
        errorCorrectionLevel: "H",
      });
      count++;
      const pos = count % positions.length;
      canvasRef.current.style.top = `${positions[pos].y}px`;
      canvasRef.current.style.left = `${positions[pos].x}px`;
    }, 1000 / 35);
  }

  function startBarCodeGenerator() {
    setInterval(() => {
      JsBarcode(barcodeRef.current, Date.now().toString(), {
        format: "CODE128",
        width: 4,
        height: 200,
        displayValue: true,
      });
    }, 1000 / 40);
  }

  return (
    <div className="">
      <div className="space-x-2 py-2">
        <button
          className="px-2 py-1 bg-gray-100 rounded-md ring-1 ring-black ring-opacity-20"
          onClick={() => startGenerator()}
        >
          Start QR Code
        </button>
        <button
          className="px-2 py-1 bg-gray-100 rounded-md ring-1 ring-black ring-opacity-20"
          onClick={() => startBarCodeGenerator()}
        >
          Start Barcode
        </button>
      </div>
      <div className="relative h-[80vh] bg-white border-2 border-red-500 w-full p-15 rounded-lg">
        <img
          className="object-cover h-full w-full"
          src="https://www.apricon.fi/wp-content/uploads/csm_image-processing-visionline-basic-1140x641.jpg"
        />
        <canvas ref={canvasRef} id="canvas" className="m-5 absolute"></canvas>
        <canvas id="barcode" ref={barcodeRef} className="p-20"></canvas>
      </div>
    </div>
  );
}
