"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function HeaderCategorias() {
  const router = useRouter();

  const categorias = [
    { nome: "Vinhos", query: "Vinhos" },
    { nome: "Cervejas", query: "Cervejas" },
    { nome: "Whisky", query: "Whisky" },
    { nome: "Vodkas", query: "Vodkas" },
    { nome: "Energéticos", query: "Energéticos" },
  ];

  return (
    <div className="w-full bg-rose-900 text-white shadow-md">
      <div className="flex items-center justify-center gap-20 px-6 py-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {categorias.map((cat) => (
          <button
            key={cat.nome}
            onClick={() =>
              router.push(
                `/InterfacePrincipal/Produtos/Categoria?categoria=${cat.query}`
              )
            }
            className="cursor-pointer text-sm sm:text-base font-semibold hover:text-yellow-400 transition-colors"
          >
            {cat.nome}
          </button>
        ))}
      </div>
    </div>
  );
}
