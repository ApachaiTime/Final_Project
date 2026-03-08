import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./vendor/font.css";
import "./index.css";
import App from "../src/components/App/App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/Final_Project/">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
