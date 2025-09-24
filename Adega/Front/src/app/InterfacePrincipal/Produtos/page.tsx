"use client";

import Image from "next/image";

export default function InterfacePrincipal() {
  const produtos = [
    { id: 1, nome: "Vinho", preco: "R$ 69,90", imagem: "/vinho.jpg" },
    { id: 2, nome: "Produto B", preco: "R$ 79,90", imagem: "/vinho.jpg" },
    { id: 3, nome: "Produto C", preco: "R$ 99,90", imagem: "/vinho.jpg" },
    { id: 4, nome: "Produto D", preco: "R$ 129,90", imagem: "/vinho.jpg" },
    { id: 5, nome: "Produto E", preco: "R$ 159,90", imagem: "/vinho.jpg" },
    { id: 6, nome: "Produto F", preco: "R$ 199,90", imagem: "/vinho.jpg" },
    { id: 7, nome: "Produto F", preco: "R$ 199,90", imagem: "/vinho.jpg" },
  ];

  return (
    <div className="h-screen w-screen bg-white flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-rose-900 m-5">
        Produtos Disponíveis
      </h1>

      <main className="bg-white w-full flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-6 overflow-auto">
        {produtos.map((produto) => (
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
                className="object-contain"
              />
            </div>
            <h2 className="mt-3 text-lg font-semibold text-gray-800 text-center tracking-wide">
              {produto.nome}
            </h2>
            <p className="mt-2 text-rose-900 font-bold bg-rose-100 px-3 py-1 rounded-full">
              {produto.preco}
            </p>
          </div>
        ))}
      </main>
    </div>
  );
}
