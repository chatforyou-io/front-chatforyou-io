"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

const useHandleRequestFail = () => {
  const router = useRouter();

  const handleRequestFail = useCallback((data: any) => {
    const { code, message } = data;

    if (code === "401") {
      router.push("/auth/login");
    }

    return message;
  }, [router]);

  return handleRequestFail;
};

export { useHandleRequestFail };
