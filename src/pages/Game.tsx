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
    isNoTimeMode,
    pausesRemaining,
    submit,
    tickTimer,
    revealAll,
    reset,
    startTimed,
    startNoTime,
    enableNoTimeMode,
    togglePause,
    revealMissingCountries,
    showMissingCountries,
    lastAcceptedCountry
  } = useGameStore();

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
  const hasStarted = status !== 'idle';
  const isPaused = status === 'paused';
  const canPause = !isNoTimeMode && !hasEnded && (status === 'playing' || status === 'paused');
  const shouldShowPauseButton = isPaused || pausesRemaining > 0;
  const statusLabel =
    status === 'idle'
      ? 'Waiting to start'
      : status === 'playing'
        ? 'Live game'
        : status === 'paused'
          ? 'Paused'
          : status === 'completed'
            ? 'Completed'
            : 'Revealed';

  return (
    <main className="game-page">
      <header className="site-header">
        <div className="site-branding">
          <p className="brand-kicker">QUIZZY PLATFORM</p>
          <h1>Quessy</h1>
          <p>Global quiz platform crafted for millions of players.</p>
        </div>
        <div className="site-nav">
          <span className="pill">Multiplayer ready</span>
          <span className="pill">Global leaderboard (soon)</span>
        </div>
      </header>

      <section className="hero card">
        <div>
          <p className="hero-kicker">Mode #01</p>
          <h2>Countries of the World</h2>
          <p className="hero-subtitle">Name every country as fast and accurately as possible.</p>
        </div>
        <div className="hero-meta">
          <span className="mode-badge">{statusLabel}</span>
          <span className="mode-badge ghost">{isNoTimeMode ? 'No time mode' : 'Timed mode'}</span>
        </div>
      </section>

      <section className="top-grid">
        <Score score={score} total={totalCountries} progress={progress} />
        <Timer remainingSeconds={remainingSeconds} isNoTimeMode={isNoTimeMode} />
      </section>

      <section className="card controls-card">
        <Input disabled={!isGameActive(status)} onSubmitGuess={submit} />

        {!hasStarted && (
          <div className="buttons-row">
            <button onClick={startTimed}>Start</button>
            <button className="secondary" onClick={startNoTime}>
              Start in no time mode
            </button>
          </div>
        )}

        {hasStarted && !hasEnded && (
          <div className="buttons-row">
            {canPause && shouldShowPauseButton && (
              <button className="secondary" onClick={togglePause}>
                {isPaused ? 'Resume' : `Pause (${pausesRemaining} left)`}
              </button>
            )}
            {!isNoTimeMode && (
              <button className="secondary" onClick={enableNoTimeMode}>
                Switch to no time mode
              </button>
            )}
          </div>
        )}

        <div className="buttons-row">
          <button className="secondary" onClick={revealAll} disabled={hasEnded || status === 'idle'}>
            Give up
          </button>
          <button className="secondary" onClick={reset}>
            Reset
          </button>
        </div>

        {hasEnded && foundCountries.size < totalCountries && !showMissingCountries && (
          <button className="secondary" onClick={revealMissingCountries}>
            Show missing countries
          </button>
        )}

        <p className="feedback">
          {status === 'idle'
            ? 'Click Start to begin.'
            : lastAcceptedCountry
              ? `✅ ${lastAcceptedCountry} accepted`
              : 'Start typing to guess countries.'}
        </p>
        {status === 'paused' && <p className="feedback">⏸️ Game paused.</p>}
        {status === 'completed' && <p className="feedback">⏰ Time is up or all countries found.</p>}
        {status === 'gave_up' && <p className="feedback">🏳️ All countries have been revealed.</p>}
      </section>

      <Map foundCountries={foundCountries} hasEnded={hasEnded} showMissingCountries={showMissingCountries} />
    </main>
  );
};
