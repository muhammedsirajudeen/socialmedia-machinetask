"use client"; // Ensures this runs only on the client

import { Provider } from "react-redux";
import { store } from "./store";
import { ReactNode, useEffect } from "react";

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {

  return <Provider store={store}>{children}</Provider>;
}
