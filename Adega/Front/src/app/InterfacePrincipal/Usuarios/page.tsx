"use client";

import Header from "@/Components/Header";
import { useState, useEffect } from "react";
import Image from "next/image";

// Tipo dos usuários
interface Usuario {
  id: number;
  nome: string;
  email?: string;
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch("http://localhost:3000/users");
        const data: Usuario[] = await res.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <Header>
      <div className="bg-white w-full h-full overflow-x-hidden">
        <main className="flex flex-row w-full h-full">
          <section className="w-1/2 h-full">
            <h1 className="text-2xl font-extrabold text-amber-400 mt-5 w-full text-center">
              Sua Conta
            </h1>
          </section>

          <section className="w-1/2 h-full">
            <h1 className="text-2xl font-extrabold text-black mt-5 w-full text-center">
              Usuários do Sistema
            </h1>

            <div className="grid grid-cols-3 gap-4 p-6 overflow-y-auto max-h-[80vh] place-items-center">
              {usuarios.map((usuario) => (
                <div
                  key={usuario.id}
                  className="bg-gray-100 shadow-lg rounded-2xl p-4 flex flex-col items-center justify-center text-black font-semibold w-[180px] sm:w-[200px] md:w-[220px]"
                >
                  <div className="relative w-16 h-16 mb-3">
                    <Image
                      src={`https://api.dicebear.com/9.x/identicon/png?seed=${usuario.nome}`}
                      alt={`Avatar de ${usuario.nome}`}
                      fill
                      className="rounded-full border border-gray-300 object-cover"
                    />
                  </div>
                  <p className="text-lg text-center break-words">
                    {usuario.nome}
                  </p>
                  <p className="text-sm text-gray-600">ID: {usuario.id}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </Header>
  );
}
