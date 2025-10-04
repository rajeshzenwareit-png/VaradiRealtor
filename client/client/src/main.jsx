import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppLoaderProvider from "./components/AppLoaderProvider";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppLoaderProvider>
        {/* Suspense for lazy-loaded routes/components */}
        <Suspense fallback={null}>
          <App />
        </Suspense>
      </AppLoaderProvider>
    </BrowserRouter>
  </React.StrictMode>
);
