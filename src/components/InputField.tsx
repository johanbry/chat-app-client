import { ChangeEvent } from "react";

type Props = {
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required: boolean;
};

const InputField = ({
  type,
  value,
  onChange,
  required,
  placeholder,
}: Props) => {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </>
  );
};

export default InputField;
