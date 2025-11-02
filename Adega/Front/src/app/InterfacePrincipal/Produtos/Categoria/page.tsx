"use client";

import { useEffect, useState } from "react";
import Header from "@/Components/Header";
import Produto from "@/Components/Produto";
import HeaderCategorias from "@/Components/HeaderCategorias";
import { ChevronLeft, Box } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Produto {
  id: number;
  nome: string;
  preco: string;
  imagem: string;
  quantidade: number;
}

export default function Categoria() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filtro, setFiltro] = useState<string>(""); // texto da pesquisa
  const [ordenacao, setOrdenacao] = useState<string>(""); // tipo de ordenação
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoria = searchParams.get("categoria") ?? "produtos";

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/products?categoria=${categoria}`
        );
        const data = await res.json();

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
  }, [categoria]);

  const categoriaFormatada =
    categoria.charAt(0).toUpperCase() + categoria.slice(1);

  // Aplica pesquisa e ordenação
  const produtosFiltrados = [...produtos]
    .filter((p) => p.nome.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => {
      if (ordenacao === "maiorPreco")
        return parseFloat(b.preco) - parseFloat(a.preco);
      if (ordenacao === "menorPreco")
        return parseFloat(a.preco) - parseFloat(b.preco);
      if (ordenacao === "alfabetico") return a.nome.localeCompare(b.nome);
      return 0;
    });

  return (
    <Header>
      <HeaderCategorias />
      <div className="bg-white flex flex-col items-center h-full">
        {/* Cabeçalho da categoria */}
        <section className="flex flex-row items-center justify-start w-full">
          <div
            className="text-2xl font-extrabold text-black m-5 mr-0 cursor-pointer"
            onClick={() => router.push("/InterfacePrincipal/Produtos")}
          >
            <ChevronLeft />
          </div>
          <Box
            className="text-2xl font-extrabold text-black m-5 ml-0 cursor-pointer"
            onClick={() => router.push("/InterfacePrincipal/Produtos")}
          >
            Voltar
          </Box>
          <h1 className="text-3xl font-extrabold text-black m-5 ml-0 rounded-md">
            {categoriaFormatada}
          </h1>
        </section>

        {/* 🔍 FILTROS E PESQUISA */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6 w-full px-6 text-gray-600">
          <input
            type="text"
            placeholder="Pesquisar produto..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="border border-gray-300 text-black rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            onClick={() => setOrdenacao("maiorPreco")}
            className={`px-4 ml-5 py-2 rounded-lg border transition-colors duration-200 ${
              ordenacao === "maiorPreco"
                ? "bg-amber-500 text-white border-amber-500 cursor-pointer"
                : "bg-white text-black border-gray-300 hover:bg-gray-100 cursor-pointer"
            }`}
          >
            Maior Preço
          </button>

          <button
            onClick={() => setOrdenacao("menorPreco")}
            className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
              ordenacao === "menorPreco"
                ? "bg-amber-500 text-white border-amber-500 cursor-pointer"
                : "bg-white text-black border-gray-300 hover:bg-gray-100 cursor-pointer"
            }`}
          >
            Menor Preço
          </button>

          <button
            onClick={() => setOrdenacao("alfabetico")}
            className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
              ordenacao === "alfabetico"
                ? "bg-amber-500 text-white border-amber-500 cursor-pointer"
                : "bg-white text-black border-gray-300 hover:bg-gray-100 cursor-pointer"
            }`}
          >
            Alfabético
          </button>
        </div>

        {/* LISTA DE PRODUTOS */}
        <main className="bg-white w-full flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-6 pt-2 overflow-auto">
          {produtosFiltrados.length === 0 ? (
            <p className="text-gray-500">Nenhum produto encontrado.</p>
          ) : (
            produtosFiltrados.map((produto) => (
              <Produto
                key={produto.id}
                id={produto.id}
                nome={produto.nome}
                preco={produto.preco}
                imagem={produto.imagem}
                quantidade={produto.quantidade}
              />
            ))
          )}
        </main>
      </div>
    </Header>
  );
}
