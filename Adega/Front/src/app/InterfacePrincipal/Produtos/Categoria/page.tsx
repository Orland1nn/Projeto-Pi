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
}

export default function Categoria() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  // obtém a categoria da URL (ex: /Produtos?categoria=vinhos)
  const categoria = searchParams.get("categoria") ?? "produtos";

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await fetch("http://localhost:3000/products");
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
  }, []);

  // formata a categoria para exibição com a primeira letra maiúscula
  const categoriaFormatada =
    categoria.charAt(0).toUpperCase() + categoria.slice(1);

  return (
    <Header>
      <HeaderCategorias />
      <div className="bg-white flex flex-col items-center h-full">
        <section className="flex flex-row items-center justify-start w-full ">
          <div
            className="text-2xl font-extrabold text-black m-5 mr-0 cursor-pointer "
            onClick={() => router.push("/InterfacePrincipal/Produtos")}
          >
            <ChevronLeft />
          </div>
          <Box
            className="text-2xl font-extrabold text-black m-5 ml-0 cursor-pointer "
            onClick={() => router.push("/InterfacePrincipal/Produtos")}
          >
            Voltar
          </Box>
          <h1 className="text-3xl font-extrabold text-black m-5 ml-0 rounded-md">
            {categoriaFormatada}
          </h1>
        </section>

        <main className="bg-white w-full flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-6 pt-2 overflow-auto">
          {produtos.length === 0 ? (
            <p className="text-gray-500">Carregando produtos...</p>
          ) : (
            produtos.map((produto) => (
              <Produto
                key={produto.id}
                id={produto.id}
                nome={produto.nome}
                preco={produto.preco}
                imagem={produto.imagem}
              />
            ))
          )}
        </main>
      </div>
    </Header>
  );
}
