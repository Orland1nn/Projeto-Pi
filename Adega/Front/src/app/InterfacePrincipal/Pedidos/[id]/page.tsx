"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/Components/Header";
import Image from "next/image";
import { ChevronLeft, ScrollText } from "lucide-react";

interface Produto {
  id: number;
  nome: string;
  tipo: string;
  preco: string;
  imagem: string;
}

interface ItemPedido {
  id: number;
  quantidade: number;
  precoUnitario: string;
  subtotal: string;
  produto: Produto;
}

interface Pedido {
  id: number;
  formaPagamento: string;
  status: string;
  totalItens: number;
  precoTotal: string;
  itens: ItemPedido[];
}

export default function PedidoDetalhes() {
  const { id } = useParams();
  const router = useRouter();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscarPedido() {
      try {
        const res = await fetch(`http://localhost:3000/pedidos/${id}`);

        if (!res.ok) {
          setPedido(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setPedido(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar pedido:", error);
        setLoading(false);
      }
    }

    buscarPedido();
  }, [id]);

  if (loading)
    return (
      <Header>
        <div className="p-6 text-lg font-semibold">Carregando pedido...</div>
      </Header>
    );

  if (!pedido)
    return (
      <Header>
        <div className="p-6 text-lg font-semibold text-red-600">
          Pedido não encontrado.
        </div>
      </Header>
    );

  return (
    <Header>
      <div className="flex-1 bg-white p-8 overflow-y-auto">
        <section className="flex flex-row items-center justify-start w-full">
          <div
            className="text-2xl font-extrabold text-black m-5 mt-0 mr-0 cursor-pointer"
            onClick={() => router.push("/InterfacePrincipal/Pedidos")}
          >
            <ChevronLeft />
          </div>
          <ScrollText
            className="text-2xl font-extrabold text-black m-5 mt-0 ml-0 cursor-pointer"
            onClick={() => router.push("/InterfacePrincipal/Pedidos")}
          >
            Voltar
          </ScrollText>

          <h1 className="text-3xl font-bold text-rose-700 mb-4">
            Pedido {pedido.id}
          </h1>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-rose-50 p-4 rounded-lg text-black">
          <p>
            <strong>Status:</strong> {pedido.status}
          </p>
          <p>
            <strong>Forma de pagamento:</strong> {pedido.formaPagamento}
          </p>
          <p>
            <strong>Total de itens:</strong> {pedido.totalItens}
          </p>
          <p>
            <strong>Total:</strong>{" "}
            <span className="font-bold text-green-600">
              R$ {pedido.precoTotal}
            </span>
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-rose-700">
          Produtos do Pedido
        </h2>

        <div className="space-y-4">
          {pedido.itens.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-lg shadow-sm hover:shadow-md transition text-black"
            >
              <Image
                src={item.produto.imagem}
                alt={item.produto.nome}
                width={90}
                height={90}
                className="rounded-lg object-cover"
              />

              <div className="flex-1">
                <p className="text-lg font-bold">{item.produto.nome}</p>
                <p className="text-sm text-gray-500 mb-1">
                  {item.produto.tipo}
                </p>

                <p>Quantidade: {item.quantidade}</p>
                <p>Unitário: R$ {item.precoUnitario}</p>

                <p className="font-semibold mt-1">
                  Subtotal:{" "}
                  <span className="text-rose-700">R$ {item.subtotal}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Header>
  );
}
