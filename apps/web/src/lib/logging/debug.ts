export function debugLog(message: string) {
  if (shouldDebugLog()) {
    // eslint-disable-next-line no-console -- Explicit debug logging
    console.info(message);
  }
}

export function debugLogDivider() {
  if (shouldDebugLog()) {
    // eslint-disable-next-line no-console -- Explicit debug logging
    console.info(
      "-------------------------------------------------------------------"
    );
  }
}

export function shouldDebugLog() {
  return process.env.NEXT_PUBLIC_ENABLE_DEBUG_LOGGING === "true";
}
