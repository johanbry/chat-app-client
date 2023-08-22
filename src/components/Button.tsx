import { ElementType } from "react";
import "./button.scss";

type Props = {
  text?: string;
  Icon?: ElementType;
  disabled?: boolean;
  onChange?: () => void;
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
};

const Button = ({
  text,
  Icon,
  disabled = true,
  onChange,
  onClick,
  type = "submit",
}: Props) => {
  return (
    <button
      disabled={disabled}
      onChange={onChange}
      type={type}
      onClick={onClick}
      className={Icon ? "icon-btn" : ""}
      //className={disabled ? "disabled" : ""}
    >
      {text}
      {Icon && <Icon />}
    </button>
  );
};

export default Button;
