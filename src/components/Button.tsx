// Button.tsx

import React, { FC, ButtonHTMLAttributes } from "react";
import "../styles/Button.css"; // You can create a separate CSS file for styling

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Add any additional props or customization you need
  customProp?: string;
}

const Button: FC<ButtonProps> = ({ customProp, ...props }) => {
  return (
    <button className="button" {...props}>
      {customProp || "Click me"} {/* Use customProp or a default text */}
    </button>
  );
};

export default Button;
