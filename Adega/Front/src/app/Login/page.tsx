"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!email.trim() || !senha.trim()) {
      setErro("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch("/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/Interface");
      } else {
        setErro(data.message || "Credenciais inválidas!");
      }
    } catch (error) {
      console.error("Erro ao logar:", error);
      setErro("Erro ao conectar com o servidor. Tente novamente!");
    }
  };

  const handleCadastrar = () => {
    router.push("/");
  };

  return (
    <div className="h-screen w-screen bg-white flex flex-col items-center justify-center">
      <main className="bg-gray-50 h-3/6 w-120 flex flex-col items-center p-5 border rounded-xl shadow-md">
        <h1 className="font-extrabold text-2xl text-black">Login</h1>
        <div className="w-16 h-1 bg-green-500 rounded-full my-2"></div>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="w-full flex flex-col items-center"
        >
          <div className="w-4/5 mb-4 mt-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-black border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div className="w-4/5 mb-6">
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>
            <input
              type="password"
              id="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full text-black border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div className="flex flex-row w-4/5 gap-4 justify-between">
            <button
              type="submit"
              className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={handleCadastrar}
              className="cursor-pointer bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cadastrar
            </button>
          </div>
        </form>

        {erro && (
          <h3 className="text-red-600 font-bold mt-3 text-blac">{erro}</h3>
        )}
      </main>
    </div>
  );
}
