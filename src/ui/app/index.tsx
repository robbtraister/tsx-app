import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { Sidebar } from "../components/sidebar";
import { Pages } from "../pages";

import { queryClient } from "./client";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Sidebar />
        <Pages />
      </BrowserRouter>
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  );
}