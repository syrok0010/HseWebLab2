import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useCurrencyPairRate } from "../hooks/useCurrencyPairRate";
import { useRateHistory } from "../hooks/useRateHistory";
import CalculatorInputGroup from "../components/CalculatorInputGroup";
import RateHistoryChart from "../components/RateHistoryChart";
import { formatRateDisplay } from "../utils/formatting"; // Import formatter
import { HISTORY_DAYS } from "../constants"; // Import constants if needed
import "./CourseCalculatorPage.css";

const CourseCalculatorPage: React.FC = () => {
  const { from = "eur", to = "usd" } = useParams<{
    from: string;
    to: string;
  }>();

  const [amountFrom, setAmountFrom] = useState<string>("1");
  const [amountTo, setAmountTo] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<"from" | "to">("from");

  const {
    rate: currentRate,
    date: currentDate,
    loading: currentRateLoading,
    error: currentRateError,
  } = useCurrencyPairRate(from, to);

  const {
    historyData,
    loading: historyLoading,
    error: historyError,
  } = useRateHistory(from, to, HISTORY_DAYS);

  const fromUpper = useMemo(() => from.toUpperCase(), [from]);
  const toUpper = useMemo(() => to.toUpperCase(), [to]);

  useEffect(() => {
    if (currentRate !== null && lastChanged === "from") {
      const fromValue = parseFloat(amountFrom);
      if (!isNaN(fromValue)) {
        setAmountTo(formatRateDisplay(fromValue * currentRate));
      } else {
        setAmountTo("");
      }
    } else if (currentRate !== null && lastChanged === "to") {
      const toValue = parseFloat(amountTo);
      if (!isNaN(toValue) && currentRate !== 0) {
        setAmountFrom(formatRateDisplay(toValue / currentRate));
      } else {
        setAmountFrom("");
      }
    }
  }, [currentRate, amountFrom, amountTo, lastChanged]);

  const handleAmountFromChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAmountFrom(value);
      setLastChanged("from");

      const numericValue = parseFloat(value);
      if (currentRate !== null && !isNaN(numericValue)) {
        setAmountTo(formatRateDisplay(numericValue * currentRate));
      } else {
        setAmountTo("");
      }
    },
    [currentRate],
  );

  const handleAmountToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAmountTo(value);
      setLastChanged("to");

      const numericValue = parseFloat(value);
      if (currentRate !== null && currentRate !== 0 && !isNaN(numericValue)) {
        setAmountFrom(formatRateDisplay(numericValue / currentRate));
      } else {
        setAmountFrom("");
      }
    },
    [currentRate],
  );

  return (
    <div className="container calculator-container">
      <Link to="/" className="back-link">
        ← Back to List
      </Link>

      <h1>
        {fromUpper} / {toUpper}
      </h1>

      {/* Current Rate Section */}
      {currentRateLoading && (
        <div className="loading-message">Loading current rate...</div>
      )}
      {currentRateError && !currentRateLoading && (
        <div className="error-message">
          Error loading rate: {currentRateError}
        </div>
      )}
      {currentRate !== null &&
        currentDate &&
        !currentRateLoading &&
        !currentRateError && (
          <p className="current-rate">
            Current rate (as of {currentDate}):{" "}
            <strong>
              1 {fromUpper} = {formatRateDisplay(currentRate)} {toUpper}
            </strong>
          </p>
        )}

      {/* Calculator Section - Show only if rate is loaded successfully */}
      {!currentRateLoading && !currentRateError && currentRate !== null && (
        <div className="calculator">
          <CalculatorInputGroup
            id="fromAmount"
            label={fromUpper}
            value={amountFrom}
            onChange={handleAmountFromChange}
          />
          <div className="swap-icon" aria-hidden="true">
            <span>⇄</span>{" "}
          </div>
          <CalculatorInputGroup
            id="toAmount"
            label={toUpper}
            value={amountTo}
            onChange={handleAmountToChange}
          />
        </div>
      )}

      {/* History Section */}
      <div className="history-section">
        <h2>Rate History (Last {HISTORY_DAYS} Days)</h2>
        <RateHistoryChart
          data={historyData}
          from={from}
          to={to}
          loading={historyLoading}
          error={historyError}
        />
      </div>
    </div>
  );
};

export default CourseCalculatorPage;
