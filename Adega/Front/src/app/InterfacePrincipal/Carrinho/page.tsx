"use client";

import { useEffect, useState } from "react";
import Header from "@/Components/Header";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItem {
  produtoId: number;
  nome: string;
  imagem?: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
}

interface Cart {
  items: CartItem[];
  total: number;
}

export default function Carrinho() {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [mensagemErro, setMensagemErro] = useState("");
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:3000/cart");
      const data: Cart = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Erro ao buscar carrinho:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const increaseQuantity = async (id: number) => {
    await fetch(`http://localhost:3000/cart/add/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantidade: 1 }),
    });
    fetchCart();
  };

  const decreaseQuantity = async (item: CartItem) => {
    const novaQuantidade = item.quantidade - 1;
    if (novaQuantidade <= 0) {
      await removeItem(item.produtoId);
      return;
    }
    await fetch(`http://localhost:3000/cart/update/${item.produtoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantidade: novaQuantidade }),
    });
    fetchCart();
  };

  const removeItem = async (id: number) => {
    await fetch(`http://localhost:3000/cart/remove/${id}`, {
      method: "DELETE",
    });
    fetchCart();
  };

  const handleFazerPedido = async () => {
    setMensagemErro("");
    try {
      for (const item of cart.items) {
        const res = await fetch(
          `http://localhost:3000/products/${item.produtoId}`
        );
        if (!res.ok) throw new Error(`Erro ao verificar produto ${item.nome}`);
        const produto = await res.json();

        if (item.quantidade > produto.quantidade) {
          setMensagemErro(
            `Quantidade insuficiente para ${item.nome}. Disponível: ${produto.quantidade}`
          );
          return;
        }
      }

      router.push("/InterfacePrincipal/Carrinho/PaginaVendaCarrinho");
    } catch (err: any) {
      console.error(err);
      setMensagemErro(`❌ ${err.message}`);
    }
  };

  return (
    <Header>
      <div className="h-full bg-white p-4 flex flex-col justify-center items-center text-rose-800">
        <ShoppingCart></ShoppingCart>
        <h1 className="text-2xl font-bold mb-4 text-black">Carrinho</h1>

        {!cart.items || cart.items.length === 0 ? (
          <p>Carrinho vazio</p>
        ) : (
          <div className="space-y-4 w-full max-w-3xl">
            {cart.items.map((item) => (
              <div
                key={item.produtoId}
                className="flex justify-between items-center bg-gray-50 p-2 rounded-md"
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={item.imagem || "/images/default.png"}
                    alt={item.nome}
                    width={80}
                    height={80}
                    className="rounded"
                  />
                  <div>
                    <p className="font-semibold text-black">{item.nome}</p>
                    <p className="text-gray-700">
                      R$ {Number(item.precoUnitario).toFixed(2)}
                    </p>
                    <p className="text-gray-700">
                      Subtotal: R$ {Number(item.subtotal).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decreaseQuantity(item)}
                    className="px-2 py-1 bg-gray-200 rounded cursor-pointer text-black"
                  >
                    -
                  </button>
                  <span className="text-black">{item.quantidade}</span>
                  <button
                    onClick={() => increaseQuantity(item.produtoId)}
                    className="px-2 py-1 bg-gray-200 rounded cursor-pointer text-black"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.produtoId)}
                    className="px-2 py-1 bg-red-300 rounded cursor-pointer text-black hover:text-white"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-4 flex flex-col items-end space-y-2">
              <span className="font-bold text-xl text-gray-700">
                Total: R$ {Number(cart.total).toFixed(2)}
              </span>
              <button
                onClick={handleFazerPedido}
                className="px-4 py-2 bg-amber-600 text-white rounded cursor-pointer hover:bg-amber-400 transition"
              >
                Fazer Pedido
              </button>

              {mensagemErro && (
                <p className="text-amber-700 text-sm mt-1 font-semibold">
                  {mensagemErro}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Header>
  );
}
