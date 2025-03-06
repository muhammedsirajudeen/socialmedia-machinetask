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

  const { data, error, isLoading } = useSWR<T>(`${backendUrl}${url}`, fetcher);

  return {
    data,
    error,
    isLoading,
  };
}
