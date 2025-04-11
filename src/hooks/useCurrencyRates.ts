import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "../utils/apiClient";

interface FrankfurterLatestResponse {
  amount: number;
  base: string;
  date: string;
  rates: { [currencyCode: string]: number };
}

interface UseCurrencyRatesResult {
  rates: { [key: string]: number } | null;
  date: string | null;
  loading: boolean;
  error: string | null;
}

export function useCurrencyRates(baseCurrency: string): UseCurrencyRatesResult {
  const [rates, setRates] = useState<{ [key: string]: number } | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!baseCurrency) {
      setError("Base currency not specified.");
      setLoading(false);
      setRates(null);
      setDate(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchApi<FrankfurterLatestResponse>("/latest", {
        base: baseCurrency.toUpperCase(),
      });

      if (!data || !data.rates) {
        throw new Error(
          `Invalid data structure in response for ${baseCurrency}`,
        );
      }

      setRates(data.rates);
      setDate(data.date);
    } catch {
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [baseCurrency]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { rates, date, loading, error };
}
