"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "next-themes";
import { store, persistor } from "@/store/store";
import QueryProvider from "@/components/providers/query-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <PersistGate loading={null} persistor={persistor}>
          <QueryProvider>{children}</QueryProvider>
        </PersistGate>
      </ThemeProvider>
    </Provider>
  );
}