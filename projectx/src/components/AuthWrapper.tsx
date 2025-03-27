"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "./LoadingScreen";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/bemVindo");
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingScreen message="Carregando..." />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
