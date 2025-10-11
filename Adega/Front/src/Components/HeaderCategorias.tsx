"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function HeaderCategorias() {
  const router = useRouter();

  const categorias = [
    { nome: "Vinhos", rota: "/InterfacePrincipal/Produtos?categoria=vinhos" },
    { nome: "Cervejas Especiais", rota: "/InterfacePrincipal/Produtos?categoria=cervejas" },
    { nome: "Destilados", rota: "/InterfacePrincipal/Produtos?categoria=destilados" },
    { nome: "Aperitivos & Licores", rota: "/InterfacePrincipal/Produtos?categoria=aperitivos" },
    { nome: "Acompanhamentos & Kits", rota: "/InterfacePrincipal/Produtos?categoria=acompanhamentos" },
  ];

  return (
    <div className="w-full bg-rose-900 text-white shadow-md">
      <div className="flex items-center justify-center gap-6 px-6 py-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {categorias.map((cat) => (
          <button
            key={cat.nome}
            onClick={() => router.push(cat.rota)}
            className="cursor-pointer text-sm sm:text-base font-semibold hover:text-yellow-400 transition-colors"
          >
            {cat.nome}
          </button>
        ))}
      </div>
    </div>
  );
}
