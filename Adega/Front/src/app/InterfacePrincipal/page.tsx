"use client";

import React, { useState, useEffect } from "react";
import Header from "@/Components/Header";
import Image from "next/image";

export default function InterfacePrincipal() {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    "/StockFlow logo.png",
    "/stockflow image2.jpg",
    "/stockflow image3.jpg",
    "/stockflow image4.jpg",
  ];

  // Auto avançar o carrossel a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImage(index);
  };

  return (
    <Header>
      {/* Conteúdo principal com gradiente de fundo */}
      <main className="flex-grow overflow-hidden bg-gradient-to-b from-sky-400 via-cyan-300 to-orange-400 relative">
        {/* Imagem do logo cobrindo toda a área disponível */}
        <div className="relative w-full h-full">
          <Image
            src={images[currentImage]}
            alt="Logo do StockFlow"
            width={1920}
            height={1080}
            className="w-full h-full transition-opacity duration-700"
            priority
            key={currentImage}
          />

          {/* Botões de navegação */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Imagem anterior"
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
            aria-label="Próxima imagem"
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

          {/* Indicadores (dots) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImage
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </main>
    </Header>
  );
}