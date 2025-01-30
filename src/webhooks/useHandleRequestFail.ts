"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const useHandleRequestFail = () => {
  const router = useRouter();

  const handleRequestFail = useCallback((data: any) => {
    const { code, message } = data;

    if (code === "401") {
      signOut({ redirect: false });
      router.push("/auth/login");
    }

    return message;
  }, [router]);

  return handleRequestFail;
};

export { useHandleRequestFail };
