import React from "react";
import { Link } from "react-router-dom";
import { formatRateDisplay } from "../utils/formatting";

interface CurrencyCardProps {
  baseCode: string;
  targetCode: string;
  rate: number;
}

const CurrencyCard: React.FC<CurrencyCardProps> = ({
  baseCode,
  targetCode,
  rate,
}) => {
  return (
    <Link
      to={`/${baseCode.toLowerCase()}/${targetCode.toLowerCase()}`}
      className="currency-card-link"
      aria-label={`View ${baseCode} to ${targetCode} exchange rate`}
    >
      <div className="currency-card">
        <span className="currency-code">{targetCode.toUpperCase()}</span>
        <span className="currency-rate">
          {formatRateDisplay(rate)} {targetCode.toUpperCase()}
        </span>
        <span className="currency-base">per 1 {baseCode.toUpperCase()}</span>
      </div>
    </Link>
  );
};

export default CurrencyCard;
