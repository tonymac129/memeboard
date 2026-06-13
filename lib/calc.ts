export function displayTime(time: number): string | null {
  const currentTime = new Date().getTime();
  const msDiff = currentTime - time;
  if (msDiff < 3600000) {
    return `${Math.round(msDiff / 60000)} minutes ago`;
  } else if (msDiff < 86400000) {
    return `${Math.round(msDiff / (1000 * 60 * 60))} hours ago`;
  }
  return null;
}
