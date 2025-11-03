"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { use } from "react";

interface ProdutoProps {
  id: number;
  nome: string;
  preco: string;
  imagem: string;
  quantidade: number;
}

export default function Produto({
  id,
  imagem,
  nome,
  preco,
  quantidade,
}: ProdutoProps) {
  const router = useRouter();
  return (
    <div
      key={id}
      onClick={() =>
        router.push(
          `/InterfacePrincipal/Produtos/${id}?nome=${encodeURIComponent(
            nome
          )}&preco=${encodeURIComponent(preco)}&imagem=${encodeURIComponent(
            imagem
          )}&quantidade=${quantidade}`
        )
      }
      className="cursor-pointer bg-white border border-gray-200 rounded-3xl shadow-md flex flex-col items-center p-4 hover:scale-105 hover:shadow-xl transition-transform transition-shadow h-60 max-h-60"
    >
      <div className="w-32 h-32 rounded-xl overflow-hidden mt-3 ">
        <Image
          src={imagem}
          alt={nome}
          width={128}
          height={128}
          className="object-contain w-full h-full"
        />
      </div>
      <h2 className="mt-3 text-lg font-semibold text-gray-800 text-center tracking-wide">
        {nome}
      </h2>
      <p className="mt-2 text-rose-900 font-bold bg-rose-100 px-3 py-1 rounded-full">
        R$ {preco}
      </p>
    </div>
  );
}
