"use client";

import React, { useState, useEffect } from "react";
import Header from "@/Components/Header";
import Image from "next/image";
import Produto from "@/Components/Produto";

interface ProdutoType {
  id: number;
  nome: string;
  preco: string;
  imagem: string;
  quantidade: number;
  secao?: {
    nome: string;
  };
}

export default function InterfacePrincipal() {
  const [currentImage, setCurrentImage] = useState(0);
  const [topBebidas, setTopBebidas] = useState<ProdutoType[]>([]);
  const [bebidasPorSecao, setBebidasPorSecao] = useState<ProdutoType[]>([]);

  const images = [
    "/LogoCarrossel1.jpeg",
    "/LogoCarrossel4.jpeg",
    "/LogoCarrossel3.jpeg",
    "/LogoCarrossel2.jpeg",
  ];

  // --- Top 5 bebidas ---
  useEffect(() => {
    const fetchTopBebidas = async () => {
      try {
        const res = await fetch("http://localhost:3000/products/top5");
        const data: ProdutoType[] = await res.json();

        const produtosComImagem = data.map((p) => ({
          ...p,
          imagem: p.imagem.startsWith("/") ? p.imagem : `/${p.imagem}`,
        }));

        setTopBebidas(produtosComImagem);
      } catch (err) {
        console.error("Erro ao carregar top 5 bebidas:", err);
      }
    };

    fetchTopBebidas();
  }, []);

  // --- Uma bebida de cada seção ---
  useEffect(() => {
    const fetchBebidasSecao = async () => {
      try {
        const res = await fetch("http://localhost:3000/products");
        const data: ProdutoType[] = await res.json();

        const secaoMap: Record<string, ProdutoType> = {};
        for (const produto of data) {
          const secaoNome = produto.secao?.nome;
          if (secaoNome && !secaoMap[secaoNome]) {
            secaoMap[secaoNome] = {
              ...produto,
              imagem: produto.imagem.startsWith("/")
                ? produto.imagem
                : `/${produto.imagem}`,
            };
          }
        }

        setBebidasPorSecao(Object.values(secaoMap));
      } catch (err) {
        console.error("Erro ao carregar bebidas por seção:", err);
      }
    };

    fetchBebidasSecao();
  }, []);

  // --- Carrossel auto avançar ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  const goToImage = (index: number) => setCurrentImage(index);

  return (
    <Header>
      <main className="flex-grow overflow-x-hidden bg-gradient-to-b from-sky-400 via-cyan-300 to-orange-400">
        {/* --- CARROSSEL --- */}
        <div className="relative w-full h-[350px] sm:h-[420px] md:h-[500px] lg:h-[600px]">
          <Image
            src={images[currentImage]}
            alt="Logo do StockFlow"
            fill
            className="transition-opacity duration-700"
            priority
            key={currentImage}
          />

          {/* Botões esquerda/direita */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentImage === index
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>

        {/* --- Top 5 bebidas por demanda --- */}
        <section className="bg-amber-50 backdrop-blur-md pb-5 pt-10 px-6">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
            Maiores demandas
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {topBebidas.length === 0 ? (
              <p className="text-gray-600">Carregando top 5 bebidas...</p>
            ) : (
              topBebidas.map((produto) => (
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
          </div>
        </section>

        {/* --- Uma bebida de cada seção --- */}
        <section className="bg-amber-50 backdrop-blur-md pt-5 pb-10 px-6">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
            Bebidas por categoria
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {bebidasPorSecao.length === 0 ? (
              <p className="text-gray-600">Carregando bebidas por seção...</p>
            ) : (
              bebidasPorSecao.map((produto) => (
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
          </div>
        </section>
      </main>
    </Header>
  );
}
