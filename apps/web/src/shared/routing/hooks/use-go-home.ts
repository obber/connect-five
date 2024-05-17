import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { UrlPath } from "@/shared/routing/path";

export const useGoHome = () => {
  const router = useRouter();
  return useCallback(() => {
    router.push(UrlPath.Home);
  }, [router]);
};
