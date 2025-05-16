import React, { useMemo, useState, useEffect, useRef } from "react";
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
  const gridRef = useRef<HTMLDivElement>(null);
  const [isGridRendered, setIsGridRendered] = useState(false);

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
    const gridElement = gridRef.current;
    if (!gridElement) return;

    const animateGridItems = (show: boolean) => {
      setIsGridRendered(show);
    };

    if (filteredAndSortedRates.length > 0) {
      gridElement.style.visibility = "hidden";
      gridElement.style.height = "auto";
      const scrollHeight = gridElement.scrollHeight;
      gridElement.style.height = "0px";
      gridElement.style.visibility = "visible";

      requestAnimationFrame(() => {
        gridElement.style.height = `${scrollHeight}px`;
        gridElement.classList.add("loaded");
        animateGridItems(true);
      });
    } else {
      gridElement.style.height = `${gridElement.scrollHeight}px`;
      requestAnimationFrame(() => {
        gridElement.style.height = "0px";
        gridElement.classList.remove("loaded");
        animateGridItems(false);
      });
    }

    const transitionEndHandler = () => {
      if (
        gridElement.style.height !== "0px" &&
        gridElement.classList.contains("loaded")
      ) {
        gridElement.style.height = "auto";
      }
    };
    gridElement.addEventListener("transitionend", transitionEndHandler);

    return () =>
      gridElement.removeEventListener("transitionend", transitionEndHandler);
  }, [filteredAndSortedRates]);

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

      <div ref={gridRef} className="courses-grid">
        {isGridRendered &&
          filteredAndSortedRates.map(
            ([currencyCode, [fullName, rateValue]], index) => (
              <div
                key={currencyCode}
                className="grid-item-animate"
                style={{
                  transitionDelay: `${index * 0.05}s`,
                }}
                title={fullName}
              >
                <CurrencyCard
                  baseCode={baseCurrency}
                  targetCode={currencyCode}
                  rate={typeof rateValue === "number" ? rateValue : 0}
                />
              </div>
            ),
          )}
      </div>
    </div>
  );
};

export default CoursesGalleryPage;
