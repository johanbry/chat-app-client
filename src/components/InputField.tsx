import { ChangeEvent, KeyboardEvent } from "react";
import "./inputfield.scss";
type Props = {
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required: boolean;
  className?: string;
};

const InputField = ({
  type,
  value,
  onChange,
  onKeyDown,
  required,
  placeholder,
  className,
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
      />
    </>
  );
};

export default InputField;
