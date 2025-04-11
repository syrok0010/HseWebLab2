import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate, useLoaderData } from "react-router-dom";
import CalculatorInputGroup from "../components/CalculatorInputGroup";
import RateHistoryChart from "../components/RateHistoryChart";
import { formatRateDisplay } from "../utils/formatting";
import { HISTORY_DAYS } from "../constants";
import type { CalculatorLoaderData } from "../loaders";
import "./CourseCalculatorPage.css";

const CourseCalculatorPage: React.FC = () => {
  const loaderData = useLoaderData() as CalculatorLoaderData;
  const { rateData, historyData, params } = loaderData;
  const { rate: currentRate, date: currentDate } = rateData;
  const { history: historyDataPoints } = historyData;
  const { from = "eur", to = "usd" } = params;

  const navigate = useNavigate();

  const [amountFrom, setAmountFrom] = useState<string>(() => "1");
  const [amountTo, setAmountTo] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<"from" | "to">("from");

  const fromUpper = useMemo(() => from.toUpperCase(), [from]);
  const toUpper = useMemo(() => to.toUpperCase(), [to]);

  useEffect(() => {
    if (currentRate === null) {
      setAmountTo("");
      if (lastChanged === "to") setAmountFrom("");
      return;
    }

    if (lastChanged === "from") {
      const numericValue = parseFloat(amountFrom);
      if (!isNaN(numericValue))
        setAmountTo(formatRateDisplay(numericValue * currentRate));
      else setAmountTo("");
    } else {
      const numericValue = parseFloat(amountTo);
      if (currentRate !== 0 && !isNaN(numericValue))
        setAmountFrom(formatRateDisplay(numericValue / currentRate));
      else if (amountFrom !== "") setAmountFrom("");
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

  const handleSwapCurrencies = useCallback(() => {
    navigate(`/${to}/${from}`);
  }, [from, to, navigate]);

  return (
    <div className="container calculator-container">
      <Link to="/" className="back-link">
        ← Back to List
      </Link>

      <h1>
        {fromUpper} / {toUpper}
      </h1>

      {!currentRate && (
        <div className="error-message">Failed to load current rate.</div>
      )}

      {currentRate !== null && currentDate && (
        <p className="current-rate">
          Current rate (as of {currentDate}):{" "}
          <strong>
            1 {fromUpper} = {formatRateDisplay(currentRate)} {toUpper}
          </strong>
        </p>
      )}

      {currentRate !== null && (
        <div className="calculator">
          <CalculatorInputGroup
            id="fromAmount"
            label={fromUpper}
            value={amountFrom}
            onChange={handleAmountFromChange}
          />
          <button
            className="swap-icon"
            onClick={handleSwapCurrencies}
            title={`Swap ${fromUpper} and ${toUpper}`}
            aria-label={`Swap currencies ${fromUpper} and ${toUpper}`}
          >
            <span>⇄</span>
          </button>
          <CalculatorInputGroup
            id="toAmount"
            label={toUpper}
            value={amountTo}
            onChange={handleAmountToChange}
          />
        </div>
      )}

      <div className="history-section">
        <h2>Rate History (Last {HISTORY_DAYS} Days)</h2>
        {!historyDataPoints && (
          <div className="error-message chart-error">
            Failed to load history.
          </div>
        )}

        {historyDataPoints && historyDataPoints.length > 0 ? (
          <div className="chart-container">
            <RateHistoryChart data={historyDataPoints} from={from} to={to} />
          </div>
        ) : (
          !historyDataPoints && (
            <div className="info-message chart-info">
              No historical data available to display for {fromUpper}/{toUpper}.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CourseCalculatorPage;
