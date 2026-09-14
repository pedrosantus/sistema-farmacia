"use client"

import { useState } from "react"
import { X, Plus, Edit, Trash2 } from "lucide-react"
import Sidebar from "@/components/sidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/app/configuracoes/components/data-table"
import { columns } from "@/app/configuracoes/components/columns"
import ModalEditarUnidade from "@/app/configuracoes/components/modal-editar-unidade"
import ModalEditarUsuario from "@/app/configuracoes/components/modal-editar-usuario"
import PopupDeleteUsuario from "@/app/configuracoes/components/popup-deletar-usuario"
import PopupDeleteUnidade from "@/app/configuracoes/components/popup-deletar-unidade"
import { Usuario } from "@/actions/usuario"
import { Unidade } from "@/actions/unidade"

type UserInfo = {
    id?: string
    id_unidade: string
    unidade: string
    cnes: string
    role?: string
}

export default function ConfiguracoesClient({
    usuariosIniciais = [],
    unidadeInicial,
    userInfo,
}: {
    usuariosIniciais: Usuario[]
    unidadeInicial: Unidade | null
    userInfo: UserInfo
}) {
    const [unidade, setUnidade] = useState<Unidade | null>(unidadeInicial)
    const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciais)
    const [usuarioAlvo, setUsuarioAlvo] = useState<Usuario | null>(null)

    const [isEditUnidadeOpen, setIsEditUnidadeOpen] = useState(false)
    const [isDeleteUnidadeOpen, setIsDeleteUnidadeOpen] = useState(false)
    const [isEditUsuarioOpen, setIsEditUsuarioOpen] = useState(false)
    const [isDeleteUsuarioOpen, setIsDeleteUsuarioOpen] = useState(false)

    // ── Filtro ──────────────────────────────────────────────────────────────
    const usuariosUnidade = usuarios.filter(
        (u) => u.id_unidade_pertecente === userInfo.id_unidade
    )

    // ── Handlers: Unidade ────────────────────────────────────────────────────
    const handleSucessoUnidade = (atualizada: Unidade) => {
        setUnidade(atualizada)
    }

    // ── Handlers: Usuário ────────────────────────────────────────────────────
    const handleEditarUsuario = (usuario: Usuario) => {
        setUsuarioAlvo(usuario)
        setIsEditUsuarioOpen(true)
    }

    const handleDeletarUsuario = (usuario: Usuario) => {
        setUsuarioAlvo(usuario)
        setIsDeleteUsuarioOpen(true)
    }

    const handleSucessoEdicaoUsuario = (atualizado: Usuario) => {
        setUsuarios((prev) => prev.map((u) => (u.id === atualizado.id ? atualizado : u)))
    }

    const handleSucessoDeleteUsuario = (id: string) => {
        setUsuarios((prev) => prev.filter((u) => u.id !== id))
    }

    const handleFecharEditUsuario = () => setIsEditUsuarioOpen(false)
    const handleFecharDeleteUsuario = () => setIsDeleteUsuarioOpen(false)
    const handleFecharEditUnidade = () => setIsEditUnidadeOpen(false)
    const handleFecharDeleteUnidade = () => setIsDeleteUnidadeOpen(false)

    // ── Dados da unidade para exibição ───────────────────────────────────────
    const dadosUnidade = [
        { label: "Nome", value: unidade?.nome ?? userInfo.unidade ?? "—" },
        { label: "CNES", value: unidade?.cnes ?? userInfo.cnes ?? "—" },
        { label: "CEP", value: unidade?.CEP ?? "—" },
        { label: "Rua", value: unidade?.rua ?? "—" },
        { label: "Bairro", value: unidade?.bairro ?? "—" },
        { label: "Número", value: unidade?.numero_edificio ?? "—" },
    ]

    return (
        <main className="sm:ml-56 min-h-screen bg-white">
            {/* Cabeçalho */}
            <div className="relative flex items-center bg-gray-50 border-b border-gray-200 p-4 h-16">
                <Sidebar />
                <h1 className="text-2xl font-semibold text-[#003967] whitespace-nowrap">
                    Configurações
                </h1>
            </div>

            <div className="relative flex flex-col p-4 gap-6">
                {/* ── Card Unidade ──────────────────────────────────────────────── */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-lg text-[#003967]">Dados da Unidade</CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1.5 border-[#1976d2] text-[#1976d2] hover:bg-blue-50"
                                onClick={() => setIsEditUnidadeOpen(true)}
                            >
                                <Edit className="w-4 h-4" />
                                Editar
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1.5 border-red-500 text-red-600 hover:bg-red-50"
                                onClick={() => setIsDeleteUnidadeOpen(true)}
                            >
                                <Trash2 className="w-4 h-4" />
                                Excluir
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                            {dadosUnidade.map(({ label, value }) => (
                                <div key={label}>
                                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        {label}
                                    </dt>
                                    <dd className="mt-0.5 font-medium text-slate-800">{String(value)}</dd>
                                </div>
                            ))}
                        </dl>
                    </CardContent>
                </Card>

                {/* ── Card Usuários ─────────────────────────────────────────────── */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-lg text-[#003967]">Usuários da Unidade</CardTitle>
                        <Button
                            asChild
                            className="bg-[#1976d2] hover:bg-[#1565c0] text-white h-9 px-4 rounded-lg font-medium flex gap-2 items-center shadow-sm transition-colors"
                        >
                            <Link href="/cadastro-usuario">
                                <Plus className="w-4 h-4" />
                                Novo Usuário
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={usuariosUnidade}
                            columns={columns}
                            onEditUsuario={handleEditarUsuario}
                            onDeleteUsuario={handleDeletarUsuario}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* ── Modal: Editar Unidade ────────────────────────────────────────── */}
            {isEditUnidadeOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                    onClick={handleFecharEditUnidade}
                >
                    <div
                        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl relative max-h-[90vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleFecharEditUnidade}
                            className="absolute top-4 right-5 text-gray-400 hover:text-gray-700 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="p-7 overflow-y-auto">
                            {unidade && (
                                <ModalEditarUnidade
                                    unidade={unidade}
                                    onClose={handleFecharEditUnidade}
                                    onSucesso={handleSucessoUnidade}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal: Excluir Unidade ───────────────────────────────────────── */}
            {isDeleteUnidadeOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                    onClick={handleFecharDeleteUnidade}
                >
                    <div
                        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl relative max-h-[90vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleFecharDeleteUnidade}
                            className="absolute top-4 right-5 text-gray-400 hover:text-gray-700 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="p-7">
                            {unidade && (
                                <PopupDeleteUnidade
                                    unidade={unidade}
                                    onClose={handleFecharDeleteUnidade}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal: Editar Usuário ────────────────────────────────────────── */}
            {isEditUsuarioOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                    onClick={handleFecharEditUsuario}
                >
                    <div
                        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl relative max-h-[90vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleFecharEditUsuario}
                            className="absolute top-4 right-5 text-gray-400 hover:text-gray-700 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="p-7 overflow-y-auto">
                            {usuarioAlvo && (
                                <ModalEditarUsuario
                                    usuario={usuarioAlvo}
                                    onClose={handleFecharEditUsuario}
                                    onSucesso={handleSucessoEdicaoUsuario}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal: Remover Usuário ───────────────────────────────────────── */}
            {isDeleteUsuarioOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                    onClick={handleFecharDeleteUsuario}
                >
                    <div
                        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl relative max-h-[90vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleFecharDeleteUsuario}
                            className="absolute top-4 right-5 text-gray-400 hover:text-gray-700 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="p-7">
                            {usuarioAlvo && (
                                <PopupDeleteUsuario
                                    usuario={usuarioAlvo}
                                    onClose={handleFecharDeleteUsuario}
                                    onSucesso={handleSucessoDeleteUsuario}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}