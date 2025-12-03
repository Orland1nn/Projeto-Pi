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
  formaPagamento: string;
  itens: PedidoItem[];
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<PedidoType[]>([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState<PedidoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("todos");

  useEffect(() => {
    async function buscarPedidos() {
      try {
        const resposta = await fetch("http://localhost:3000/pedidos");
        if (!resposta.ok) throw new Error("Erro ao buscar pedidos");

        const dados = await resposta.json();
        setPedidos(dados);
        setPedidosFiltrados(dados); // inicial
      } catch (error: any) {
        setErro(error.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    buscarPedidos();
  }, []);

  function aplicarFiltro(tipo: string) {
    setFiltroAtivo(tipo);

    let lista = [...pedidos];

    switch (tipo) {
      case "maiorQtd":
        lista.sort((a, b) => b.totalItens - a.totalItens);
        break;

      case "menorQtd":
        lista.sort((a, b) => a.totalItens - b.totalItens);
        break;

      case "maiorPreco":
        lista.sort((a, b) => b.precoTotal - a.precoTotal);
        break;

      case "menorPreco":
        lista.sort((a, b) => a.precoTotal - b.precoTotal);
        break;

      case "pagamento":
        lista.sort((a, b) =>
          a.formaPagamento.localeCompare(b.formaPagamento)
        );
        break;

      default: // "todos"
        lista = pedidos;
        break;
    }

    setPedidosFiltrados(lista);
  }

  // Classe para destacar o filtro ativo
  const classeFiltro = (tipo: string) =>
    `p-3 cursor-pointer ${
      filtroAtivo === tipo ? "bg-red-600 text-white" : "hover:bg-rose-100"
    }`;

  return (
    <Header>
      <div className="h-full bg-white overflow-hidden">
        <main className="flex flex-row h-full">
          
          {/* MENU DE FILTROS */}
          <aside className="w-1/8 h-full border-r border-gray-300">
            <ul className="text-rose-700 w-full font-bold">
              <li className={classeFiltro("todos")} onClick={() => aplicarFiltro("todos")}>
                Todos Pedidos
              </li>
              <li className={classeFiltro("maiorQtd")} onClick={() => aplicarFiltro("maiorQtd")}>
                Maior Quantidade
              </li>
              <li className={classeFiltro("menorQtd")} onClick={() => aplicarFiltro("menorQtd")}>
                Menor Quantidade
              </li>
              <li className={classeFiltro("maiorPreco")} onClick={() => aplicarFiltro("maiorPreco")}>
                Maior preço
              </li>
              <li className={classeFiltro("menorPreco")} onClick={() => aplicarFiltro("menorPreco")}>
                Menor preço
              </li>
              <li className={classeFiltro("pagamento")} onClick={() => aplicarFiltro("pagamento")}>
                Forma de Pagamento
              </li>
            </ul>
          </aside>

          {/* LISTA DE PEDIDOS */}
          <section className="flex flex-col flex-1 p-6 overflow-auto">
            <header className="grid grid-cols-5 gap-4 mb-4 border-b border-gray-200 pb-2">
              <p className="text-base font-bold text-amber-700">Pedido</p>
              <p className="text-base font-bold text-amber-700">Itens</p>
              <p className="text-base font-bold text-amber-700">Preço Total</p>
              <p className="text-base font-bold text-amber-700">Pagamento</p>
              <p className="text-base font-bold text-amber-700">Status</p>
            </header>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-150px)]">
              {loading && <p>Carregando pedidos...</p>}
              {erro && <p className="text-red-500">{erro}</p>}
              {!loading && pedidosFiltrados.length === 0 && (
                <p>Nenhum pedido encontrado.</p>
              )}

              {pedidosFiltrados.map((pedido) => (
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
