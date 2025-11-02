"use client";

import Header from "@/Components/Header";
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
  const [quantidadeAdicionar, setQuantidadeAdicionar] = useState(1);
  const [quantidadeRemover, setQuantidadeRemover] = useState(1);
  const [carregando, setCarregando] = useState(false);

  // 🧠 Buscar produto pelo nome no backend
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
        <div className="text-center text-gray-600 mt-10">
          Carregando produto...
        </div>
      </Header>
    );
  }

  const handleConfirmarAdicionar = async () => {
    if (quantidadeAdicionar <= 0)
      return alert("Informe uma quantidade válida.");
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
      alert(
        `✅ Adicionado ${quantidadeAdicionar}x ${produto.nome} ao estoque!`
      );
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao adicionar quantidade");
    } finally {
      setCarregando(false);
    }
  };

  const handleConfirmarRemover = async () => {
    if (quantidadeRemover <= 0)
      return alert("Informe uma quantidade válida para remover.");
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
      alert(`🗑️ Removido ${quantidadeRemover}x ${produto.nome} do estoque!`);
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
      <div className="bg-white min-h-screen">
        <section className="max-w-6xl mx-auto p-6 bg-white rounded-3xl shadow-lg mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="flex justify-center items-center bg-gray-50 rounded-2xl p-6">
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="w-80 h-80 object-contain rounded-xl"
              />
            </div>

            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {produto.nome}
              </h1>
              <p className="text-2xl font-semibold text-rose-700">
                {produto.preco}
              </p>

              <p className="text-gray-600">
                Quantidade disponível:{" "}
                <span className="font-semibold">{produto.quantidade}</span>
              </p>

              {/* ADICIONAR */}
              <div className="border border-green-300 rounded-xl p-4 bg-green-50 shadow-inner">
                <h2 className="text-lg font-semibold text-green-800 mb-2">
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
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    className="text-black border border-gray-300 rounded-lg px-3 py-2 w-20 text-center focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <button
                    onClick={handleConfirmarAdicionar}
                    disabled={carregando}
                    className={`${
                      carregando
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white font-bold px-6 py-2 rounded-lg transition shadow-md`}
                  >
                    {carregando ? "..." : "Confirmar"}
                  </button>
                </div>
              </div>

              {/* REMOVER */}
              <div className="border border-red-300 rounded-xl p-4 bg-red-50 shadow-inner">
                <h2 className="text-lg font-semibold text-red-800 mb-2">
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
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    className="text-black border border-gray-300 rounded-lg px-3 py-2 w-20 text-center focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                  <button
                    onClick={handleConfirmarRemover}
                    disabled={carregando}
                    className={`${
                      carregando
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white font-bold px-6 py-2 rounded-lg transition shadow-md`}
                  >
                    {carregando ? "..." : "Confirmar"}
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdicionarAoPedido}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition shadow-md mt-4"
              >
                🛒 Adicionar ao pedido
              </button>

              <button
                onClick={() => window.history.back()}
                className="text-gray-500 text-sm mt-6 hover:underline"
              >
                ← Voltar para produtos
              </button>
            </div>
          </div>
        </section>
      </div>
    </Header>
  );
}
