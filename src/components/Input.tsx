import { FormEvent, useState } from 'react';

type InputProps = {
  disabled: boolean;
  onSubmitGuess: (guess: string) => boolean;
};

export const Input = ({ disabled, onSubmitGuess }: InputProps) => {
  const [value, setValue] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) {
      return;
    }

    const accepted = onSubmitGuess(trimmed);
    if (accepted) {
      setValue('');
    }
  };

  return (
    <form className="guess-input" onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Type a country name..."
        disabled={disabled}
        autoFocus
      />
      <button type="submit" disabled={disabled}>
        Submit
      </button>
    </form>
  );
};
