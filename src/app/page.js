"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard"); // redirect to dashboard
  }, [router]);

  return null; // nothing shown while redirecting
}
