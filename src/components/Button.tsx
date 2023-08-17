type Props = {
  text: string;
  disabled?: boolean;
  onChange?: () => void;
  type?: "submit" | "button" | "reset";
};

const Button = ({
  text,
  disabled = true,
  onChange,
  type = "submit",
}: Props) => {
  return (
    <button disabled={disabled} onChange={onChange} type={type}>
      {text}
    </button>
  );
};

export default Button;
