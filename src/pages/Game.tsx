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

  return (
    <main className="game-page">
      <header className="header">
        <h1>Countries of the World Quiz</h1>
        <p>Type as many countries as possible before the timer ends.</p>
      </header>

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
              Start no time
            </button>
          </div>
        )}

        {hasStarted && !hasEnded && (
          <div className="buttons-row">
            {canPause && shouldShowPauseButton && (
              <button className="secondary" onClick={togglePause}>
                {isPaused ? 'Resume' : `Pause (${pausesRemaining} restantes)`}
              </button>
            )}
            {!isNoTimeMode && (
              <button className="secondary" onClick={enableNoTimeMode}>
                Passer en mode no time
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
            Afficher les pays non trouvés
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
