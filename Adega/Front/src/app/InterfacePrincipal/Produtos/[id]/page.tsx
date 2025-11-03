"use client";

import Header from "@/Components/Header";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const MAX_QUANTIDADE_DISPONIVEL = 999;

interface Produto {
  id: number;
  nome: string;
  preco: string;
  imagem: string;
  quantidade: number;
}

export default function PaginaProduto() {
  const searchParams = useSearchParams();
  const nomeProduto = searchParams.get("nome");

  const [produto, setProduto] = useState<Produto | null>(null);
  const [quantidadeAdicionar, setQuantidadeAdicionar] = useState(0);
  const [quantidadeRemover, setQuantidadeRemover] = useState(0);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!nomeProduto) return;

    const fetchProduto = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/products/nome/${encodeURIComponent(
            nomeProduto
          )}`
        );
        if (!response.ok) throw new Error("Erro ao buscar produto");
        const data = await response.json();
        setProduto(data);
      } catch (error) {
        console.error(error);
        alert("❌ Erro ao buscar dados do produto");
      }
    };

    fetchProduto();
  }, [nomeProduto]);

  if (!produto) {
    return (
      <Header>
        <div className="flex flex-1 items-center justify-center text-gray-600">
          Carregando produto...
        </div>
      </Header>
    );
  }

  const handleConfirmarAdicionar = async () => {
    if (quantidadeAdicionar <= 0) return;
    setCarregando(true);
    try {
      const response = await fetch("http://localhost:3000/products/aumentar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: produto.id,
          quantidade: quantidadeAdicionar,
        }),
      });
      if (!response.ok) throw new Error("Erro ao adicionar quantidade");

      const data = await response.json();
      setProduto((prev) => prev && { ...prev, quantidade: data.quantidade });
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao adicionar quantidade");
    } finally {
      setCarregando(false);
    }
  };

  const handleConfirmarRemover = async () => {
    if (quantidadeRemover <= 0) return;
    setCarregando(true);
    try {
      const response = await fetch("http://localhost:3000/products/diminuir", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: produto.id, quantidade: quantidadeRemover }),
      });
      if (!response.ok) throw new Error("Erro ao remover quantidade");

      const data = await response.json();
      setProduto((prev) => prev && { ...prev, quantidade: data.quantidade });
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao remover quantidade");
    } finally {
      setCarregando(false);
    }
  };

  const handleAdicionarAoPedido = () => {
    alert(`🛒 ${produto.nome} adicionado ao pedido!`);
  };

  return (
    <Header>
      <div className="flex-1 overflow-hidden bg-white flex items-center justify-center">
        <section className="w-[90vw] h-[80vh] max-w-6xl bg-white rounded-3xl shadow-lg flex flex-col lg:flex-row p-6 gap-8 overflow-hidden">
          <div className="flex-1 flex justify-center items-center bg-gray-50 rounded-2xl p-4 relative">
            <div className="relative w-[60%] h-[60%]">
              <Image
                src={produto.imagem}
                alt={produto.nome}
                fill
                className="object-contain rounded-xl"
                sizes="(max-width: 768px) 80vw, 50vw"
                priority
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-around overflow-hidden space-y-3">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              {produto.nome}
            </h1>
            <p className="text-xl font-semibold text-rose-700">
              R$ {produto.preco}
            </p>

            <p className="text-gray-600">
              Quantidade disponível:{" "}
              <span className="font-semibold">{produto.quantidade}</span>
            </p>

            <div className="border border-green-300 rounded-xl p-3 bg-green-50 shadow-inner">
              <h2 className="text-md font-semibold text-green-800 mb-2">
                Adicionar quantidade
              </h2>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min={1}
                  max={MAX_QUANTIDADE_DISPONIVEL}
                  value={quantidadeAdicionar}
                  onChange={(e) =>
                    setQuantidadeAdicionar(
                      Math.max(0, parseInt(e.target.value) || 0)
                    )
                  }
                  className="text-black border border-gray-300 rounded-lg px-2 py-1 w-16 text-center focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  onClick={handleConfirmarAdicionar}
                  disabled={carregando}
                  className={`${
                    carregando
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white font-bold px-4 py-2 rounded-lg transition shadow-md text-sm cursor-pointer`}
                >
                  {carregando ? "..." : "Confirmar"}
                </button>
              </div>
            </div>

            <div className="border border-red-300 rounded-xl p-3 bg-red-50 shadow-inner">
              <h2 className="text-md font-semibold text-red-800 mb-2">
                Remover quantidade
              </h2>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min={1}
                  max={produto.quantidade}
                  value={quantidadeRemover}
                  onChange={(e) =>
                    setQuantidadeRemover(
                      Math.max(0, parseInt(e.target.value) || 0)
                    )
                  }
                  className="text-black border border-gray-300 rounded-lg px-2 py-1 w-16 text-center focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <button
                  onClick={handleConfirmarRemover}
                  disabled={carregando}
                  className={`${
                    carregando
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } text-white font-bold px-4 py-2 rounded-lg transition shadow-md text-sm cursor-pointer`}
                >
                  {carregando ? "..." : "Confirmar"}
                </button>
              </div>
            </div>

            <button
              onClick={handleAdicionarAoPedido}
              className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-3 rounded-lg transition shadow-md mt-2 text-sm"
            >
              🛒 Adicionar ao pedido
            </button>

            <button
              onClick={() => window.history.back()}
              className="text-gray-500 text-xs mt-3 hover:underline self-start cursor-pointer"
            >
              ← Voltar para produtos
            </button>
          </div>
        </section>
      </div>
    </Header>
  );
}
