import React, { useMemo, useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import CurrencyCard from "../components/CurrencyCard";
import type { GalleryLoaderData } from "../loaders";
import "./CoursesGalleryPage.css";

const CoursesGalleryPage: React.FC = () => {
  const loaderData = useLoaderData() as GalleryLoaderData;
  const { rates, date, baseCurrency } = loaderData;

  const [isAnimationActive, setIsAnimationActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationActive(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const sortedRates = useMemo(() => {
    if (!rates) return [];
    return Object.entries(rates).sort(([codeA], [codeB]) =>
      codeA.localeCompare(codeB),
    );
  }, [rates]);

  const hasData = rates && sortedRates.length > 0;

  return (
    <div className="container courses-gallery-container">
      <h1>{baseCurrency.toUpperCase()} Exchange Rates Today</h1>
      {date && <p className="update-date">Data as of: {date}</p>}

      {!hasData && (
        <div className="info-message">
          Failed to load exchange rates or no data available.
        </div>
      )}

      {hasData && (
        <div className={`courses-grid ${isAnimationActive ? "loaded" : ""}`}>
          {sortedRates.map(([currencyCode, rate], index) => (
            <div
              key={currencyCode}
              className={`grid-item-animate ${isAnimationActive ? "visible" : ""}`}
              style={{ transitionDelay: `${index * 0.07}s` }}
            >
              <CurrencyCard
                baseCode={baseCurrency}
                targetCode={currencyCode}
                rate={typeof rate === "number" ? rate : 0}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesGalleryPage;
