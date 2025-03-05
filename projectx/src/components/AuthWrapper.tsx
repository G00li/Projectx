"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/pages/BemVindo");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>AuthWrapper.tsx- linha-80...</p>;
  }

  return <>{children}</>;
};

export default AuthWrapper;
