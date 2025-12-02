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

  // Campos pix
  const [nomeCliente, setNomeCliente] = useState("");
  const [cpf, setCpf] = useState("");
  const [chavePix, setChavePix] = useState("");

  // Campos cartão
  const [nomeCartao, setNomeCartao] = useState("");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [validadeCartao, setValidadeCartao] = useState("");
  const [cvvCartao, setCvvCartao] = useState("");

  // Valores divididos
  const [valorPix, setValorPix] = useState(0);
  const [valorCartao, setValorCartao] = useState(0);

  useEffect(() => {
    async function buscarEstoque() {
      if (!nome) return;
      try {
        const resposta = await fetch(
          `http://localhost:3000/products/nome/${encodeURIComponent(nome)}`
        );
        const dados = await resposta.json();
        if (dados?.quantidade !== undefined) {
          setEstoqueAtual(dados.quantidade);
        }
      } catch (error) {
        console.log("Erro ao buscar estoque:", error);
      }
    }
    buscarEstoque();
  }, [nome]);

  useEffect(() => {
    setTotal(preco * quantidadeSelecionada);

    setValorPix(0);
    setValorCartao(0);
  }, [quantidadeSelecionada]);

  function alterarQuantidade(value: string) {
    const novaQuantidade = Number(value);

    if (isNaN(novaQuantidade) || novaQuantidade < 1) {
      setQuantidadeSelecionada(1);
      return;
    }

    if (novaQuantidade > estoqueAtual) {
      setMsg("Estoque insuficiente!");
      return;
    }

    setQuantidadeSelecionada(novaQuantidade);
    setMsg("");
  }

  // === CONFIRMAR VENDA ===
  async function confirmarVenda() {
    setMsg("");

    if (quantidadeSelecionada > estoqueAtual) {
      setMsg("Não há estoque suficiente!");
      return;
    }

    if (pagamento === "Pix") {
      if (!nomeCliente || !cpf || !chavePix) {
        setMsg("Preencha todos os campos do Pix!");
        return;
      }
    }

    if (pagamento === "Cartão") {
      if (!nomeCartao || !numeroCartao || !validadeCartao || !cvvCartao) {
        setMsg("Preencha todos os campos do cartão!");
        return;
      }
    }

    if (pagamento === "Dividido") {
      if (valorPix + valorCartao !== total) {
        setMsg("A soma Pix + Cartão deve ser igual ao total!");
        return;
      }

      if (valorPix > 0 && (!nomeCliente || !cpf || !chavePix)) {
        setMsg("Complete os dados do Pix!");
        return;
      }

      if (
        valorCartao > 0 &&
        (!nomeCartao || !numeroCartao || !validadeCartao || !cvvCartao)
      ) {
        setMsg("Complete os dados do Cartão!");
        return;
      }
    }

    try {
      const pedido = {
        formaPagamento: pagamento,
        status: "Concluído",
        totalItens: quantidadeSelecionada,
        total: total,
        pagamentoDetalhes:
          pagamento === "Dividido"
            ? { pix: valorPix, cartao: valorCartao }
            : { metodo: pagamento },
        itens: [{ produtoId: Number(id), quantidade: quantidadeSelecionada }],
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
        setValorPix(0);
        setValorCartao(0);
      } else {
        setMsg("Erro ao registrar venda.");
      }
    } catch (error) {
      setMsg("Erro ao comunicar com servidor.");
    }
  }

  return (
    <Header>
      <div className="bg-gray-100 flex-1 flex flex-col items-center p-8 text-black w-full">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          {imagem && (
            <div className="w-40 h-40 mx-auto relative">
              <Image
                src={imagem}
                alt={nome ?? ""}
                fill
                className="object-contain rounded-lg"
              />
            </div>
          )}

          <p className="text-xl font-semibold mt-4">{nome}</p>
          <p className="text-lg text-rose-700 font-bold">
            R$ {preco.toFixed(2)}
          </p>

          <p className="mt-2">
            Estoque: <b>{estoqueAtual}</b>
          </p>

          {/* QUANTIDADE */}
          <div className="mt-6">
            <p className="font-semibold">Quantidade:</p>
            <input
              type="number"
              min="1"
              className="w-32 text-center p-2 mt-2 border rounded bg-gray-100"
              value={quantidadeSelecionada}
              onChange={(e) => alterarQuantidade(e.target.value)}
            />
          </div>

          {/* TOTAL */}
          <p className="mt-4 text-lg">
            Total: <b className="text-blue-700">R$ {total.toFixed(2)}</b>
          </p>

          {/* MÉTODO DE PAGAMENTO */}
          <div className="mt-6">
            <p className="font-semibold">Método de pagamento:</p>
            <div className="flex justify-center gap-2 mt-2 flex-wrap">
              <button
                onClick={() => setPagamento("Pix")}
                className={`px-4 py-2 rounded-lg border ${
                  pagamento === "Pix"
                    ? "bg-green-400 text-white"
                    : "bg-gray-200"
                }`}
              >
                Pix
              </button>

              <button
                onClick={() => setPagamento("Cartão")}
                className={`px-4 py-2 rounded-lg border ${
                  pagamento === "Cartão"
                    ? "bg-blue-400 text-white"
                    : "bg-gray-200"
                }`}
              >
                Cartão
              </button>

              <button
                onClick={() => setPagamento("Dividido")}
                className={`px-4 py-2 rounded-lg border ${
                  pagamento === "Dividido"
                    ? "bg-purple-400 text-white"
                    : "bg-gray-200"
                }`}
              >
                Dividido
              </button>
            </div>
          </div>

          {/* FORM PIX */}
          {pagamento === "Pix" && (
            <div className="mt-6 bg-gray-200 p-4 rounded-xl text-left">
              <h3 className="font-bold mb-3">Dados Pix</h3>

              <input
                type="text"
                placeholder="Nome completo"
                className="w-full p-2 mb-3 border rounded bg-white"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
              />

              <input
                type="text"
                placeholder="CPF"
                className="w-full p-2 mb-3 border rounded bg-white"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />

              <input
                type="text"
                placeholder="Chave Pix"
                className="w-full p-2 mb-3 border rounded bg-white"
                value={chavePix}
                onChange={(e) => setChavePix(e.target.value)}
              />
            </div>
          )}

          {/* FORM CARTÃO */}
          {pagamento === "Cartão" && (
            <div className="mt-6 bg-gray-200 p-4 rounded-xl text-left">
              <h3 className="font-bold mb-3">Dados Cartão</h3>

              <input
                type="text"
                placeholder="Nome no cartão"
                className="w-full p-2 mb-3 border rounded bg-white"
                value={nomeCartao}
                onChange={(e) => setNomeCartao(e.target.value)}
              />

              <input
                type="text"
                placeholder="Número do cartão"
                className="w-full p-2 mb-3 border rounded bg-white"
                value={numeroCartao}
                onChange={(e) => setNumeroCartao(e.target.value)}
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Validade"
                  className="w-1/2 p-2 mb-3 border rounded bg-white"
                  value={validadeCartao}
                  onChange={(e) => setValidadeCartao(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="CVV"
                  className="w-1/2 p-2 mb-3 border rounded bg-white"
                  value={cvvCartao}
                  onChange={(e) => setCvvCartao(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* PAGAMENTO DIVIDIDO — OPÇÃO A COMPLETA */}
          {pagamento === "Dividido" && (
            <div className="mt-6 bg-purple-100 p-4 rounded-xl text-left">
              <h3 className="font-bold mb-2">Pagamento dividido</h3>

              <p>Total: R$ {total.toFixed(2)}</p>

              {/* CAMPOS COM OPÇÃO A */}
              <div className="flex gap-3 mt-3">
                {/* PIX */}
                <input
                  type="number"
                  placeholder="Valor Pix"
                  className="w-1/2 p-2 border rounded bg-white"
                  value={valorPix}
                  onChange={(e) => {
                    let v = Number(e.target.value);
                    if (isNaN(v) || v < 0) v = 0;

                    if (v > total) v = total;

                    if (v + valorCartao > total) {
                      setValorCartao(total - v);
                    }

                    setValorPix(v);
                  }}
                />

                {/* CARTÃO */}
                <input
                  type="number"
                  placeholder="Valor Cartão"
                  className="w-1/2 p-2 border rounded bg-white"
                  value={valorCartao}
                  onChange={(e) => {
                    let v = Number(e.target.value);
                    if (isNaN(v) || v < 0) v = 0;

                    if (v > total) v = total;

                    if (valorPix + v > total) {
                      setValorPix(total - v);
                    }

                    setValorCartao(v);
                  }}
                />
              </div>

              {/* DADOS PIX */}
              {valorPix > 0 && (
                <div className="mt-3">
                  <h4 className="font-semibold">Dados Pix</h4>

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
                    className="w-full p-2 border rounded bg-white"
                    value={chavePix}
                    onChange={(e) => setChavePix(e.target.value)}
                  />
                </div>
              )}

              {/* DADOS CARTÃO */}
              {valorCartao > 0 && (
                <div className="mt-3">
                  <h4 className="font-semibold">Dados Cartão</h4>

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

                  <div className="flex gap-3">
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

              {/* RESUMO */}
              <div className="mt-4 p-3 bg-white rounded border">
                <p className="font-semibold">Resumo</p>

                <p className="text-green-700 font-bold">
                  Pix: R$ {valorPix.toFixed(2)}
                </p>
                <p className="text-blue-700 font-bold">
                  Cartão: R$ {valorCartao.toFixed(2)}
                </p>

                <hr className="my-2" />

                <p>
                  Soma:{" "}
                  <span
                    className={
                      valorPix + valorCartao === total
                        ? "text-green-700 font-bold"
                        : "text-red-700 font-bold"
                    }
                  >
                    R$ {(valorPix + valorCartao).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* BOTÃO */}
          <button
            onClick={confirmarVenda}
            className="cursor-pointer mt-6 bg-rose-600 text-white px-6 py-2 rounded-xl w-full"
          >
            Confirmar Venda
          </button>

          {msg && <p className="mt-4 text-red-800 font-semibold">{msg}</p>}
        </div>
      </div>
    </Header>
  );
}
