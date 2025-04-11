import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "../utils/apiClient";
import { formatDateForApi } from "../utils/formatting";
import { HISTORY_DAYS } from "../constants";

interface FrankfurterTimeseriesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: { [date: string]: { [currencyCode: string]: number } };
}

export interface HistoryDataPoint {
  date: string;
  rate: number;
}

interface UseRateHistoryResult {
  historyData: HistoryDataPoint[];
  loading: boolean;
  error: string | null;
}

export function useRateHistory(
  baseCurrency?: string,
  targetCurrency?: string,
  days: number = HISTORY_DAYS,
): UseRateHistoryResult {
  const [historyData, setHistoryData] = useState<HistoryDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!baseCurrency || !targetCurrency) {
      setError("Base or target currency not specified for history.");
      setLoading(false);
      setHistoryData([]);
      return;
    }

    setLoading(true);
    setError(null);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const startDateStr = formatDateForApi(startDate);

    const baseUpper = baseCurrency.toUpperCase();
    const targetUpper = targetCurrency.toUpperCase();
    const endpoint = `/${startDateStr}..`;

    try {
      const data = await fetchApi<FrankfurterTimeseriesResponse>(endpoint, {
        base: baseUpper,
        symbols: targetUpper,
      });

      if (!data || !data.rates || Object.keys(data.rates).length === 0) {
        setHistoryData([]);
        return;
      }

      const historyPoints: HistoryDataPoint[] = Object.entries(data.rates)
        .map(([dateStr, rateObj]) => {
          const rateValue = rateObj?.[targetUpper];
          return rateValue !== undefined && rateValue !== null
            ? { date: dateStr, rate: rateValue }
            : null;
        })
        .filter((point): point is HistoryDataPoint => point !== null)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

      setHistoryData(historyPoints);
    } catch {
      setError("Failed to load history data. Please try again later.");
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  }, [baseCurrency, targetCurrency, days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { historyData, loading, error };
}
