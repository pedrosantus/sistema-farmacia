"use server";

import { cookies } from "next/headers";

export interface Unidade {
  id: string;
  nome: string;
  cnes: string;
  CEP?: number | null;
  rua?: string | null;
  bairro?: string | null;
  numero_edificio?: number | null;
}

export async function buscarTodasUnidadesAction() {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) return { error: "Usuário não autenticado." };

  try {
    const response = await fetch(`${process.env.URL_BACKEND}/unidade`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) return { error: "Erro ao buscar unidades." };

    const data: Unidade[] = await response.json();
    return { data };
  } catch {
    return { error: "Ocorreu um erro inesperado de conexão." };
  }
}

export async function buscarUnidadeAction(id: string) {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) return { error: "Usuário não autenticado." };

  try {
    const response = await fetch(`${process.env.URL_BACKEND}/unidade/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) return { error: "Erro ao buscar unidade." };

    const data: Unidade = await response.json();
    return { data };
  } catch {
    return { error: "Ocorreu um erro inesperado de conexão." };
  }
}

export async function atualizarUnidadeAction(
  id: string,
  dados: Partial<Omit<Unidade, "id" | "cnes">>
) {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) return { error: "Usuário não autenticado." };

  try {
    const response = await fetch(`${process.env.URL_BACKEND}/unidade/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { error: (err as { message?: string }).message || "Erro ao atualizar unidade." };
    }

    const data: Unidade = await response.json();
    return { success: true as const, data };
  } catch {
    return { error: "Ocorreu um erro inesperado de conexão." };
  }
}

export async function deletarUnidadeAction(id: string) {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) return { error: "Usuário não autenticado." };

  try {
    const response = await fetch(`${process.env.URL_BACKEND}/unidade/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return { error: "Erro ao excluir unidade." };
    return { success: true as const };
  } catch {
    return { error: "Ocorreu um erro inesperado de conexão." };
  }
}