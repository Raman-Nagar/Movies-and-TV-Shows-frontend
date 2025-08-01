import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/home";
import { Toaster } from "./components/ui/sonner";
import { queryClient } from "./lib/queryClient";
import LoginPage from "./pages/login";
import SignupPage from "./pages/sign-up";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
