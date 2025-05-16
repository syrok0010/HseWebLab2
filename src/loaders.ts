import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { fetchApi } from "./utils/apiClient";
import { DEFAULT_GALLERY_BASE_CURRENCY, HISTORY_DAYS } from "./constants";
import { formatDateForApi } from "./utils/formatting";

interface RateData {
  rate: number | null;
  date: string | null;
}

export interface HistoryDataPoint {
  date: string;
  rate: number;
}

interface HistoryData {
  history: HistoryDataPoint[] | null; // Используем импортированный тип
}

export interface CalculatorLoaderData {
  rateData: RateData;
  historyData: HistoryData;
  params: { from: string; to: string };
}

interface FrankfurterLatestResponse {
  amount: number;
  base: string;
  date: string;
  rates: { [currencyCode: string]: number };
}

interface FrankfurterTimeseriesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: {
    [date: string]: {
      [currencyCode: string]: number;
    };
  };
}

export interface CurrenciesResponse {
  [currencyCode: string]: string;
}

export interface GalleryLoaderData {
  rates: { [key: string]: [string, number] } | null;
  date: string | null;
  baseCurrency: string;
}

export async function calculatorLoader({
  params,
}: LoaderFunctionArgs): Promise<CalculatorLoaderData> {
  const { from, to } = params;

  if (!from || !to || from === to) {
    console.error("Invalid currency parameters:", params);
    throw redirect("/");
  }

  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();

  const ratePromise = fetchApi<FrankfurterLatestResponse>("/latest", {
    base: fromUpper,
    symbols: toUpper,
  }).catch(() => null);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - HISTORY_DAYS);
  const historyEndpoint = `/${formatDateForApi(startDate)}..`;

  const historyPromise = fetchApi<FrankfurterTimeseriesResponse>(
    historyEndpoint,
    {
      base: fromUpper,
      symbols: toUpper,
    },
  ).catch(() => null);

  const [rateApiResponse, historyApiResponse] = await Promise.all([
    ratePromise,
    historyPromise,
  ]);

  let rateDataResult: RateData = { rate: null, date: null };
  if (rateApiResponse) {
    const specificRate = rateApiResponse.rates?.[toUpper];
    if (specificRate !== undefined && specificRate !== null) {
      rateDataResult = { rate: specificRate, date: rateApiResponse.date };
    }
  }

  let historyDataResult: HistoryData = { history: null };
  if (historyApiResponse) {
    if (
      historyApiResponse.rates &&
      Object.keys(historyApiResponse.rates).length > 0
    ) {
      const historyPoints: HistoryDataPoint[] = Object.entries(
        historyApiResponse.rates,
      )
        .map(([dateStr, rateObj]: [string, { [key: string]: number }]) => {
          const rateValue = rateObj?.[toUpper];
          return rateValue !== undefined && rateValue !== null
            ? { date: dateStr, rate: rateValue }
            : null;
        })
        .filter((point): point is HistoryDataPoint => point !== null)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

      if (historyPoints.length > 0) {
        historyDataResult = { history: historyPoints };
      }
    }
  }

  return {
    rateData: rateDataResult,
    historyData: historyDataResult,
    params: { from, to },
  };
}

function createGalleryLoaderData(
    latestApiResponse: FrankfurterLatestResponse | null,
    currenciesApiResponse: CurrenciesResponse | null,
): GalleryLoaderData {
  if (
      !latestApiResponse ||
      !latestApiResponse.rates ||
      !currenciesApiResponse
  ) {
    return {
      rates: null,
      date: latestApiResponse?.date || null,
      baseCurrency: latestApiResponse?.base || DEFAULT_GALLERY_BASE_CURRENCY,
    };
  }

  const transformedRates: { [key: string]: [string, number] } = {};

  for (const currencyCode in latestApiResponse.rates) {
    if (Object.prototype.hasOwnProperty.call(latestApiResponse.rates, currencyCode)) {
      transformedRates[currencyCode] = [currenciesApiResponse[currencyCode], latestApiResponse.rates[currencyCode]];
    }
  }

  return {
    rates: Object.keys(transformedRates).length > 0 ? transformedRates : null,
    date: latestApiResponse.date,
    baseCurrency: latestApiResponse.base,
  };
}

export async function galleryLoader(): Promise<GalleryLoaderData> {
  const base = DEFAULT_GALLERY_BASE_CURRENCY;
  try {
    const [latestData, currenciesData] = await Promise.all([
      fetchApi<FrankfurterLatestResponse>("/latest", { base }).catch(() => null),
      fetchApi<CurrenciesResponse>("/currencies").catch(() => null)
    ]);

    return createGalleryLoaderData(latestData, currenciesData);
  } catch {
    return { rates: null, date: null, baseCurrency: base };
  }
}
