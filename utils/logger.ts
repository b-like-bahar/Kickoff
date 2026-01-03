import pino from "pino";
import { isLocalhost } from "@/utils/global-utils";

export const logger = pino({
  level: isLocalhost ? "debug" : "info",
  formatters: {
    level: label => {
      return { level: label };
    },
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  // In development, use basic formatting without transport
  // In production, use default JSON output
});
