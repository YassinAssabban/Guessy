type ScoreProps = {
  score: number;
  total: number;
  progress: number;
};

export const Score = ({ score, total, progress }: ScoreProps) => (
  <section className="card metric-card">
    <h2>Score</h2>
    <p className="metric-value">
      {score}/{total}
    </p>
    <p className="metric-subtext">Progress: {progress}%</p>
  </section>
);
