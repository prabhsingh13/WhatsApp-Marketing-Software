import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation"; // Use "next/navigation" for App Router, or "next/router" for Pages Router

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/"); // Redirect to login if not logged in
      }
    });

    return () => unsubscribe();
  }, [router]);
};

export default useAuth;
