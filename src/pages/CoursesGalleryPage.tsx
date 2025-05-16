import React, { useMemo, useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { useLoaderData } from "react-router-dom";
import CurrencyCard from "../components/CurrencyCard";
import type { GalleryLoaderData } from "../loaders";
import "./CoursesGalleryPage.css";

type SortOption = "code_asc" | "code_desc" | "rate_asc" | "rate_desc";

const CoursesGalleryPage: React.FC = () => {
  const loaderData = useLoaderData() as GalleryLoaderData;
  const { rates, date, baseCurrency } = loaderData;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("code_asc");
  const [displayedRates, setDisplayedRates] = useState<
    [string, [string, number]][]
  >([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const filteredAndSortedRates = useMemo(() => {
    if (!rates) return [];

    let items = Object.entries(rates);

    if (searchTerm) {
      items = items.filter(
        ([code, [fullName]]) =>
          code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fullName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    items.sort(([codeA, [, rateA]], [codeB, [, rateB]]) => {
      switch (sortOption) {
        case "code_desc":
          return codeB.localeCompare(codeA);
        case "rate_asc":
          return (rateA as number) - (rateB as number);
        case "rate_desc":
          return (rateB as number) - (rateA as number);
        case "code_asc":
        default:
          return codeA.localeCompare(codeB);
      }
    });

    return items;
  }, [rates, searchTerm, sortOption]);

  useEffect(() => {
    if (isInitialLoad) {
      setDisplayedRates(filteredAndSortedRates);
      setIsInitialLoad(false);
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        setDisplayedRates(filteredAndSortedRates);
      });
    });
  }, [filteredAndSortedRates, isInitialLoad]);

  const renderInfoMessage = () => {
    if (!rates) {
      return "Failed to load exchange rates or no data available.";
    }
    if (filteredAndSortedRates.length === 0) {
      return searchTerm
        ? `No currencies match your search for "${searchTerm}".`
        : `No exchange rates are currently available for ${baseCurrency.toUpperCase()}.`;
    }
    return null;
  };

  const infoMessage = renderInfoMessage();

  return (
    <div className="container courses-gallery-container">
      <h1>{baseCurrency.toUpperCase()} Exchange Rates Today</h1>
      {date && <p className="update-date">Data as of: {date}</p>}

      <div className="controls-container">
        <input
          type="text"
          placeholder="Search by currency code or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Search exchange rates by currency code or name"
        />
        <select
          id="sort-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          className="sort-select"
          aria-label="Sort exchange rates"
        >
          <option value="code_asc">Code (A-Z)</option>
          <option value="code_desc">Code (Z-A)</option>
          <option value="rate_asc">Rate (Low to High)</option>
          <option value="rate_desc">Rate (High to Low)</option>
        </select>
      </div>

      {infoMessage && <div className="info-message">{infoMessage}</div>}

      <div className="courses-grid">
        {displayedRates.map(([currencyCode, [fullName, rateValue]]) => (
          <div
            key={currencyCode}
            className="grid-item-vt-container"
            style={{ viewTransitionName: `currency-${currencyCode}` }}
            title={fullName}
          >
            <CurrencyCard
              baseCode={baseCurrency}
              targetCode={currencyCode}
              rate={rateValue}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesGalleryPage;
