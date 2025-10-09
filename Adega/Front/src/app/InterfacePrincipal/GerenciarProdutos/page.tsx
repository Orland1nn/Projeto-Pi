"use client";

import React, { useEffect, useState } from "react";
import { Package, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Header from "@/Components/Header";

interface Produto {
  id: number;
  nome: string;
  preco: string;
  tipo: string;
  imagem: string;
}

// Helper para formatar o preço do formato de banco de dados ("10.50") para o formato de input ("10,50")
function formatPriceForInput(priceString: string): string {
  // Remove qualquer coisa que não seja dígito ou ponto/vírgula.
  // Converte para Float (com ponto decimal) e formata para o padrão BR (vírgula decimal).
  try {
    const numericValue = parseFloat(priceString);
    if (isNaN(numericValue)) return "";

    return numericValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true, // Garante que a formatação de milhares funcione
    });
  } catch (e) {
    return "";
  }
}

export default function GerenciarProdutos() {
  const router = useRouter();

  // Estados para Adicionar Produto
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [tipo, setTipo] = useState("");
  const [imagem, setImagem] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null); // controla confirmação

  // ESTADOS PARA EDIÇÃO
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Produto>>({});

  // Função para buscar produtos (refatorada para ser reutilizável)
  async function fetchProdutos() {
    try {
      const resposta = await fetch("http://localhost:3000/products/listar");
      if (!resposta.ok) throw new Error("Erro ao buscar produtos");
      const dados = await resposta.json();
      setProdutos(dados);
    } catch (erro) {
      console.error("Erro ao buscar produtos:", erro);
    }
  }

  // ====== BUSCAR PRODUTOS ======
  useEffect(() => {
    fetchProdutos();
  }, []);

  // ====== FUNÇÕES AUXILIARES ======
  function limparCampos() {
    setNome("");
    setPreco("");
    setTipo("");
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

  function handleTipoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTipo(capitalizeWords(e.target.value));
  }

  // Lógica de formatação de preço para o formulário de Adição
  function handlePrecoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valorApenasNumeros = e.target.value.replace(/\D/g, "");
    if (valorApenasNumeros) {
      const numero = parseFloat(valorApenasNumeros) / 100;
      const formatado = numero.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setPreco(formatado);
    } else {
      setPreco("");
    }
  }

  // ====== FUNÇÕES DE EDIÇÃO ======

  // 1. Inicia o modo de edição
  function handleEditar(produto: Produto) {
    setEditingProductId(produto.id);
    const precoFormatado = formatPriceForInput(produto.preco);
    setEditForm({
      id: produto.id,
      nome: produto.nome,
      preco: precoFormatado,
      tipo: produto.tipo,
      imagem: produto.imagem, // Manter o campo de imagem para o payload
    });
  }

  // 2. Lida com a mudança nos inputs de edição
  function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === "preco") {
      // Reutiliza a lógica de formatação de preço
      const valorApenasNumeros = value.replace(/\D/g, "");
      let formattedValue = "";

      if (valorApenasNumeros) {
        const numero = parseFloat(valorApenasNumeros) / 100;
        formattedValue = numero.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
      setEditForm((prev) => ({ ...prev, [name]: formattedValue }));
    } else if (name === "nome" || name === "tipo") {
      // Capitaliza nome e tipo
      setEditForm((prev) => ({ ...prev, [name]: capitalizeWords(value) }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  // 3. Salva as alterações
  async function handleSalvar() {
    if (
      !editingProductId ||
      !editForm.nome ||
      !editForm.tipo ||
      !editForm.preco
    ) {
      setMensagem("Por favor, preencha nome, tipo e preço para salvar.");
      return;
    }

    try {
      // Converte o preço formatado (ex: "1.234,56") para o formato numérico da API (ex: "1234.56")
      const precoNumerico = editForm.preco
        .replace(/\./g, "") // Remove pontos (milhares)
        .replace(",", "."); // Substitui vírgula por ponto (decimal)
      const precoFinal = parseFloat(precoNumerico).toFixed(2);

      const payload = {
        nome: editForm.nome,
        preco: precoFinal,
        tipo: editForm.tipo,
        imagem: editForm.imagem,
      };

      const resposta = await fetch(
        `http://localhost:3000/products/atualizar/${editingProductId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!resposta.ok) throw new Error("Erro ao salvar o produto");

      setEditingProductId(null); // Sai do modo de edição
      setEditForm({}); // Limpa o estado de edição

      await fetchProdutos(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      setMensagem("Erro ao salvar produto!");
    }
  }

  // ====== ADICIONAR PRODUTO ======
  async function handleAdicionar(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (!preco) throw new Error("Preço inválido");

      const precoNumerico = preco.replace(/\./g, "").replace(",", ".");
      const precoFinal = parseFloat(precoNumerico).toFixed(2);

      const resposta = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          preco: precoFinal,
          tipo,
          imagem,
        }),
      });

      if (!resposta.ok) throw new Error("Erro ao adicionar produto");

      setMensagem("Produto adicionado com sucesso!");
      limparCampos();

      await fetchProdutos(); // Recarregar produtos
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      setMensagem("Erro ao adicionar produto!");
    }
  }

  // ====== REMOVER PRODUTO ======
  async function confirmarRemoverProduto(id: number, nomeProduto: string) {
    try {
      const resposta = await fetch(
        `http://localhost:3000/products/remover/${encodeURIComponent(
          nomeProduto
        )}`,
        { method: "DELETE" }
      );

      if (!resposta.ok) throw new Error("Erro ao remover produto");

      // Atualiza a lista de produtos local
      setProdutos((prev) => prev.filter((p) => p.id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      setMensagem(`Erro ao remover produto "${nomeProduto}"`);
    }
  }

  // ====== RENDER ======
  return (
    <Header>
      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 w-full flex flex-row bg-white">
        {/* FORMULÁRIO DE ADIÇÃO */}
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
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-rose-300 text-black"
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
                placeholder="R$ 0,00"
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-rose-300 text-black"
                required
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 text-sm">Tipo de Produto</span>
              <input
                type="text"
                value={tipo}
                onChange={handleTipoChange}
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-rose-300 text-black"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="text-gray-700 text-sm">Imagem (diretório)</span>
              <input
                type="text"
                value={imagem}
                onChange={(e) => setImagem(e.target.value)}
                placeholder="/imagens/produto.jpg"
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-rose-300 text-black"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700 transition-colors cursor-pointer"
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

        {/* LISTA DE PRODUTOS */}
        <section className="h-full w-1/2 bg-gray-50 p-6 overflow-y-auto mt-9 mr-24 rounded-lg shadow max-h-[80vh]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
            Produtos Cadastrados
          </h2>

          <div className="flex flex-col gap-3">
            {produtos.length > 0 ? (
              produtos.map((p) => {
                const isEditing = p.id === editingProductId;
                const currentEdit = isEditing ? editForm : {};

                return (
                  <div
                    key={p.id}
                    className="flex flex-row items-center justify-start gap-3 bg-white p-3 rounded-lg shadow-sm"
                  >
                    {/* Imagem */}
                    <div className="relative w-16 h-16 shrink-0">
                      <Image
                        src={p.imagem || "/imagens/default.jpg"}
                        alt={p.nome}
                        fill
                        className="object-cover rounded-md"
                        sizes="64px"
                        priority
                      />
                    </div>

                    {/* Campos de Informação (Leitura ou Edição) */}
                    <div className="flex-1 flex items-center">
                      {/* Nome */}
                      <div className=" ml-8 w-32 shrink-0">
                        {isEditing ? (
                          <input
                            type="text"
                            name="nome"
                            value={currentEdit.nome || ""}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-gray-800 font-semibold focus:ring-rose-300 focus:border-rose-300"
                            required
                          />
                        ) : (
                          <p className="font-semibold text-gray-800">
                            {p.nome}
                          </p>
                        )}
                      </div>

                      {/* Tipo */}
                      <div className="w-32 shrink-0">
                        {isEditing ? (
                          <input
                            type="text"
                            name="tipo"
                            value={currentEdit.tipo || ""}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-gray-600 focus:ring-rose-300 focus:border-rose-300"
                            required
                          />
                        ) : (
                          <p className="text-gray-600">{p.tipo}</p>
                        )}
                      </div>

                      {/* Preço */}
                      <div className="w-28 shrink-0">
                        {isEditing ? (
                          <input
                            type="text"
                            name="preco"
                            inputMode="numeric"
                            value={currentEdit.preco || ""}
                            onChange={handleEditChange}
                            placeholder="0,00"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-rose-600 font-bold focus:ring-rose-300 focus:border-rose-300"
                            required
                          />
                        ) : (
                          <p className="text-rose-600 font-bold">
                            R$ {formatPriceForInput(p.preco)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col gap-2 ml-auto w-28 shrink-0">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSalvar}
                            className="text-white font-semibold bg-green-500 rounded-md p-2 cursor-pointer hover:bg-green-600 transition-colors"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditingProductId(null)}
                            className="text-black font-semibold bg-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-400 transition-colors"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditar(p)}
                          className="text-black font-semibold bg-amber-200 rounded-md p-2 cursor-pointer hover:bg-amber-300 transition-colors"
                        >
                          Atualizar
                        </button>
                      )}

                      {/* Botão Remover (Mantido) */}
                      {!isEditing &&
                        (confirmDeleteId === p.id ? (
                          <button
                            onClick={() =>
                              confirmarRemoverProduto(p.id, p.nome)
                            }
                            className="text-white font-semibold bg-red-500 rounded-md p-2 cursor-pointer hover:bg-red-600 transition-colors"
                          >
                            Remover
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(p.id)}
                            className="text-black font-semibold bg-rose-200 rounded-md p-2 cursor-pointer hover:bg-rose-300 transition-colors"
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
