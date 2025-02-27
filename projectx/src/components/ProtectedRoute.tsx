"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/pages/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p className="text-white text-center mt-20">Carregando...</p>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
