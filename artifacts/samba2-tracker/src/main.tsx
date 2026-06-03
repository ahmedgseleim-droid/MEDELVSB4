import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";
import { API_BASE_URL, getStoredToken } from "./lib/auth";

setBaseUrl(API_BASE_URL || null);
setAuthTokenGetter(() => getStoredToken());

createRoot(document.getElementById("root")!).render(<App />);
