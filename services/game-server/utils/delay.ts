export async function delay(waitMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, waitMs);
  });
}
