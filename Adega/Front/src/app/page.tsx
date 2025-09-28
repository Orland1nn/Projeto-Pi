"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  nome: string;
  email: string;
  senha: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export default function HomePage() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    senha: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const registerUser = async (userData: FormData): Promise<ApiResponse> => {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao registrar usuário");
      }

      return data;
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Enviando dados do usuário:", formData);

      const result = await registerUser(formData);

      console.log("Resposta da API:", result);

      setFormData({ nome: "", email: "", senha: "" });

      router.push("/InterfacePrincipal");
    } catch (error: unknown) {
      console.error("Erro ao cadastrar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/Login");
  };

  const handleReset = () => {
    setFormData({ nome: "", email: "", senha: "" });
    console.log("Formulário limpo");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "2rem",
            color: "#1f2937",
          }}
        >
          Criar Conta
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Nome completo
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              placeholder="Digite seu nome completo"
              required
              disabled={isLoading}
              style={{
                color: "black",
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
                backgroundColor: isLoading ? "#f3f4f6" : "white",
                cursor: isLoading ? "not-allowed" : "text",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              E-mail
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={isLoading}
              style={{
                color: "black",
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
                backgroundColor: isLoading ? "#f3f4f6" : "white",
                cursor: isLoading ? "not-allowed" : "text",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Senha
            </label>
            <input
              type="password"
              value={formData.senha}
              onChange={(e) => handleInputChange("senha", e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              disabled={isLoading}
              style={{
                color: "black",
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
                backgroundColor: isLoading ? "#f3f4f6" : "white",
                cursor: isLoading ? "not-allowed" : "text",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: isLoading ? "#9ca3af" : "#22c55e",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              marginTop: "1rem",
              transition: "background-color 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {isLoading ? (
              <>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #ffffff40",
                    borderTop: "2px solid #ffffff",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Cadastrando...
              </>
            ) : (
              "Criar Conta"
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "transparent",
              color: isLoading ? "#9ca3af" : "#6b7280",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "1rem",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            Limpar Formulário
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.875rem",
            color: "#6b7280",
          }}
        >
          Já tem uma conta?{" "}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            style={{
              color: isLoading ? "#9ca3af" : "#22c55e",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
            }}
          >
            Fazer login
          </button>
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
