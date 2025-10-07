"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Lending() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main page since lending is now at root
    router.replace("/");
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h2>Redirecting to main page...</h2>
      <p>The lending interface is now available at the main page.</p>
    </div>
  );
}
