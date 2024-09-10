import React from "react";
import styles from "./ErrorMessage.module.css"; // Assuming you're using CSS Modules

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return <div className={styles.errorMessage}>{message}</div>;
};

export default ErrorMessage;
