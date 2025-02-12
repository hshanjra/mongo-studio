import { QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import AppRoutes from "./routes";
import { ThemeProvider } from "./components/theme-provider";
import { queryClient } from "./lib/query-client";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout>
            <AppRoutes />
          </Layout>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
