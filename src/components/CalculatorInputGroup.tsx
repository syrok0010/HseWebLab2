import React from "react";

interface CalculatorInputGroupProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const CalculatorInputGroup: React.FC<CalculatorInputGroupProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = "0.00",
}) => {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input
        type="number"
        inputMode="decimal"
        pattern="[0-9]*\.?[0-9]*"
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min="0"
        step="any"
        autoComplete="off"
      />
    </div>
  );
};

export default CalculatorInputGroup;
