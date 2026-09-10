"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { atualizarUnidadeAction, Unidade } from "@/actions/unidade"

interface ModalEditarUnidadeProps {
    unidade: Unidade
    onClose?: () => void
    onSucesso?: (atualizada: Unidade) => void
}

export default function ModalEditarUnidade({ unidade, onClose, onSucesso }: ModalEditarUnidadeProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sucesso, setSucesso] = useState(false)

    const [formData, setFormData] = useState({
        nome: unidade.nome ?? "",
        CEP: unidade.CEP != null ? String(unidade.CEP) : "",
        rua: unidade.rua ?? "",
        bairro: unidade.bairro ?? "",
        numero_edificio: unidade.numero_edificio != null ? String(unidade.numero_edificio) : "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSucesso(false)
        setLoading(true)

        const dados: Partial<Omit<Unidade, "id" | "cnes">> = {}
        if (formData.nome) dados.nome = formData.nome
        if (formData.CEP) dados.CEP = Number(formData.CEP)
        if (formData.rua) dados.rua = formData.rua
        if (formData.bairro) dados.bairro = formData.bairro
        if (formData.numero_edificio) dados.numero_edificio = Number(formData.numero_edificio)

        try {
            const result = await atualizarUnidadeAction(unidade.id, dados)

            if ("error" in result) {
                setError(result.error ?? "Erro ao atualizar unidade.")
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
                <h2 className="text-2xl font-bold text-slate-900">Editar Unidade</h2>
                <p className="text-sm text-gray-500">
                    Atualize os dados cadastrais desta unidade de saúde.
                </p>
            </div>

            {error && (
                <div className="p-2 rounded-md bg-red-50 border border-red-200">
                    <span className="text-red-700 text-sm font-medium">{error}</span>
                </div>
            )}
            {sucesso && (
                <div className="p-2 rounded-md bg-green-50 border border-green-200">
                    <span className="text-green-700 text-sm font-medium">✓ Unidade atualizada com sucesso!</span>
                </div>
            )}

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800">Identificação</h3>
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
                    <Label className="text-sm font-semibold text-slate-700">CNES</Label>
                    <Input
                        value={unidade.cnes}
                        disabled
                        className="h-10 text-sm rounded-lg border-gray-300 bg-gray-50 text-gray-400"
                    />
                    <p className="text-xs text-gray-400">O CNES não pode ser alterado.</p>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800">Endereço</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">CEP</Label>
                        <Input
                            name="CEP"
                            type="number"
                            placeholder="00000000"
                            value={formData.CEP}
                            onChange={handleChange}
                            className="h-10 text-sm rounded-lg border-gray-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Número</Label>
                        <Input
                            name="numero_edificio"
                            type="number"
                            placeholder="Número do edifício"
                            value={formData.numero_edificio}
                            onChange={handleChange}
                            className="h-10 text-sm rounded-lg border-gray-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Rua</Label>
                        <Input
                            name="rua"
                            placeholder="Nome da rua"
                            value={formData.rua}
                            onChange={handleChange}
                            className="h-10 text-sm rounded-lg border-gray-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Bairro</Label>
                        <Input
                            name="bairro"
                            placeholder="Nome do bairro"
                            value={formData.bairro}
                            onChange={handleChange}
                            className="h-10 text-sm rounded-lg border-gray-300"
                        />
                    </div>
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