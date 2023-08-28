import { ChangeEvent, KeyboardEvent } from 'react';
import './inputfield.scss';
type Props = {
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required: boolean;
  className?: string;
  autofocus?: boolean;
};

const InputField = ({
  type,
  value,
  onChange,
  onKeyDown,
  required,
  placeholder,
  className,
  autofocus,
}: Props) => {
  return (
    <>
      <input
        className={className}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        required={required}
        autoFocus={autofocus}
      />
    </>
  );
};

export default InputField;
