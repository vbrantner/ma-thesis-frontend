import { NavLink, Outlet } from "react-router-dom";

const routes = [
  {
    href: "/websocket",
    name: "Websocket",
  },
  {
    href: "/yield-to-img-tag",
    name: "Yield to Image tag",
  },
  {
    href: "/webrtc",
    name: "WebRTC",
  },
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
