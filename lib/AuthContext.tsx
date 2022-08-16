import { SupabaseClient, User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

type State = {
  isLoading: boolean;
  user: User | null;
};

const AuthContext = React.createContext<State>({ isLoading: true, user: null });

type Props = {
  children: React.ReactNode;
  client: SupabaseClient;
};

const AuthProvider: React.FC<Props> = ({ children, client }) => {
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    client.auth.getSession().then((session) => {
      setLoading(false);
      setUser(session.data.session?.user ?? null);
    });

    client.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
  }, [client.auth]);

  return (
    <AuthContext.Provider value={{ isLoading, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useUser() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(`useUser must be used within an AuthContext`);
  }

  return context;
}

export function useRequiredUser() {
  const router = useRouter();
  const { isLoading, user } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/login`);
    }
  }, [router, isLoading, user]);

  return { isLoading, user };
}

export function useGuaranteedUser() {
  const { user } = useUser();

  if (!user) {
    throw new Error(`expected user to be defined`);
  }

  return user;
}

export default AuthProvider;
