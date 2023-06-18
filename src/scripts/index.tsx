import "../styles";
import App from "./app";

import React from "react";
import { createRoot } from "react-dom/client";

const appElement = window.document.getElementsByTagName("main")[0];
const root = createRoot(appElement);
root.render(<App />);
