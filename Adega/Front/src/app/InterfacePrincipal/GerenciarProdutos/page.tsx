"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/Components/Header";

interface Produto {
  id: number;
  nome: string;
  preco: string;
  imagem: string;
  secao?: Secao;
}

interface Secao {
  id: number;
  nome: string;
}

function formatPriceForInput(priceString: string): string {
  try {
    const numericValue = parseFloat(priceString);
    if (isNaN(numericValue)) return "";
    return numericValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch {
    return "";
  }
}

export default function GerenciarProdutos() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [secaoNome, setSecaoNome] = useState("");
  const [imagem, setImagem] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [secoes, setSecoes] = useState<Secao[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Produto>>({});

  async function fetchProdutos() {
    try {
      const resposta = await fetch("http://localhost:3000/products");
      const dados = await resposta.json();
      setProdutos(dados);
    } catch (erro) {
      console.error("Erro ao buscar produtos:", erro);
    }
  }

  async function fetchSecoes() {
    try {
      const resposta = await fetch("http://localhost:3000/secoes");
      const dados = await resposta.json();
      setSecoes(dados);
    } catch (erro) {
      console.error("Erro ao buscar seções:", erro);
    }
  }

  useEffect(() => {
    fetchProdutos();
    fetchSecoes();
  }, []);

  function limparCampos() {
    setNome("");
    setPreco("");
    setSecaoNome("");
    setImagem("");
  }

  function capitalizeWords(texto: string) {
    return texto.replace(/\p{L}+/gu, (palavra) => {
      const primeira = palavra[0].toUpperCase();
      const resto = palavra.slice(1).toLowerCase();
      return primeira + resto;
    });
  }

  function handleNomeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNome(capitalizeWords(e.target.value));
  }

  function handlePrecoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valorApenasNumeros = e.target.value.replace(/\D/g, "");
    if (valorApenasNumeros) {
      const numero = parseFloat(valorApenasNumeros) / 100;
      setPreco(
        numero.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    } else {
      setPreco("");
    }
  }

  // ====== ADICIONAR PRODUTO ======
  async function handleAdicionar(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (!preco || !secaoNome)
        throw new Error("Campos obrigatórios não preenchidos");

      const precoNumerico = preco.replace(/\./g, "").replace(",", ".");
      const precoFinal = parseFloat(precoNumerico).toFixed(2);

      const resposta = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          preco: precoFinal,
          tipo: secaoNome,
          imagem,
        }),
      });

      if (!resposta.ok) throw new Error("Erro ao adicionar produto");

      setMensagem("Produto adicionado com sucesso!");
      limparCampos();
      await fetchProdutos();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      setMensagem("Erro ao adicionar produto!");
    }
  }

  // ====== EDIÇÃO ======
  function handleEditar(produto: Produto) {
    setEditingProductId(produto.id);
    setEditForm({
      id: produto.id,
      nome: produto.nome,
      preco: formatPriceForInput(produto.preco),
      imagem: produto.imagem,
      secao: produto.secao,
    });
  }

  function handleEditChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    if (name === "preco") {
      const valorApenasNumeros = value.replace(/\D/g, "");
      if (valorApenasNumeros) {
        const numero = parseFloat(valorApenasNumeros) / 100;
        const formatado = numero.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        setEditForm((prev) => ({ ...prev, preco: formatado }));
      } else setEditForm((prev) => ({ ...prev, preco: "" }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSalvar() {
    if (!editingProductId) return;

    try {
      const precoNumerico =
        editForm.preco?.replace(/\./g, "").replace(",", ".") ?? "0";
      const precoFinal = parseFloat(precoNumerico).toFixed(2);

      const payload = {
        nome: editForm.nome,
        preco: precoFinal,
        imagem: editForm.imagem,
        tipo: editForm.secao?.nome,
      };

      const resposta = await fetch(
        `http://localhost:3000/products/atualizar/${editingProductId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!resposta.ok) throw new Error("Erro ao salvar produto");

      setEditingProductId(null);
      setEditForm({});
      await fetchProdutos();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  }

  async function confirmarRemoverProduto(id: number, nomeProduto: string) {
    try {
      const resposta = await fetch(
        `http://localhost:3000/products/remover/${encodeURIComponent(
          nomeProduto
        )}`,
        { method: "DELETE" }
      );

      if (!resposta.ok) throw new Error("Erro ao remover produto");

      setProdutos((prev) => prev.filter((p) => p.id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Erro ao remover produto:", error);
    }
  }

  return (
    <Header>
      <main className="flex-1 w-full flex flex-row bg-white">
        {/* FORM ADIÇÃO */}
        <div className="h-full w-1/2 bg-white flex items-start justify-center p-8">
          <form
            onSubmit={handleAdicionar}
            className="w-full max-w-md bg-gray-50 p-6 rounded-lg shadow"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
              Adicionar Produto
            </h2>

            <label className="block mb-3">
              <span className="text-gray-700 text-sm">Nome do Produto</span>
              <input
                type="text"
                value={nome}
                onChange={handleNomeChange}
                className="mt-1 w-full px-3 py-2 border rounded-md text-black"
                required
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 text-sm">Preço</span>
              <input
                type="text"
                inputMode="numeric"
                value={preco}
                onChange={handlePrecoChange}
                className="mt-1 w-full px-3 py-2 border rounded-md text-black"
                required
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 text-sm">Seção</span>
              <select
                value={secaoNome}
                onChange={(e) => setSecaoNome(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-md text-black"
                required
              >
                <option value="">Selecione uma seção</option>
                {secoes.map((s) => (
                  <option key={s.id} value={s.nome}>
                    {s.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mb-4">
              <span className="text-gray-700 text-sm">Imagem (diretório)</span>
              <input
                type="text"
                value={imagem}
                onChange={(e) => setImagem(e.target.value)}
                placeholder="/imagens/produto.jpg"
                className="mt-1 w-full px-3 py-2 border rounded-md text-black"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700"
            >
              Adicionar
            </button>

            {mensagem && (
              <p className="text-center mt-4 text-black font-semibold">
                {mensagem}
              </p>
            )}
          </form>
        </div>

        {/* LISTA */}
        <section className="h-full w-1/2 bg-gray-50 p-6 overflow-y-auto mt-9 mr-24 rounded-lg shadow max-h-[80vh]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
            Produtos Cadastrados
          </h2>

          <div className="flex flex-col gap-3">
            {produtos.length > 0 ? (
              produtos.map((p) => {
                const isEditing = p.id === editingProductId;

                return (
                  <div
                    key={p.id}
                    className="flex flex-row items-center justify-start gap-3 bg-white p-3 rounded-lg shadow-sm"
                  >
                    <div className="relative w-16 h-16 shrink-0">
                      <Image
                        src={p.imagem || "/imagens/default.jpg"}
                        alt={p.nome}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1 flex items-center">
                      <div className="ml-8 w-32">
                        {isEditing ? (
                          <input
                            type="text"
                            name="nome"
                            value={editForm.nome || ""}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border rounded-md text-gray-800"
                          />
                        ) : (
                          <p className="font-semibold text-gray-800">
                            {p.nome}
                          </p>
                        )}
                      </div>

                      <div className="w-32">
                        {isEditing ? (
                          <select
                            name="secao"
                            value={editForm.secao?.nome || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                secao: { nome: e.target.value } as Secao,
                              }))
                            }
                            className="w-full px-2 py-1 border rounded-md text-gray-600"
                          >
                            <option value="">Selecione</option>
                            {secoes.map((s) => (
                              <option key={s.id} value={s.nome}>
                                {s.nome}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-gray-600">
                            {p.secao?.nome || "—"}
                          </p>
                        )}
                      </div>

                      <div className="w-28">
                        {isEditing ? (
                          <input
                            type="text"
                            name="preco"
                            value={editForm.preco || ""}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border rounded-md text-rose-600 font-bold"
                          />
                        ) : (
                          <p className="text-rose-600 font-bold">
                            R$ {formatPriceForInput(p.preco)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-auto w-28">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSalvar}
                            className="text-white bg-green-500 rounded-md p-2 hover:bg-green-600"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditingProductId(null)}
                            className="text-black bg-gray-300 rounded-md p-2 hover:bg-gray-400"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditar(p)}
                          className="text-black bg-amber-200 rounded-md p-2 hover:bg-amber-300"
                        >
                          Atualizar
                        </button>
                      )}

                      {!isEditing &&
                        (confirmDeleteId === p.id ? (
                          <button
                            onClick={() =>
                              confirmarRemoverProduto(p.id, p.nome)
                            }
                            className="text-white bg-red-500 rounded-md p-2 hover:bg-red-600"
                          >
                            Remover
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(p.id)}
                            className="text-black bg-rose-200 rounded-md p-2 hover:bg-rose-300"
                          >
                            Remover
                          </button>
                        ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500">
                Nenhum produto encontrado.
              </p>
            )}
          </div>
        </section>
      </main>
    </Header>
  );
}
