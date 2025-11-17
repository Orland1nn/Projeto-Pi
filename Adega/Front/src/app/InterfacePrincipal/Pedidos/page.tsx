"use client";

import React, { useEffect, useState } from "react";
import Header from "@/Components/Header";
import Pedido from "@/Components/Pedido";

interface PedidoItem {
  produtoId: number;
  quantidade: number;
}

interface PedidoType {
  id: number;
  totalItens: number;
  precoTotal: number;
  status: string;
  formaPagamento: string; // agora usamos formaPagamento
  itens: PedidoItem[];
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<PedidoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarPedidos() {
      try {
        const resposta = await fetch("http://localhost:3000/pedidos");
        if (!resposta.ok) {
          throw new Error("Erro ao buscar pedidos");
        }
        const dados = await resposta.json();
        setPedidos(dados);
      } catch (error: any) {
        console.error(error);
        setErro(error.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    buscarPedidos();
  }, []);

  return (
    <Header>
      <div className="h-full bg-white">
        <main className="flex flex-row h-full">
          <aside className="w-1/8 h-full border-r border-gray-300 cursor-pointer flex justify-center">
            <ul className="text-rose-700 w-full font-bold">
              <li className="hover:bg-rose-100 p-3">Todos Pedidos</li>
              <li className="hover:bg-rose-100 p-3">Maior Quantidade</li>
              <li className="hover:bg-rose-100 p-3">Menor Quantidade</li>
              <li className="hover:bg-rose-100 p-3">Maior preço</li>
              <li className="hover:bg-rose-100 p-3">Menor preço</li>
              <li className="hover:bg-rose-100 p-3">Forma de Pagamento</li>
            </ul>
          </aside>

          <section className="flex flex-col flex-1 p-6">
            <header className="grid grid-cols-5 gap-4 mb-4 border-b border-gray-200 pb-2">
              <p className="text-base font-bold text-amber-700">Pedido</p>
              <p className="text-base font-bold text-amber-700">Itens</p>
              <p className="text-base font-bold text-amber-700">Preço Total</p>
              <p className="text-base font-bold text-amber-700">Pagamento</p>
              <p className="text-base font-bold text-amber-700">Status</p>
            </header>

            <div className="flex flex-col gap-2">
              {loading && <p>Carregando pedidos...</p>}
              {erro && <p className="text-red-500">{erro}</p>}
              {!loading && pedidos.length === 0 && (
                <p>Nenhum pedido encontrado.</p>
              )}
              {pedidos.map((pedido) => (
                <Pedido
                  key={pedido.id}
                  id={pedido.id}
                  totalItens={pedido.totalItens}
                  precoTotal={pedido.precoTotal}
                  formaPagamento={pedido.formaPagamento}
                  status={pedido.status}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </Header>
  );
}
