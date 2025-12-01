"use client";

import { ReactNode, useEffect, useState } from "react";
import { Package, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import LogoutButton from "@/Components/LogoutButton";

interface HeaderProps {
  children: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const router = useRouter();
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("email");

    if (!token) {
      router.push("/Login");
    } else {
      setLogado(true);
    }
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col">
      <header className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-8 cursor-pointer"
              onClick={() => router.push("/InterfacePrincipal")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-700 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">StockFlow</h1>
                  <p className="text-xs text-gray-500 -mt-1">
                    Gestão de Estoque
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/InterfacePrincipal/Produtos")}
                className="px-4 py-1.5 text-rose-700 text-md rounded-md hover:bg-rose-100 transition-colors font-bold"
              >
                Produtos
              </button>

              <button
                onClick={() =>
                  router.push("/InterfacePrincipal/GerenciarProdutos")
                }
                className="px-4 py-1.5 text-rose-700 text-md rounded-md hover:bg-rose-100 transition-colors font-bold"
              >
                Gerenciar
              </button>

              <button
                onClick={() => router.push("/InterfacePrincipal/Pedidos")}
                className="px-4 py-1.5 text-rose-700 text-md rounded-md hover:bg-rose-100 transition-colors font-bold"
              >
                Pedidos
              </button>
              <button
                onClick={() => router.push("/InterfacePrincipal/Carrinho")}
                className="px-4 py-1.5 text-rose-700 text-md rounded-md hover:bg-rose-100 transition-colors cursor-pointer font-bold"
              >
                Carrinho
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-amber-600"
                onClick={() => router.push("/InterfacePrincipal/Usuarios")}
              >
                <Users className="w-4 h-4" />
                <span className="text-sm">Bem-vindo(a)</span>
              </div>

              {!logado ? (
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                    onClick={() => router.push("/Login")}
                  >
                    Login
                  </button>

                  <button
                    className="px-3 py-1.5 bg-rose-600 text-white text-sm rounded-md hover:bg-rose-700 transition-colors cursor-pointer"
                    onClick={() => router.push("/")}
                  >
                    Cadastrar
                  </button>
                </div>
              ) : (
                <LogoutButton onLogout={() => setLogado(false)} />
              )}
            </div>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
