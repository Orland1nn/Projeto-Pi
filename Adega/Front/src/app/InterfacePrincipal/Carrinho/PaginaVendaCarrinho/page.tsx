"use client";

import { useEffect, useState } from "react";
import Header from "@/Components/Header";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CartItem {
  produtoId: number;
  nome: string;
  imagem?: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
}

export default function PaginaVendaCarrinho() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pagamento, setPagamento] = useState("Pix");
  const [msg, setMsg] = useState("");

  // Campos Pix
  const [nomeCliente, setNomeCliente] = useState("");
  const [cpf, setCpf] = useState("");
  const [chavePix, setChavePix] = useState("");

  // Campos Cartão
  const [nomeCartao, setNomeCartao] = useState("");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [validadeCartao, setValidadeCartao] = useState("");
  const [cvvCartao, setCvvCartao] = useState("");

  // Pagamento dividido
  const [valorPix, setValorPix] = useState(0);
  const [valorCartao, setValorCartao] = useState(0);

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch("http://localhost:3000/cart");
        const data: { items: CartItem[]; total: number } = await res.json();
        setCartItems(data.items);
        setTotal(data.total);
      } catch (error) {
        console.error("Erro ao buscar carrinho:", error);
      }
    }
    fetchCart();
  }, []);

  async function confirmarVenda() {
    setMsg("");

    try {
      // Verifica estoque de cada item
      for (const item of cartItems) {
        const res = await fetch(
          `http://localhost:3000/products/nome/${encodeURIComponent(item.nome)}`
        );
        if (!res.ok) throw new Error(`Erro ao verificar produto ${item.nome}`);
        const produto = await res.json();

        if (item.quantidade > produto.quantidade) {
          throw new Error(
            `Estoque insuficiente para ${item.nome} (Disponível: ${produto.quantidade})`
          );
        }
      }

      const valorPixNumber = Number(valorPix) || 0;
      const valorCartaoNumber = Number(valorCartao) || 0;

      // Validação do pagamento
      if (pagamento === "Pix") {
        if (!nomeCliente || !cpf || !chavePix) {
          setMsg("Preencha todos os campos do Pix!");
          return;
        }
      }

      if (pagamento === "Cartão") {
        if (!nomeCartao || !numeroCartao || !validadeCartao || !cvvCartao) {
          setMsg("Preencha todos os campos do Cartão!");
          return;
        }
      }

      if (pagamento === "Dividido") {
        if (valorPixNumber + valorCartaoNumber !== total) {
          setMsg("A soma Pix + Cartão deve ser igual ao total!");
          return;
        }

        if (valorPixNumber > 0 && (!nomeCliente || !cpf || !chavePix)) {
          setMsg("Complete os dados do Pix!");
          return;
        }

        if (
          valorCartaoNumber > 0 &&
          (!nomeCartao || !numeroCartao || !validadeCartao || !cvvCartao)
        ) {
          setMsg("Complete os dados do Cartão!");
          return;
        }
      }

      // Monta pedido
      const pedido = {
        formaPagamento: pagamento,
        status: "Concluído",
        totalItens: cartItems.reduce((acc, item) => acc + item.quantidade, 0),
        total: total,
        pagamentoDetalhes:
          pagamento === "Dividido"
            ? { pix: valorPixNumber, cartao: valorCartaoNumber }
            : { metodo: pagamento },
        itens: cartItems.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
        })),
      };

      // Cria pedido
      const response = await fetch("http://localhost:3000/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });

      if (!response.ok) throw new Error("Erro ao registrar venda");

      // Limpa carrinho
      await fetch("http://localhost:3000/cart/clear", { method: "DELETE" });

      // Redireciona para pedidos
      router.push("/InterfacePrincipal/Pedidos");
    } catch (error: any) {
      setMsg(error.message || "Erro ao processar venda");
    }
  }

  return (
    <Header>
      <div className="bg-gray-100 flex-1 flex flex-col items-center p-8 text-black w-full overflow-x-hidden">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full">
          <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>

          {cartItems.map((item) => (
            <div
              key={item.produtoId}
              className="flex items-center justify-between mb-2 bg-gray-50 p-2 rounded"
            >
              <div className="flex items-center gap-4">
                {item.imagem && (
                  <div className="w-16 h-16 relative">
                    <Image
                      src={item.imagem}
                      alt={item.nome}
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                )}
                <div>
                  <p className="font-semibold">{item.nome}</p>
                  <p>
                    R$ {item.precoUnitario.toFixed(2)} x {item.quantidade} ={" "}
                    <b>R$ {item.subtotal.toFixed(2)}</b>
                  </p>
                </div>
              </div>
            </div>
          ))}

          <p className="mt-4 text-lg text-blue-700 font-bold">
            Total: R$ {total.toFixed(2)}
          </p>

          {/* MÉTODO DE PAGAMENTO */}
          <div className="mt-6">
            <p className="font-semibold">Método de pagamento:</p>
            <div className="flex justify-center gap-2 mt-2 flex-wrap">
              {["Pix", "Cartão", "Dividido"].map((m) => (
                <button
                  key={m}
                  onClick={() => setPagamento(m)}
                  className={`px-4 py-2 rounded-lg border ${
                    pagamento === m ? "bg-green-400 text-white" : "bg-gray-200"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Campos de pagamento */}
          {pagamento === "Pix" && (
            <div className="mt-4 p-4 bg-gray-200 rounded-xl text-left">
              <input
                type="text"
                placeholder="Nome completo"
                className="w-full p-2 mb-2 border rounded bg-white"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
              />
              <input
                type="text"
                placeholder="CPF"
                className="w-full p-2 mb-2 border rounded bg-white"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <input
                type="text"
                placeholder="Chave Pix"
                className="w-full p-2 mb-2 border rounded bg-white"
                value={chavePix}
                onChange={(e) => setChavePix(e.target.value)}
              />
            </div>
          )}

          {pagamento === "Cartão" && (
            <div className="mt-4 p-4 bg-gray-200 rounded-xl text-left">
              <input
                type="text"
                placeholder="Nome no cartão"
                className="w-full p-2 mb-2 border rounded bg-white"
                value={nomeCartao}
                onChange={(e) => setNomeCartao(e.target.value)}
              />
              <input
                type="text"
                placeholder="Número do cartão"
                className="w-full p-2 mb-2 border rounded bg-white"
                value={numeroCartao}
                onChange={(e) => setNumeroCartao(e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Validade"
                  className="w-1/2 p-2 mb-2 border rounded bg-white"
                  value={validadeCartao}
                  onChange={(e) => setValidadeCartao(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="w-1/2 p-2 mb-2 border rounded bg-white"
                  value={cvvCartao}
                  onChange={(e) => setCvvCartao(e.target.value)}
                />
              </div>
            </div>
          )}

          {pagamento === "Dividido" && (
            <div className="mt-4 p-4 bg-purple-100 rounded-xl text-left">
              <p>Total: R$ {total.toFixed(2)}</p>
              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  placeholder="Valor Pix"
                  className="w-1/2 p-2 border rounded bg-white"
                  value={valorPix}
                  onChange={(e) => setValorPix(Number(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Valor Cartão"
                  className="w-1/2 p-2 border rounded bg-white"
                  value={valorCartao}
                  onChange={(e) => setValorCartao(Number(e.target.value))}
                />
              </div>

              {/* Campos Pix e Cartão se houver valor */}
              {valorPix > 0 && (
                <div className="mt-4 p-4 bg-gray-200 rounded-xl text-left">
                  <input
                    type="text"
                    placeholder="Nome completo"
                    className="w-full p-2 mb-2 border rounded bg-white"
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="CPF"
                    className="w-full p-2 mb-2 border rounded bg-white"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Chave Pix"
                    className="w-full p-2 mb-2 border rounded bg-white"
                    value={chavePix}
                    onChange={(e) => setChavePix(e.target.value)}
                  />
                </div>
              )}

              {valorCartao > 0 && (
                <div className="mt-4 p-4 bg-gray-200 rounded-xl text-left">
                  <input
                    type="text"
                    placeholder="Nome no cartão"
                    className="w-full p-2 mb-2 border rounded bg-white"
                    value={nomeCartao}
                    onChange={(e) => setNomeCartao(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Número do cartão"
                    className="w-full p-2 mb-2 border rounded bg-white"
                    value={numeroCartao}
                    onChange={(e) => setNumeroCartao(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Validade"
                      className="w-1/2 p-2 mb-2 border rounded bg-white"
                      value={validadeCartao}
                      onChange={(e) => setValidadeCartao(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="w-1/2 p-2 mb-2 border rounded bg-white"
                      value={cvvCartao}
                      onChange={(e) => setCvvCartao(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={confirmarVenda}
            className="mt-6 bg-rose-600 text-white w-full py-2 rounded-xl"
          >
            Confirmar Venda
          </button>

          {msg && <p className="mt-2 text-red-700 font-semibold">{msg}</p>}
        </div>
      </div>
    </Header>
  );
}
