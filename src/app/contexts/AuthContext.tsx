"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { logOut } from "@/app/action";
import { getUserNameFromCookieStore } from "@/app/action";
interface authContextType {
  userName: string | null;
  setUserName: (username: string | null) => void;
  logOut: () => void;
  // Login: (email: string, password: string) => Promise<boolean>
  // SignUp: (name:string, email:string, password:string) => Promise<boolean>
  // signUpError: string | null
  // logInError: string | null
  // setSignUpError : (error:string | null) => void
  // setLogInError : (error: string | null) => void
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const AuthContext = createContext<authContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserName] = useState<string | null>(null);
  // const [signUpError, setSignUpError] = useState<string | null>(null)
  // const [logInError, setLogInError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getUserName = async () => {
      const savedUsername = await getUserNameFromCookieStore();
      console.log("name", savedUsername);

      if (savedUsername) {
        setUserName(savedUsername);
      }
    };
    getUserName();
  }, []);

  const handleLogOut = async () => {
    await logOut();
    setUserName("");
    console.log("all authentications and user info cleared");
  };

  return (
    <AuthContext.Provider
      value={{
        // SignUp,
        // Login,
        // signUpError,
        // logInError,
        // setSignUpError,
        // setLogInError,
        loading,
        setLoading,
        setUserName,
        userName,
        logOut: handleLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContextHook = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContextHook must be used within an AuthProvider");
  }
  return context;
};
