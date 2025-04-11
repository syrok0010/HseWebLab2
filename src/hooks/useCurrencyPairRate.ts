import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "../utils/apiClient";

interface FrankfurterLatestResponse {
  amount: number;
  base: string;
  date: string;
  rates: { [currencyCode: string]: number };
}

interface UseCurrencyPairRateResult {
  rate: number | null;
  date: string | null;
  loading: boolean;
  error: string | null;
}

export function useCurrencyPairRate(
  baseCurrency?: string,
  targetCurrency?: string,
): UseCurrencyPairRateResult {
  const [rate, setRate] = useState<number | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!baseCurrency || !targetCurrency) {
      setError("Base or target currency not specified.");
      setLoading(false);
      setRate(null);
      setDate(null);
      return;
    }

    setLoading(true);
    setError(null);

    const baseUpper = baseCurrency.toUpperCase();
    const targetUpper = targetCurrency.toUpperCase();

    try {
      const data = await fetchApi<FrankfurterLatestResponse>("/latest", {
        base: baseUpper,
        symbols: targetUpper,
      });

      const specificRate = data?.rates?.[targetUpper];

      if (specificRate === undefined || specificRate === null) {
        throw new Error(
          `Rate for ${targetUpper} not found for base ${baseUpper}.`,
        );
      }

      setRate(specificRate);
      setDate(data.date);
    } catch {
      setError("Failed to load rate data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [baseCurrency, targetCurrency]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { rate, date, loading, error };
}
