"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Package, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface Produto {
  id: number;
  nome: string;
  preco: string;
  imagem: string;
}

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await fetch("http://localhost:3000/products/listar");
        const data = await res.json();

        // garante que todas as imagens tenham "/" na frente
        const produtosComImagem = data.map((p: Produto) => ({
          ...p,
          imagem: p.imagem.startsWith("/") ? p.imagem : `/${p.imagem}`,
        }));

        setProdutos(produtosComImagem);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };

    fetchProdutos();
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col">
      {/* HEADER */}
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
                className="px-4 py-1.5 text-rose-700 text-md rounded-md hover:bg-rose-200 transition-colors cursor-pointer font-bold"
              >
                Produtos
              </button>
              <button
                onClick={() =>
                  router.push("/InterfacePrincipal/GerenciarProdutos")
                }
                className="px-4 py-1.5 text-rose-700 text-md rounded-md hover:bg-rose-200 transition-colors cursor-pointer font-bold"
              >
                Gerenciar
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">Olá, bem-vindo(a)</span>
              </div>
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
            </div>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="h-screen w-screen bg-white flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-black m-5">
          Produtos Disponíveis
        </h1>

        <main className="bg-white w-full flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-6 pt-2 overflow-auto">
          {/* Produtos carregados da API */}
          {produtos.length === 0 ? (
            <p className="text-gray-500">Carregando produtos...</p>
          ) : (
            produtos.map((produto) => (
              <div
                key={produto.id}
                className="bg-white border border-gray-200 rounded-3xl shadow-md flex flex-col items-center p-4 hover:scale-105 hover:shadow-xl transition-transform transition-shadow h-60 max-h-60"
              >
                <div className="w-32 h-32 rounded-xl overflow-hidden mt-3">
                  <Image
                    src={produto.imagem}
                    alt={produto.nome}
                    width={128}
                    height={128}
                    className="object-contain w-full h-full"
                  />
                </div>
                <h2 className="mt-3 text-lg font-semibold text-gray-800 text-center tracking-wide">
                  {produto.nome}
                </h2>
                <p className="mt-2 text-rose-900 font-bold bg-rose-100 px-3 py-1 rounded-full">
                  {produto.preco}
                </p>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
