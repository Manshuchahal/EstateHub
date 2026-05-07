import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const rootStyle = {
  margin: 0,
  padding: 0,
  background: "#0d0d0d",
  minHeight: "100vh",
};

Object.assign(document.body.style, rootStyle);
document.documentElement.style.background = "#0d0d0d";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
