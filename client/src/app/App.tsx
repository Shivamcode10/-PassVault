import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { PasswordProvider } from "./context/PasswordContext";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <AuthProvider>
      <PasswordProvider>
        <RouterProvider router={router} />
        <Toaster />
      </PasswordProvider>
    </AuthProvider>
  );
}