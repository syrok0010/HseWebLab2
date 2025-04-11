import React from "react";
import { Link } from "react-router-dom";
import { formatRateDisplay } from "../utils/formatting";

interface CurrencyCardProps {
  baseCode: string;
  targetCode: string;
  rate: number;
}

const generateColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  const hue = Math.abs(hash % 360);
  const saturation = 70;
  const lightness = 55;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const CurrencyCard: React.FC<CurrencyCardProps> = ({
  baseCode,
  targetCode,
  rate,
}) => {
  const iconBgColor = generateColorFromString(targetCode);
  const iconLetters = targetCode
    .substring(0, targetCode.length >= 2 ? 2 : 1)
    .toUpperCase();

  return (
    <Link
      to={`/${baseCode.toLowerCase()}/${targetCode.toLowerCase()}`}
      className="currency-card-link"
      aria-label={`View ${baseCode} to ${targetCode} exchange rate`}
    >
      <div className="currency-card">
        <div
          className="currency-icon-placeholder"
          style={{ backgroundColor: iconBgColor }}
          aria-hidden="true"
        >
          {iconLetters}
        </div>
        <span className="currency-code">{targetCode.toUpperCase()}</span>
        <span className="currency-rate">{formatRateDisplay(rate)}</span>
        <span className="currency-base">per 1 {baseCode.toUpperCase()}</span>
      </div>
    </Link>
  );
};

export default CurrencyCard;
