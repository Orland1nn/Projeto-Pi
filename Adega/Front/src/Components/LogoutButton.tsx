"use client";

import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  onLogout: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("email");
    onLogout();
    router.push("/Login");
  }

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors cursor-pointer"
    >
      Logout
    </button>
  );
}
