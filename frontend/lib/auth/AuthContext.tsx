'use client';

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  ReactNode
} from 'react';

export type ActiveSubscription = {
  id: string;
  isActive: boolean;
  remainingSessions?: number;
  subscriptionType?: string;
  includesSpecializedCourses?: boolean;
  expiresAt?: string;
};

export type AuthUser = {
  clientId: string;
  fullName: string;
  email: string;
  hasActiveSubscription?: boolean;
  remainingSessions?: number;
  subscriptionType?: string;
  hasUsedFreeTrial?: boolean;
  hasSpecializedAccess?: boolean;
  activeSubscriptions?: ActiveSubscription[];
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

const TOKEN_KEY = 'nova_token';
const USER_KEY = 'nova_user';

type Props = {
  children: ReactNode;
};

type MeApiResponse = {
  id: string;
  fullName: string;
  email: string;
  subscriptionType?: string;
  hasSpecializedAccess?: boolean;
  hasActiveSubscription?: boolean;
  remainingSessions?: number;
  hasUsedFreeTrial?: boolean;
  activeSubscriptions?: ActiveSubscription[];
};

function mapMeToAuthUser(me: MeApiResponse): AuthUser {
  return {
    clientId: me.id,
    fullName: me.fullName,
    email: me.email,
    subscriptionType: me.subscriptionType,
    hasSpecializedAccess: me.hasSpecializedAccess,
    hasActiveSubscription: me.hasActiveSubscription,
    remainingSessions: me.remainingSessions,
    hasUsedFreeTrial: me.hasUsedFreeTrial,
    activeSubscriptions: me.activeSubscriptions
  };
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = async () => {
    const storedToken =
      typeof window !== 'undefined'
        ? localStorage.getItem(TOKEN_KEY)
        : null;

    if (!storedToken) {
      setUser(null);
      setToken(null);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error('NEXT_PUBLIC_API_URL est manquante.');
      }

      const response = await fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
        return;
      }

      const me: MeApiResponse = await response.json();
      const mappedUser = mapMeToAuthUser(me);

      localStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
      setToken(storedToken);
      setUser(mappedUser);
    } catch (error) {
      console.error('Erreur lors du chargement du profil', error);
      setUser(null);
      setToken(storedToken);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedToken =
          typeof window !== 'undefined'
            ? localStorage.getItem(TOKEN_KEY)
            : null;

        if (!storedToken) {
          setLoading(false);
          return;
        }

        setToken(storedToken);

        const storedUser =
          typeof window !== 'undefined'
            ? localStorage.getItem(USER_KEY)
            : null;

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser) as AuthUser);
          } catch {
            localStorage.removeItem(USER_KEY);
          }
        }

        await refreshMe();
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (newToken: string, newUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    await refreshMe();
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    window.location.href = '/';
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      login,
      logout,
      refreshMe
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}