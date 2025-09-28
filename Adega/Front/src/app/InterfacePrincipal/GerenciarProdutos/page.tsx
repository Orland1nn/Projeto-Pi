"use client";

import React, { useState } from "react";
import { Package, Users } from "lucide-react";
import { useRouter } from "next/navigation";

type Modo = "adicionar" | "atualizar" | "remover";

export default function GerenciarProdutos() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [tipo, setTipo] = useState("");
  const [modo, setModo] = useState<Modo>("adicionar");

  function limparCampos() {
    setNome("");
    setPreco("");
    setTipo("");
  }

  function trocarModo(novo: Modo) {
    setModo(novo);
    limparCampos();
  }

  // Função para capitalizar cada palavra
  function capitalizeWords(texto: string) {
    return texto.toLowerCase().replace(/\b\w/g, (letra) => letra.toUpperCase());
  }

  function handleNomeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNome(capitalizeWords(e.target.value));
  }

  function handleTipoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTipo(capitalizeWords(e.target.value));
  }

  // Formatar preço automaticamente
  function handlePrecoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valor = e.target.value.replace(/\D/g, ""); // só números
    if (valor) {
      const numero = parseFloat(valor) / 100;
      const formatado = numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      setPreco(formatado);
    } else {
      setPreco("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (modo === "adicionar") {
        await fetch("http://localhost:3000/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome,
            preco: Number(preco.replace(/\D/g, "")) / 100,
            tipo,
          }),
        });
      } else if (modo === "atualizar") {
        await fetch(
          `http://localhost:3000/products/atualizar/${encodeURIComponent(
            nome
          )}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              preco: Number(preco.replace(/\D/g, "")) / 100,
              tipo,
            }),
          }
        );
      } else if (modo === "remover") {
        await fetch(
          `http://localhost:3000/produtos/remover/${encodeURIComponent(nome)}`,
          {
            method: "DELETE",
          }
        );
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      limparCampos();
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col">
      {/* HEADER */}
      <header className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-8 cursor-pointer"
              onClick={() => router.push("/InterfacePrincipal")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-700 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">StockFlow</h1>
                  <p className="text-xs text-gray-500 -mt-1">
                    Gestão de Estoque
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/InterfacePrincipal/Produtos")}
                className="px-4 py-1.5 text-rose-700 text-md rounded-md hover:bg-rose-200 transition-colors cursor-pointer font-bold"
              >
                Produtos
              </button>
              <button
                onClick={() =>
                  router.push("/InterfacePrincipal/GerenciarProdutos")
                }
                className="px-4 py-1.5 text-rose-700 text-md rounded-md hover:bg-rose-200 transition-colors cursor-pointer font-bold"
              >
                Gerenciar
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">Olá, bem-vindo(a)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                  onClick={() => router.push("/Login")}
                >
                  Entrar
                </button>
                <button
                  className="px-3 py-1.5 bg-rose-600 text-white text-sm rounded-md hover:bg-rose-700 transition-colors cursor-pointer"
                  onClick={() => router.push("/")}
                >
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 w-full bg-white flex items-start justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-50 p-6 rounded-lg shadow"
        >
          {/* BOTÕES DE MODO */}
          <div className="flex justify-between mb-6">
            <button
              type="button"
              onClick={() => trocarModo("adicionar")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
                ${
                  modo === "adicionar"
                    ? "bg-rose-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Adicionar
            </button>
            <button
              type="button"
              onClick={() => trocarModo("atualizar")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
                ${
                  modo === "atualizar"
                    ? "bg-rose-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Atualizar
            </button>
            <button
              type="button"
              onClick={() => trocarModo("remover")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
                ${
                  modo === "remover"
                    ? "bg-rose-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Remover
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {modo === "adicionar" && "Cadastrar Produto"}
            {modo === "atualizar" && "Atualizar Produto"}
            {modo === "remover" && "Remover Produto"}
          </h2>

          {/* Campos comuns */}
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

          {modo !== "remover" && (
            <>
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

              <label className="block mb-4">
                <span className="text-gray-700 text-sm">Tipo de Produto</span>
                <input
                  type="text"
                  value={tipo}
                  onChange={handleTipoChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-rose-300 text-black"
                  required
                />
              </label>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700 transition-colors cursor-pointer"
          >
            {modo === "adicionar" && "Salvar"}
            {modo === "atualizar" && "Atualizar"}
            {modo === "remover" && "Remover"}
          </button>
        </form>
      </div>
    </div>
  );
}
