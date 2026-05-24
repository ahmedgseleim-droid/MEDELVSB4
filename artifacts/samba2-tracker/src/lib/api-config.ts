import { setBaseUrl } from "@workspace/api-client-react";

if (import.meta.env.PROD) {
  setBaseUrl("");
}