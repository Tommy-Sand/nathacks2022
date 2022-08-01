import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ActivityDataProvider } from "./context/ActivityDataContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ActivityDataProvider>
    <App />
  </ActivityDataProvider>
);
