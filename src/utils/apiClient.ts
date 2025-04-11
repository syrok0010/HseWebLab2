import { API_BASE_URL } from "../constants";

/**
 * Упрощенный fetch wrapper для Frankfurter API.
 * Обрабатывает базовый URL, проверку статуса ответа и парсинг JSON.
 * @param endpoint - API эндпоинт (напр., '/latest')
 * @param params - URL query параметры
 * @param options - Дополнительные опции fetch
 * @returns Promise<T> - Распарсенный JSON ответ
 */
export async function fetchApi<T>(
  endpoint: string,
  params?: Record<string, string | number | undefined>,
  options?: RequestInit,
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  try {
    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`API Fetch Error (${endpoint}):`, error);
    throw error instanceof Error
      ? error
      : new Error("An unknown network or API error occurred.");
  }
}
