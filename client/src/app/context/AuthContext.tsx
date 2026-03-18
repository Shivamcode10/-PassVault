import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import * as api from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<any>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  completeLogin: (token: string, user: User) => void; // ✅ NEW
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const AUTO_LOGOUT_TIME = 10 * 60 * 1000;

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (user) {
      timerRef.current = setTimeout(() => {
        logout();
        alert("Session expired (Auto Lock)");
      }, AUTO_LOGOUT_TIME);
    }
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click"];

    const activityHandler = () => resetTimer();

    events.forEach((event) =>
      window.addEventListener(event, activityHandler)
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, activityHandler)
      );
    };
  }, [user]);

  // 🔐 LOGIN
  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);

    if (res.data.requires2FA) {
      return res.data;
    }

    const { token, user } = res.data;

    completeLogin(token, user); // ✅ FIXED
  };

  // 🔐 COMPLETE LOGIN (FOR OTP ALSO)
  const completeLogin = (token: string, user: User) => {
    api.setAuthToken(token);
    setUser(user);
    resetTimer();
  };

  // 🔐 SIGNUP
  const signup = async (name: string, email: string, password: string) => {
    const res = await api.signup(name, email, password);
    const { token, user } = res.data;

    completeLogin(token, user);
  };

  // 🔐 LOGOUT
  const logout = () => {
    api.setAuthToken(null);
    setUser(null);

    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        completeLogin, // ✅ NEW
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}