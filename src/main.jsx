import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import SingleImagesStreamPage from "./routes/singleImagesStream";
import WebsocketPage from "./routes/websocket";
import QRCodeGenerator from "./routes/qr-code-generator";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/websocket",
        element: <WebsocketPage />,
      },
      {
        path: "/single-images",
        element: <SingleImagesStreamPage />,
      },
      // {
      //   path: "/webrtc",
      //   element: <WebRTCPage />,
      // },
      // {
      //   path: "/websocket-node",
      //   element: <WebsocketNodePage />,
      // },
      // {
      //   path: "/video-stream",
      //   element: <VideoHlsStreamPage />,
      // },
      {
        path: "/qrcode",
        element: <QRCodeGenerator />,
      },
      // {
      //   path: "/qrcode-detect",
      //   element: <QRCodeDetector />,
      // },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
