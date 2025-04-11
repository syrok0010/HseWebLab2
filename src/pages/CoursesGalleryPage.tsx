import React from "react";
import { useCurrencyRates } from "../hooks/useCurrencyRates";
import CurrencyCard from "../components/CurrencyCard";
import { DEFAULT_GALLERY_BASE_CURRENCY } from "../constants";
import "./CoursesGalleryPage.css";

const BASE_CURRENCY = DEFAULT_GALLERY_BASE_CURRENCY;

const CoursesGalleryPage: React.FC = () => {
  const { rates, date, loading, error } = useCurrencyRates(BASE_CURRENCY);

  return (
    <div className="container courses-gallery-container">
      <h1>{BASE_CURRENCY} Exchange Rates Today</h1>
      {date && !loading && !error && (
        <p className="update-date">Data as of: {date}</p>
      )}

      {/* Loading and Error States */}
      {loading && <div className="loading-message">Loading rates...</div>}
      {error && !loading && (
        <div className="error-message">Data loading error: {error}</div>
      )}

      {/* Rates Grid */}
      {rates && !loading && !error && (
        <div className="courses-grid">
          {Object.entries(rates)
            .filter(
              ([code]) => code.toUpperCase() !== BASE_CURRENCY.toUpperCase(),
            )
            .sort(([codeA], [codeB]) => codeA.localeCompare(codeB))
            .map(([currencyCode, rate]) => (
              <CurrencyCard
                key={currencyCode}
                baseCode={BASE_CURRENCY}
                targetCode={currencyCode}
                rate={typeof rate === "number" ? rate : 0}
              />
            ))}
        </div>
      )}

      {/* No Data State */}
      {!loading && !error && (!rates || Object.keys(rates).length === 0) && (
        <div className="info-message">No exchange rate data available.</div>
      )}
    </div>
  );
};

export default CoursesGalleryPage;
