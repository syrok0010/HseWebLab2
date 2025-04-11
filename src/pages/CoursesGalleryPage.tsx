import React, { useEffect, useState } from "react";
import { useCurrencyRates } from "../hooks/useCurrencyRates";
import CurrencyCard from "../components/CurrencyCard";
import { DEFAULT_GALLERY_BASE_CURRENCY } from "../constants";
import "./CoursesGalleryPage.css";

const BASE_CURRENCY = DEFAULT_GALLERY_BASE_CURRENCY;

const CoursesGalleryPage: React.FC = () => {
  const { rates, date, loading, error } = useCurrencyRates(BASE_CURRENCY);
  const [isDataVisible, setIsDataVisible] = useState(false);

  useEffect(() => {
    if (!loading && rates) {
      const timer = setTimeout(() => {
        setIsDataVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsDataVisible(false);
    }
  }, [loading, rates]);

  const sortedRates = React.useMemo(() => {
    if (!rates) return [];
    return Object.entries(rates)
      .filter(([code]) => code.toUpperCase() !== BASE_CURRENCY.toUpperCase())
      .sort(([codeA], [codeB]) => codeA.localeCompare(codeB));
  }, [rates]);

  return (
    <div className="container courses-gallery-container">
      <h1>{BASE_CURRENCY} Exchange Rates Today</h1>
      {date && !loading && !error && (
        <p className="update-date">Data as of: {date}</p>
      )}

      {loading && <div className="loading-message">Loading rates...</div>}
      {error && !loading && (
        <div className="error-message">Data loading error: {error}</div>
      )}

      <div className={`courses-grid ${isDataVisible ? "loaded" : ""}`}>
        {!loading &&
          !error &&
          rates &&
          sortedRates.map(([currencyCode, rate], index) => (
            <div
              key={currencyCode}
              className={`grid-item-animate ${isDataVisible ? "visible" : ""}`}
              style={{ transitionDelay: `${index * 0.07}s` }}
            >
              <CurrencyCard
                baseCode={BASE_CURRENCY}
                targetCode={currencyCode}
                rate={typeof rate === "number" ? rate : 0}
              />
            </div>
          ))}
      </div>

      {!loading && !error && (!rates || sortedRates.length === 0) && (
        <div className="info-message">No exchange rate data available.</div>
      )}
    </div>
  );
};

export default CoursesGalleryPage;
