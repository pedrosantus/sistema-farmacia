"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Trash2 } from "lucide-react"
import { Usuario } from "@/actions/usuario"

const ROLE_LABELS: Record<string, string> = {
    USER: "Usuário",
    MANAGER: "Gerente",
    ADMIN: "Admin",
}

const ROLE_COLORS: Record<string, string> = {
    USER: "bg-gray-100 text-gray-700",
    MANAGER: "bg-blue-100 text-blue-700",
    ADMIN: "bg-purple-100 text-purple-700",
}

declare module "@tanstack/react-table" {
    interface TableMeta<TData extends unknown> {
        handleEditUsuario?: (usuario: Usuario) => void
        handleDeleteUsuario?: (usuario: Usuario) => void
    }
}

export const columns: ColumnDef<Usuario>[] = [
    {
        accessorKey: "nome",
        header: ({ column }) => (
            <div className="flex items-center gap-2">
                <span>NOME</span>
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-white/20 p-1 rounded"
                >
                    <ArrowUpDown className="h-4 w-4" />
                </button>
            </div>
        ),
        cell: ({ row }) => (
            <div>
                <div className="font-semibold text-[#003967]">{row.original.nome}</div>
                <div className="text-xs text-gray-500 mt-0.5">{row.original.email}</div>
            </div>
        ),
    },
    {
        accessorKey: "atribuicao",
        header: "ATRIBUIÇÃO",
        cell: ({ row }) => <span className="text-sm">{row.original.atribuicao || "—"}</span>,
    },
    {
        accessorKey: "role",
        header: "PAPEL",
        cell: ({ row }) => {
            const role = row.original.role
            return (
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${ROLE_COLORS[role] ?? "bg-gray-100 text-gray-700"}`}
                >
                    {ROLE_LABELS[role] ?? role}
                </span>
            )
        },
    },
    {
        id: "editar",
        header: "EDITAR",
        cell: ({ row, table }) => (
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation()
                    table.options.meta?.handleEditUsuario?.(row.original)
                }}
                className="text-[#1976d2] hover:text-blue-800 transition-colors p-1.5 rounded-md hover:bg-blue-100"
                title="Editar"
            >
                <Edit className="w-5 h-5" />
            </button>
        ),
    },
    {
        id: "remover",
        header: "REMOVER",
        cell: ({ row, table }) => (
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation()
                    table.options.meta?.handleDeleteUsuario?.(row.original)
                }}
                className="text-red-600 hover:text-red-800 transition-colors p-1.5 rounded-md hover:bg-red-100"
                title="Remover"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        ),
    },
]