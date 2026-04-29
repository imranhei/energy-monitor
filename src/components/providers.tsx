"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "next-themes";
import { store, persistor } from "@/store/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </ThemeProvider>
    </Provider>
  );
}