import React from "react";
import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  overlay?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  overlay = false,
  className = "",
}) => {
  const containerClasses = `
    spinner-container
    ${overlay ? "spinner-container--overlay" : ""}
    spinner-container--size-${size}
    ${className}
  `;

  const spinnerClasses = `
    spinner
    spinner--size-${size}
  `;

  return (
    <div className={containerClasses} role="status" aria-label="Loading...">
      <div className={spinnerClasses}></div>
    </div>
  );
};

export default LoadingSpinner;
