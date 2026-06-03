import { setBaseUrl } from "@workspace/api-client-react";
import { API_BASE_URL } from "./auth";

setBaseUrl(API_BASE_URL || null);
