"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { atualizarUsuarioAction, Usuario } from "@/actions/usuario"

interface ModalEditarUsuarioProps {
    usuario: Usuario
    onClose?: () => void
    onSucesso?: (atualizado: Usuario) => void
}

export default function ModalEditarUsuario({ usuario, onClose, onSucesso }: ModalEditarUsuarioProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sucesso, setSucesso] = useState(false)

    const [formData, setFormData] = useState({
        nome: usuario.nome ?? "",
        email: usuario.email ?? "",
        role: usuario.role ?? "USER",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSucesso(false)
        setLoading(true)

        // Só envia role se foi alterado — evita ForbiddenException no backend
        // para usuários não-admin que apenas editam nome/email
        const payload: { nome: string; email: string; role?: string } = {
            nome: formData.nome,
            email: formData.email,
        }
        if (formData.role !== usuario.role) {
            payload.role = formData.role
        }

        try {
            const result = await atualizarUsuarioAction(usuario.id, payload)

            if ("error" in result) {
                setError(result.error ?? "Erro ao atualizar usuário.")
            } else {
                setSucesso(true)
                setTimeout(() => {
                    onSucesso?.(result.data)
                    onClose?.()
                }, 1500)
            }
        } catch {
            setError("Ocorreu um erro inesperado ao conectar com o servidor.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white grid gap-y-5">
            <div className="flex flex-col gap-2 pb-2 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-slate-900">Editar Usuário</h2>
                <p className="text-sm text-gray-500">
                    Atualize os dados de <strong>{usuario.nome}</strong>.
                </p>
            </div>

            {error && (
                <div className="p-2 rounded-md bg-red-50 border border-red-200">
                    <span className="text-red-700 text-sm font-medium">{error}</span>
                </div>
            )}
            {sucesso && (
                <div className="p-2 rounded-md bg-green-50 border border-green-200">
                    <span className="text-green-700 text-sm font-medium">✓ Usuário atualizado com sucesso!</span>
                </div>
            )}

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800">Dados Pessoais</h3>
                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">
                        Nome <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        name="nome"
                        required
                        value={formData.nome}
                        onChange={handleChange}
                        className="h-10 text-sm rounded-lg border-gray-300"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">
                        Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="h-10 text-sm rounded-lg border-gray-300"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800">Permissões</h3>
                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Papel</Label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
                    >
                        <option value="USER">Usuário</option>
                        <option value="MANAGER">Gerente</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    <p className="text-xs text-gray-400">
                        Alterar o papel requer permissão de administrador.
                    </p>
                </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
                {onClose && (
                    <Button
                        type="button"
                        onClick={onClose}
                        className="flex-1 h-11 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors text-sm font-semibold"
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                )}
                <Button
                    type="submit"
                    className={`${onClose ? "flex-1" : "w-full"} h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm font-semibold shadow-sm disabled:opacity-60`}
                    disabled={loading}
                >
                    {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
            </div>
        </form>
    )
}