import useSWR from "swr";
import { backendUrl } from "./axios.instance";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

export function useFetch<T>(url: string) {
  const { data, error, isLoading, mutate } = useSWR<T>(`${backendUrl}${url}`, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 0, // Disable automatic revalidation
    dedupingInterval: 0, // Disable deduplication to always fetch new data
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}