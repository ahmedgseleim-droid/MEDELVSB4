import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";
import { getStoredToken } from "./lib/auth";

setBaseUrl("https://medelvsb3.onrender.com");
setAuthTokenGetter(() => getStoredToken());

createRoot(document.getElementById("root")!).render(<App />);