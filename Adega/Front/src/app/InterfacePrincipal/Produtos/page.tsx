"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Header from "@/Components/Header";
import Produto from "@/Components/Produto";
import Head from "next/head";
import HeaderCategorias from "@/Components/HeaderCategorias";

interface Produto {
  id: number;
  nome: string;
  preco: string;
  imagem: string;
}

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

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
    <Header>
      <HeaderCategorias></HeaderCategorias>
      {/* CONTEÚDO PRINCIPAL */}
      <div className=" bg-white flex flex-col items-center h-full">
        <h1 className="text-3xl font-extrabold text-black m-5">
          Produtos Disponíveis
        </h1>

        <main className="bg-white w-full flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-6 pt-2 overflow-auto">
          {/* Produtos carregados da API */}
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
              ></Produto>
            ))
          )}
        </main>
      </div>
    </Header>
  );
}