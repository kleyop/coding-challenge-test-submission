import React, { FunctionComponent } from "react";

import $ from "./InputText.module.css";

interface InputTextProps {
  name: string;
  placeholder: string;
  value: string | number | readonly string[] | undefined;  // Accept more types for value
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputText: FunctionComponent<InputTextProps> = ({
  name,
  onChange,
  placeholder,
  value,
}) => {
  return (
    <input
      aria-label={name}
      className={$.inputText}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      type="text"
      value={value ?? ""}  // Fallback to empty string if value is undefined
    />
  );
};

export default InputText;
