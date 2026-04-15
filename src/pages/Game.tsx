import { useEffect } from 'react';
import { Input } from '../components/Input';
import { Map } from '../components/Map';
import { Score } from '../components/Score';
import { Timer } from '../components/Timer';
import { isGameActive, useGameStore } from '../store/gameStore';

export const Game = () => {
  const {
    foundCountries,
    score,
    progress,
    remainingSeconds,
    status,
    totalCountries,
    start,
    submit,
    tickTimer,
    revealAll,
    reset,
    lastAcceptedCountry
  } = useGameStore();

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (!isGameActive(status)) {
      return;
    }

    const timer = window.setInterval(() => {
      tickTimer();
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status, tickTimer]);

  const hasEnded = status === 'completed' || status === 'gave_up';

  return (
    <main className="game-page">
      <header className="header">
        <h1>Countries of the World Quiz</h1>
        <p>Type every UN member state before the timer ends.</p>
      </header>

      <section className="top-grid">
        <Score score={score} total={totalCountries} progress={progress} />
        <Timer remainingSeconds={remainingSeconds} />
      </section>

      <section className="card controls-card">
        <Input disabled={hasEnded} onSubmitGuess={submit} />
        <div className="buttons-row">
          <button className="secondary" onClick={revealAll} disabled={hasEnded}>
            Give up
          </button>
          <button className="secondary" onClick={reset}>
            Reset
          </button>
        </div>
        <p className="feedback">
          {lastAcceptedCountry ? `✅ ${lastAcceptedCountry} accepted` : 'Start typing to guess countries.'}
        </p>
        {status === 'completed' && <p className="feedback">⏰ Time is up or all countries found.</p>}
        {status === 'gave_up' && <p className="feedback">🏳️ All countries have been revealed.</p>}
      </section>

      <Map foundCountries={foundCountries} />
    </main>
  );
};
