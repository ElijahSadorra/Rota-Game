// Button.tsx

import { FC, ButtonHTMLAttributes } from "react";
import "../styles/Button.css"; // You can create a separate CSS file for styling

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  customProp?: string;
}

// A function component to return a button
const Button: FC<ButtonProps> = ({ customProp, ...props }) => {
  return (
    <button className="button" {...props}>
      {customProp === "back-button" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M20 11H7.414l2.293-2.293a1 1 0 0 0-1.414-1.414l-4 4a1 1 0 0 0 0 1.414l4 4a1 1 0 0 0 1.414-1.414L7.414 13H20a1 1 0 0 0 0-2z" />
        </svg>
      ) : (
        customProp || "Click me"
      )}
    </button>
  );
};

export default Button;
