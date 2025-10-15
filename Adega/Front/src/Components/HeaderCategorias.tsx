"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Produto {
  id: number;
  nome: string;
  preco: string;
  imagem: string;
}

export default function HeaderCategorias() {
  const router = useRouter();

  const categorias = [
    { nome: "Vinhos", query: "Vinhos" },
    { nome: "Cervejas", query: "Cervejas" },
    { nome: "Whisky", query: "Whisky" },
    { nome: "Vodkas", query: "Vodkas" },
    { nome: "Energéticos", query: "Energéticos" },
  ];

  const [hoveredCategoria, setHoveredCategoria] = useState<string | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProdutos = async (categoria: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/products?categoria=${categoria}`
      );
      const data = await res.json();
      console.log("Produtos recebidos:", data);
      setProdutos(data.slice(0, 4));
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hoveredCategoria) fetchProdutos(hoveredCategoria);
  }, [hoveredCategoria]);

  return (
    <div className="relative w-full bg-rose-900 text-white shadow-md z-50">
      {/* ⚠️ overflow-visible é ESSENCIAL para o dropdown não ser cortado */}
      <div className="flex items-center justify-center gap-20 px-6 py-3 overflow-visible whitespace-nowrap">
        {categorias.map((cat) => (
          <div
            key={cat.nome}
            className="relative"
            onMouseEnter={() => setHoveredCategoria(cat.query)}
            onMouseLeave={() => setHoveredCategoria(null)}
          >
            <button
              onClick={() =>
                router.push(
                  `/InterfacePrincipal/Produtos/Categoria?categoria=${cat.query}`
                )
              }
              className="cursor-pointer text-sm sm:text-base font-semibold hover:text-yellow-400 transition-colors"
            >
              {cat.nome}
            </button>

            {/* Dropdown ao passar o mouse */}
            {hoveredCategoria === cat.query && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white text-black shadow-lg rounded-md p-4 w-[35rem] max-w-[90vw] z-50">
                {loading ? (
                  <p className="text-center text-sm text-gray-500">
                    Carregando produtos...
                  </p>
                ) : produtos.length > 0 ? (
                  <div className="flex flex-row gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
                    {produtos.map((p) => (
                      <div
                        key={p.id}
                        onClick={() =>
                          router.push(
                            `/InterfacePrincipal/Produtos/Detalhes/${p.id}`
                          )
                        }
                        className="flex flex-col items-center justify-start text-center bg-white border border-gray-200 rounded-lg p-3 min-w-[120px] hover:bg-gray-100 cursor-pointer shadow-sm"
                      >
                        <img
                          src={p.imagem}
                          alt={p.nome}
                          className="w-20 h-20 rounded-md object-cover mb-2"
                        />
                        <p className="text-sm font-semibold text-gray-800">
                          {p.nome}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          R$ {p.preco}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    Nenhum produto encontrado
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}