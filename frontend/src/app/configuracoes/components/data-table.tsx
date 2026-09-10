"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { Usuario } from "@/actions/usuario"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onEditUsuario?: (usuario: Usuario) => void
    onDeleteUsuario?: (usuario: Usuario) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onEditUsuario,
    onDeleteUsuario,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: { sorting },
        meta: {
            handleEditUsuario: onEditUsuario,
            handleDeleteUsuario: onDeleteUsuario,
        },
    })

    return (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table className="min-w-[640px] md:min-w-0">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className="bg-[#003967] hover:bg-[#003967] border-b-0"
                        >
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="text-white font-bold text-xs uppercase tracking-wide"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-4">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                Nenhum usuário encontrado nesta unidade.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}