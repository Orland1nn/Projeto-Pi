"use client";

import { useSearchParams, useParams } from "next/navigation";
import Header from "@/Components/Header";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PaginaVenda() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.id;
  const nome = searchParams.get("nome");
  const preco = Number(searchParams.get("preco"));
  const imagem = searchParams.get("imagem");

  // STATES
  const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(1);
  const [pagamento, setPagamento] = useState("Pix");
  const [estoqueAtual, setEstoqueAtual] = useState(0);
  const [total, setTotal] = useState(preco);
  const [msg, setMsg] = useState("");

  // Campos de pagamento
  const [nomeCliente, setNomeCliente] = useState("");
  const [cpf, setCpf] = useState("");
  const [chavePix, setChavePix] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [validadeCartao, setValidadeCartao] = useState("");
  const [cvvCartao, setCvvCartao] = useState("");

  // Busca estoque do produto
  useEffect(() => {
    async function buscarEstoque() {
      try {
        if (!nome) return;
        const resposta = await fetch(
          `http://localhost:3000/products/nome/${encodeURIComponent(nome)}`
        );
        const dados = await resposta.json();
        if (dados && dados.quantidade !== undefined) {
          setEstoqueAtual(dados.quantidade);
        }
      } catch (error) {
        console.log("Erro ao buscar estoque", error);
      }
    }
    buscarEstoque();
  }, [nome]);

  // Atualiza total
  useEffect(() => {
    setTotal(preco * quantidadeSelecionada);
  }, [quantidadeSelecionada]);

  // Controle de quantidade
  function diminuir() {
    setQuantidadeSelecionada((q) => (q > 1 ? q - 1 : 1));
  }

  function aumentar() {
    if (quantidadeSelecionada + 1 > estoqueAtual) {
      setMsg("Estoque insuficiente!");
      return;
    }
    setQuantidadeSelecionada((q) => q + 1);
    setMsg("");
  }

  // Confirma venda e cria pedido
  async function confirmarVenda() {
    // Verifica estoque
    if (quantidadeSelecionada > estoqueAtual) {
      setMsg("Não há estoque suficiente!");
      return;
    }

    // Verifica campos obrigatórios
    if (pagamento === "Pix") {
      if (!nomeCliente || !cpf || !chavePix) {
        setMsg("Preencha todos os campos do Pix!");
        return;
      }
    } else if (pagamento === "Cartão") {
      if (!nomeCartao || !numeroCartao || !validadeCartao || !cvvCartao) {
        setMsg("Preencha todos os campos do Cartão!");
        return;
      }
    }

    // Cria pedido
    try {
      const pedido = {
        formaPagamento: pagamento,
        status: "Concluído",
        totalItens: quantidadeSelecionada,
        itens: [
          {
            produtoId: Number(id),
            quantidade: quantidadeSelecionada,
          },
        ],
      };

      const response = await fetch("http://localhost:3000/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });

      if (response.ok) {
        setMsg("✅ Venda realizada com sucesso!");
        setQuantidadeSelecionada(1);
        setEstoqueAtual((prev) => prev - quantidadeSelecionada);
        // Limpa campos do pagamento
        setNomeCliente("");
        setCpf("");
        setChavePix("");
        setNomeCartao("");
        setNumeroCartao("");
        setValidadeCartao("");
        setCvvCartao("");
      } else {
        const erro = await response.text();
        console.error(erro);
        setMsg("Erro ao registrar venda.");
      }
    } catch (error) {
      console.log(error);
      setMsg("Erro na conexão com o servidor.");
    }
  }

  return (
    <Header>
      <div className="bg-gray-100 flex-1 flex flex-col items-center p-8 text-black w-full overflow-x-hidden">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md text-center w-full">
          {imagem && (
            <div className="w-40 h-40 mx-auto relative">
              <Image
                src={imagem}
                alt={nome || ""}
                fill
                className="object-contain rounded-lg"
              />
            </div>
          )}

          <p className="text-xl font-semibold mt-4">{nome}</p>
          <p className="text-lg text-rose-700 font-bold">
            R$ {preco.toFixed(2)}
          </p>

          {/* ESTOQUE */}
          <p className="mt-2">
            Estoque disponível:
            <span className="font-bold"> {estoqueAtual}</span>
          </p>

          {/* CONTROLE DE QUANTIDADE */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={diminuir}
              className="cursor-pointer bg-red-500 text-white px-3 py-1 rounded-lg"
            >
              –
            </button>

            <span className="text-xl font-bold">{quantidadeSelecionada}</span>

            <button
              onClick={aumentar}
              className="cursor-pointer bg-green-500 text-white px-3 py-1 rounded-lg"
            >
              +
            </button>
          </div>

          {/* TOTAL */}
          <p className="mt-4 text-lg">
            Total:{" "}
            <span className="font-bold text-blue-700">
              R$ {total.toFixed(2)}
            </span>
          </p>

          {/* MÉTODO DE PAGAMENTO */}
          <div className="mt-6">
            <p className="font-semibold">Método de pagamento:</p>
            <div className="flex justify-center gap-4 mt-2">
              <button
                onClick={() => setPagamento("Pix")}
                className={`cursor-pointer px-4 py-2 rounded-lg border ${
                  pagamento === "Pix"
                    ? "bg-green-400 text-white"
                    : "bg-gray-200"
                }`}
              >
                Pix
              </button>

              <button
                onClick={() => setPagamento("Cartão")}
                className={`cursor-pointer px-4 py-2 rounded-lg border ${
                  pagamento === "Cartão"
                    ? "bg-blue-400 text-white"
                    : "bg-gray-200"
                }`}
              >
                Cartão
              </button>
            </div>
          </div>

          {/* FORM PIX */}
          {pagamento === "Pix" && (
            <div className="mt-6 bg-gray-200 p-4 rounded-xl text-left">
              <h3 className="font-bold mb-3">Informações para Pagamento Pix</h3>
              <input
                type="text"
                placeholder="Nome completo"
                className="w-full p-2 mb-3 border rounded bg-white text-black"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
              />
              <input
                type="text"
                placeholder="CPF"
                className="w-full p-2 mb-3 border rounded bg-white text-black"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <input
                type="text"
                placeholder="Chave Pix"
                className="w-full p-2 mb-3 border rounded bg-white text-black"
                value={chavePix}
                onChange={(e) => setChavePix(e.target.value)}
              />
            </div>
          )}

          {/* FORM CARTÃO */}
          {pagamento === "Cartão" && (
            <div className="mt-6 bg-gray-200 p-4 rounded-xl text-left">
              <h3 className="font-bold mb-3">Informações do Cartão</h3>
              <input
                type="text"
                placeholder="Nome no cartão"
                className="w-full p-2 mb-3 border rounded bg-white text-black"
                value={nomeCartao}
                onChange={(e) => setNomeCartao(e.target.value)}
              />
              <input
                type="text"
                placeholder="Número do cartão"
                className="w-full p-2 mb-3 border rounded bg-white text-black"
                value={numeroCartao}
                onChange={(e) => setNumeroCartao(e.target.value)}
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Validade (MM/AA)"
                  className="w-1/2 p-2 mb-3 border rounded bg-white text-black"
                  value={validadeCartao}
                  onChange={(e) => setValidadeCartao(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="w-1/2 p-2 mb-3 border rounded bg-white text-black"
                  value={cvvCartao}
                  onChange={(e) => setCvvCartao(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* BOTÃO CONFIRMAR */}
          <button
            onClick={confirmarVenda}
            className="cursor-pointer mt-6 bg-rose-600 text-white px-6 py-2 rounded-xl shadow-lg w-full"
          >
            Confirmar Venda
          </button>

          {/* MENSAGEM */}
          {msg && (
            <p className="mt-4 text-center font-semibold text-red-800">{msg}</p>
          )}
        </div>
      </div>
    </Header>
  );
}
