import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./core/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

// Dynamically inject the Roboto font into the head
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
