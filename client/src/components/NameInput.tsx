import React, { useState } from "react";
import "../styles/Button.css"; // You can create a separate CSS file for styling

interface NameInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// A component function so that users can enter their name
const NameInput: React.FC<NameInputProps> = ({ value, onChange }) => {
  // use state function for managing states
  const [name, setName] = useState<string>("");
  const [isEditing, setEditing] = useState<boolean>(false);

  return (
    <div className="nameInputContainer">
      {isEditing ? (
        <input
          className="nameInput"
          type="text"
          value={value}
          onChange={onChange}
          onBlur={() => setEditing(false)}
          autoFocus
        />
      ) : (
        <span className="nameDisplay" onClick={() => setEditing(true)}>
          {name || "Enter your name"}
        </span>
      )}
    </div>
  );
};

export default NameInput;
