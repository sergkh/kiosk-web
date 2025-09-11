import { Navigate } from "react-router";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  email?: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

async function getUserProfile(setUser: (u: User | null) => void, setLoading: (loading: boolean) => void) {
  try {
    const result = await fetch("/api/user")
    if (result.ok) {
      setUser(await result.json() as User);
      setLoading(false);
    } else {
      setUser(null);
      setLoading(false);
    }
  } catch (error) {
    console.error("Failed to fetch user profile", error);
    setUser(null);
    setLoading(false);
  }
}

export function AuthorizedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile(setUser, setLoading);
  }, []);

  if (loading) return <div>Loading...</div>;

  return user ? (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  ) : <Navigate to="/admin/login" replace />;
}