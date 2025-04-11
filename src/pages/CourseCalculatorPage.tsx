import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCurrencyPairRate } from "../hooks/useCurrencyPairRate";
import { useRateHistory } from "../hooks/useRateHistory";
import CalculatorInputGroup from "../components/CalculatorInputGroup";
import RateHistoryChart from "../components/RateHistoryChart";
import { formatRateDisplay } from "../utils/formatting";
import { HISTORY_DAYS } from "../constants";
import "./CourseCalculatorPage.css";
import LoadingSpinner from "../components/LoadingSpinner.tsx";

const CourseCalculatorPage: React.FC = () => {
  const { from = "eur", to = "usd" } = useParams<{
    from: string;
    to: string;
  }>();
  const navigate = useNavigate();

  const [amountFrom, setAmountFrom] = useState<string>(() => "1");
  const [amountTo, setAmountTo] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<"from" | "to">("from");

  const prevRateRef = useRef<number | null>(null);

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

  const [isRateVisible, setIsRateVisible] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  useEffect(() => {
    if (!currentRateLoading && currentRate !== null) {
      const timer = setTimeout(() => setIsRateVisible(true), 50); // Небольшая задержка
      return () => clearTimeout(timer);
    } else {
      setIsRateVisible(false);
    }
  }, [currentRateLoading, currentRate]);

  useEffect(() => {
    if (!historyLoading && !historyError && historyData?.length > 0) {
      const timer = setTimeout(() => setIsHistoryVisible(true), 50); // Небольшая задержка
      return () => clearTimeout(timer);
    } else {
      setIsHistoryVisible(false);
    }
  }, [historyLoading, historyError, historyData]);

  useEffect(() => {
    if (
      currentRate !== null &&
      (currentRate !== prevRateRef.current || amountTo === "")
    ) {
      if (lastChanged === "from") {
        const numericValue = parseFloat(amountFrom);
        if (!isNaN(numericValue)) {
          setAmountTo(formatRateDisplay(numericValue * currentRate));
        } else {
          setAmountTo("");
        }
      } else {
        const numericValue = parseFloat(amountTo);
        if (currentRate !== 0 && !isNaN(numericValue)) {
          setAmountFrom(formatRateDisplay(numericValue / currentRate));
        } else {
          setAmountFrom("");
        }
      }
    }
    prevRateRef.current = currentRate;
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

  const isLoading = currentRateLoading || historyLoading;

  return (
    <div
      className={`container calculator-container ${isLoading ? "blur-background" : "blur-background-leave"}`}
    >
      {isLoading && <LoadingSpinner size="large" overlay={true} />}
      <Link to="/" className="back-link">
        ← Back to List
      </Link>

      <h1>
        {fromUpper} / {toUpper}
      </h1>

      {currentRateError && !currentRateLoading && (
        <div className="error-message">
          Error loading rate: {currentRateError}
        </div>
      )}
      {currentRate !== null &&
        currentDate &&
        !currentRateLoading &&
        !currentRateError && (
          <div
            className={`fade-in-enter ${isRateVisible ? "fade-in-enter-active" : ""}`}
          >
            <p className="current-rate">
              Current rate (as of {currentDate}):{" "}
              <strong>
                1 {fromUpper} = {formatRateDisplay(currentRate)} {toUpper}
              </strong>
            </p>
          </div>
        )}

      {!currentRateLoading && !currentRateError && currentRate !== null && (
        <div
          className={`calculator fade-in-up-enter ${isRateVisible ? "fade-in-up-enter-active" : ""}`}
        >
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
        <div
          className={`history-content-wrapper ${isHistoryVisible ? "visible" : ""}`}
        >
          {historyError ? (
            <div className="error-message chart-error">
              Error loading history: {historyError}
            </div>
          ) : historyData?.length > 0 ? (
            <div className="chart-container">
              <RateHistoryChart data={historyData} from={from} to={to} />
            </div>
          ) : (
            <div className="info-message chart-info">
              No historical data available to display for {fromUpper}/{toUpper}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCalculatorPage;
