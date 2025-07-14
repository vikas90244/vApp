export function convertTime(date: string): string {
  const pollEndTime = new Date(date).getTime(); // UTC ms
  const now = Date.now();                       // Also UTC ms

  const timeLeftMs = pollEndTime - now;

  if (timeLeftMs <= 0) return 'Ended';

  const totalMinutes = Math.floor(timeLeftMs / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m left`;
  if (hours > 0) return `${hours}h left`;
  return `${minutes}m left`;
}
