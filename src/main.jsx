import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import WebsocketPage from "./routes/websocket";
import YieldToImgTagPage from "./routes/yield-to-img-tag";
import WebRTCPage from "./routes/webrtc_main";

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
        path: "/yield-to-img-tag",
        element: <YieldToImgTagPage />,
      },
      {
        path: "/webrtc",
        element: <WebRTCPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
