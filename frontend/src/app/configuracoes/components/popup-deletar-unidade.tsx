"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { deletarUnidadeAction, Unidade } from "@/actions/unidade"

interface PopupDeleteUnidadeProps {
    unidade: Unidade
    onClose?: () => void
}

export default function PopupDeleteUnidade({ unidade, onClose }: PopupDeleteUnidadeProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sucesso, setSucesso] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSucesso(false)

        try {
            const result = await deletarUnidadeAction(unidade.id)

            if ("error" in result) {
                setError(result.error ?? "Erro ao excluir unidade.")
            } else {
                setSucesso(true)
                setTimeout(() => {
                    router.push("/")
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
                <h2 className="text-2xl font-bold text-slate-900">
                    Excluir unidade?
                </h2>
                <p className="text-sm text-gray-500">
                    Tem certeza que deseja excluir permanentemente a unidade{" "}
                    <strong>{unidade.nome}</strong>? Todos os dados vinculados serão
                    removidos. Esta ação não pode ser desfeita.
                </p>
            </div>

            {error && (
                <div className="p-2 rounded-md bg-red-50 border border-red-200">
                    <span className="text-red-700 text-sm font-medium">{error}</span>
                </div>
            )}
            {sucesso && (
                <div className="p-2 rounded-md bg-green-50 border border-green-200">
                    <span className="text-green-700 text-sm font-medium">
                        ✓ Unidade excluída com sucesso! Redirecionando...
                    </span>
                </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-100">
                {onClose && (
                    <Button
                        type="button"
                        onClick={onClose}
                        className="flex-1 h-11 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors text-sm font-semibold"
                        disabled={loading}
                    >
                        Não, cancelar
                    </Button>
                )}
                <Button
                    type="submit"
                    className={`${onClose ? "flex-1" : "w-full"} h-11 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors text-sm font-semibold shadow-sm disabled:opacity-60`}
                    disabled={loading}
                >
                    {loading ? "Excluindo..." : "Sim, excluir unidade"}
                </Button>
            </div>
        </form>
    )
}