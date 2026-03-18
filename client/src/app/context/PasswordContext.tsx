import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import * as api from "../services/api";
import { useAuth } from "./AuthContext";
import { toast } from 'sonner';

export interface Password {
  _id: string;
  website: string;  
  username: string;
  password: string;
  category: string;
  notes?: string;
  createdAt: string;
}

export interface NewPasswordData {
  website: string;
  username: string;
  password: string;
  category: string;
  notes?: string;
}

interface PasswordContextType {
  passwords: Password[];
  fetchPasswords: () => Promise<void>;
  addPassword: (data: NewPasswordData) => Promise<void>;
  deletePassword: (id: string) => Promise<void>;
  updatePassword: (id: string, data: Partial<Password>) => Promise<void>; // ✅ ADDED
  getPassword: (id: string) => Password | undefined;
}

const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

export function PasswordProvider({ children }: { children: ReactNode }) {

  const [passwords, setPasswords] = useState<Password[]>([]);
  const { isAuthenticated } = useAuth();

  const fetchPasswords = async () => {
    try {
      const res = await api.getPasswords();

      const passwordsArray = Array.isArray(res.data)
        ? res.data
        : res.data.passwords;

      setPasswords(passwordsArray || []);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        console.log("User not authenticated yet");
      } else {
        console.error("Error fetching passwords:", error);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPasswords();
    }
  }, [isAuthenticated]);

  const addPassword = async (data: NewPasswordData) => {
    try {
      const res = await api.createPassword(data);
      const newPassword = res.data.password;

      setPasswords((prev) => [...prev, newPassword]);

      toast.success("Password added successfully");
    } catch (error: any) {
      console.error("Error adding password:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add password");
      }

      throw error;
    }
  };

  const deletePassword = async (id: string) => {
    try {
      await api.deletePassword(id);

      setPasswords((prev) =>
        prev.filter((p) => p._id !== id)
      );

      toast.success("Password deleted");
    } catch (error: any) {
      console.error("Error deleting password:", error);
      toast.error("Failed to delete password");
    }
  };

  // ✅ NEW: UPDATE FUNCTION
  const updatePassword = async (id: string, data: Partial<Password>) => {
    try {
      const res = await api.updatePassword(id, data);

      const updatedPassword = res.data.password;

      setPasswords((prev) =>
        prev.map((p) =>
          p._id === id ? updatedPassword : p
        )
      );

      toast.success("Password updated successfully");
    } catch (error: any) {
      console.error("Error updating password:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update password");
      }

      throw error;
    }
  };

  const getPassword = (id: string) => {
    return passwords.find((p) => p._id === id);
  };

  return (
    <PasswordContext.Provider
      value={{
        passwords,
        fetchPasswords,
        addPassword,
        deletePassword,
        updatePassword, // ✅ INCLUDED
        getPassword,
      }}
    >
      {children}
    </PasswordContext.Provider>
  );
}

export function usePasswords() {
  const context = useContext(PasswordContext);

  if (!context) {
    throw new Error("usePasswords must be used within PasswordProvider");
  }

  return context;
}