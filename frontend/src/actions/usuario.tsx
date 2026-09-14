"use server";

import { cookies } from "next/headers";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  atribuicao: string;
  comprovante: string;
  role: "USER" | "MANAGER" | "ADMIN";
  id_unidade_pertecente: string;
}

export interface CreateUsuarioData {
  cpf: string;
  nome: string;
  email: string;
  password?: string;
  atribuicao: string;
  comprovante: string;
  id_unidade: string;
}

export async function criarUsuarioAction(dados: CreateUsuarioData) {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) return { error: "Usuário não autenticado." };

  try {
    const response = await fetch(`${process.env.URL_BACKEND}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { error: (err as { message?: string | string[] }).message || "Erro ao criar usuário." };
    }

    const data: Usuario = await response.json();
    return { success: true as const, data };
  } catch {
    return { error: "Ocorreu um erro inesperado de conexão." };
  }
}

export async function buscarUsuariosAction() {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) return { error: "Usuário não autenticado." };

  try {
    const response = await fetch(`${process.env.URL_BACKEND}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) return { error: "Erro ao buscar usuários." };

    const data: Usuario[] = await response.json();
    return { data };
  } catch {
    return { error: "Ocorreu um erro inesperado de conexão." };
  }
}

export async function atualizarUsuarioAction(
  id_usuario: string,
  dados: {
    nome?: string;
    email?: string;
    role?: string;
    comprovante?: string;
    password?: string;
  }
) {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) return { error: "Usuário não autenticado." };

  try {
    const response = await fetch(`${process.env.URL_BACKEND}/user/${id_usuario}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { error: (err as { message?: string }).message || "Erro ao atualizar usuário." };
    }

    const data: Usuario = await response.json();
    return { success: true as const, data };
  } catch {
    return { error: "Ocorreu um erro inesperado de conexão." };
  }
}

export async function deletarUsuarioAction(id_usuario: string) {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) return { error: "Usuário não autenticado." };

  try {
    const response = await fetch(`${process.env.URL_BACKEND}/user/${id_usuario}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return { error: "Erro ao remover usuário." };
    return { success: true as const };
  } catch {
    return { error: "Ocorreu um erro inesperado de conexão." };
  }
}