type TimerProps = {
  remainingSeconds: number;
  isNoTimeMode: boolean;
};

const formatTimer = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

export const Timer = ({ remainingSeconds, isNoTimeMode }: TimerProps) => (
  <section className="card metric-card">
    <h2>Timer</h2>
    <p className="metric-value">{isNoTimeMode ? 'No time mode' : formatTimer(remainingSeconds)}</p>
  </section>
);
