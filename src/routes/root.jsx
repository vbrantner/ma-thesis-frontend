import { NavLink, Outlet } from "react-router-dom";

const routes = [
  {
    href: "/websocket",
    name: "Websocket",
  },
  {
    href: "/single-images",
    name: "Single Images (mixed-type, boundary)",
  },
  // {
  //   href: "/webrtc",
  //   name: "WebRTC",
  // },
  // {
  //   href: "/websocket-node",
  //   name: "Websocket Node",
  // },
  // {
  //   href: "/video-stream",
  //   name: "Video HLS Stream",
  // },
  // {
  //   href: "/qrcode",
  //   name: "QR Code Generator",
  // },
  // {
  //   href: "/qrcode-detect",
  //   name: "QR Code Detect",
  // },
];

export default function Root() {
  return (
    <div className="bg-gray-100 min-h-screen p-5">
      <nav className="w-full ring-1 ring-black ring-opacity-20 bg-gray-50 rounded-md">
        <ul className="flex items-center">
          {routes.map((route) => (
            <NavLink
              to={route.href}
              key={route.href}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "text-blue-800 underline"
                    : "text-black no-underline"
                } px-4 py-2`
              }
            >
              {route.name}
            </NavLink>
          ))}
        </ul>
      </nav>
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
}
