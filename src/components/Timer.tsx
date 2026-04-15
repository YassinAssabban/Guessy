type TimerProps = {
  remainingSeconds: number;
};

const formatTimer = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

export const Timer = ({ remainingSeconds }: TimerProps) => (
  <section className="card metric-card">
    <h2>Timer</h2>
    <p className="metric-value">{formatTimer(remainingSeconds)}</p>
  </section>
);
