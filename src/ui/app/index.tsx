import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { Sidebar } from "../components/sidebar";
import { Pages } from "../pages";

import { queryClient } from "./client";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Sidebar />
      <Pages />
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools position="bottom-right" />
      ) : null}
    </QueryClientProvider>
  );
}
