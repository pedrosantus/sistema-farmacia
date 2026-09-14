"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    criarUsuarioAction,
    CreateUsuarioData
} from "@/actions/usuario";
import { buscarTodasUnidadesAction, Unidade } from "@/actions/unidade";
import { maskCPF } from "@/utils/formatters";

export default function CadastroUsuario() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [unidades, setUnidades] = useState<Unidade[]>([]);

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        cpf: "",
        password: "",
        confirmarPassword: "",
        atribuicao: "",
        comprovante: "",
        id_unidade: "",
    });

    useEffect(() => {
        const fetchUnidades = async () => {
            const result = await buscarTodasUnidadesAction();
            if (result.data) {
                setUnidades(result.data);
            } else {
                console.error("Não foi possível carregar as unidades:", result.error);
            }
        };

        fetchUnidades();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "cpf") formattedValue = maskCPF(value);

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (formData.password !== formData.confirmarPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setLoading(true);

        const payload: CreateUsuarioData = {
            nome: formData.nome,
            email: formData.email,
            cpf: formData.cpf.replace(/\D/g, ""),
            password: formData.password,
            atribuicao: formData.atribuicao,
            comprovante: formData.comprovante,
            id_unidade: formData.id_unidade,
        };

        try {
            const result = await criarUsuarioAction(payload);

            if (result.error) {
                const errorMsg = Array.isArray(result.error) ? result.error.join(', ') : result.error;
                setError(errorMsg);
            } else {
                alert("Usuário cadastrado com sucesso!");
                router.push("/configuracoes");
            }
        } catch (err) {
            setError("Ocorreu um erro inesperado ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="sm:ml-56 min-h-screen bg-gray-50 flex flex-col">
            <div className="relative flex items-center bg-white border-b border-gray-200 p-4 h-16 shrink-0 shadow-sm">
                <Sidebar />
                <h1 className="text-2xl font-semibold text-[#003967] whitespace-nowrap">Cadastro de Usuário</h1>
            </div>

            <div className="p-4 md:p-8 pb-24 flex-1">
                <div className="max-w-4xl mx-auto mb-10">
                    <Card className="shadow-lg border-none ring-1 ring-gray-100 overflow-hidden bg-white rounded-md">
                        <div className="h-2 w-full bg-[#1976d2]"></div>
                        <CardHeader className="pb-6 pt-6">
                            <CardTitle className="text-[#003967] text-2xl font-bold">Novo Usuário</CardTitle>
                            <CardDescription className="text-base text-gray-500 mt-2">
                                Preencha as informações do novo usuário (acesso administrativo).
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Exibição de Erros do Backend */}
                                {error && (
                                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    {/* Nome */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="nome" className="text-gray-800 font-medium">Nome Completo <span className="text-red-500">*</span></Label>
                                        <Input id="nome" name="nome" placeholder="Digite o nome completo do usuário" required value={formData.nome} onChange={handleChange} className="border-gray-300 h-11 focus-visible:ring-[#1976d2]" />
                                    </div>

                                    {/* E-mail */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-800 font-medium">E-mail <span className="text-red-500">*</span></Label>
                                        <Input id="email" name="email" type="email" placeholder="seu@email.com" required value={formData.email} onChange={handleChange} className="border-gray-300 h-11 focus-visible:ring-[#1976d2]" />
                                    </div>

                                    {/* CPF */}
                                    <div className="space-y-2">
                                        <Label htmlFor="cpf" className="text-gray-800 font-medium">CPF <span className="text-red-500">*</span></Label>
                                        <Input id="cpf" name="cpf" placeholder="000.000.000-00" required value={formData.cpf} onChange={handleChange} className="border-gray-300 h-11 focus-visible:ring-[#1976d2]" />
                                    </div>

                                    {/* Senha */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-gray-800 font-medium">Senha <span className="text-red-500">*</span></Label>
                                        <Input id="password" name="password" type="password" placeholder="Digite a senha" required value={formData.password} onChange={handleChange} className="border-gray-300 h-11 focus-visible:ring-[#1976d2]" />
                                    </div>

                                    {/* Confirmar Senha */}
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmarPassword" className="text-gray-800 font-medium">Confirmar Senha <span className="text-red-500">*</span></Label>
                                        <Input id="confirmarPassword" name="confirmarPassword" type="password" placeholder="Confirme a senha" required value={formData.confirmarPassword} onChange={handleChange} className="border-gray-300 h-11 focus-visible:ring-[#1976d2]" />
                                    </div>

                                    {/* Atribuição */}
                                    <div className="space-y-2">
                                        <Label htmlFor="atribuicao" className="text-gray-800 font-medium">Atribuição <span className="text-red-500">*</span></Label>
                                        <select
                                            id="atribuicao"
                                            name="atribuicao"
                                            required
                                            value={formData.atribuicao}
                                            onChange={handleChange}
                                            className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1976d2] focus-visible:ring-offset-2 text-gray-700"
                                        >
                                            <option value="" disabled>Selecione uma atribuição</option>
                                            <option value="médico">Médico</option>
                                            <option value="enfermeiro">Enfermeiro</option>
                                            <option value="técnico de enfermagem">Técnico de Enfermagem</option>
                                            <option value="farmacêutico">Farmacêutico</option>
                                            <option value="técnico em farmácia">Técnico em Farmácia</option>
                                            <option value="odontólogo">Odontólogo</option>
                                        </select>
                                    </div>

                                    {/* Comprovante (Registro) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="comprovante" className="text-gray-800 font-medium">Registro (Comprovante) <span className="text-red-500">*</span></Label>
                                        <Input id="comprovante" name="comprovante" placeholder="Número do registro profissional" required value={formData.comprovante} onChange={handleChange} className="border-gray-300 h-11 focus-visible:ring-[#1976d2]" />
                                    </div>

                                    {/* Unidade */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="id_unidade" className="text-gray-800 font-medium">
                                            Unidade de Saúde <span className="text-red-500">*</span>
                                        </Label>
                                        <select
                                            id="id_unidade"
                                            name="id_unidade"
                                            required
                                            value={formData.id_unidade}
                                            onChange={handleChange}
                                            className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1976d2] focus-visible:ring-offset-2 text-gray-700"
                                        >
                                            <option value="" disabled>Selecione a unidade a qual o usuário pertence</option>
                                            {unidades.map((uni) => (
                                                <option key={uni.id} value={uni.id}>
                                                    {uni.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Botões */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 mt-8 border-t border-gray-200">
                                    <Button type="button" variant="outline" asChild disabled={loading} className="border-gray-300 text-gray-700 hover:bg-gray-100 h-11 px-8 text-base font-medium">
                                        <Link href="/configuracoes">Cancelar</Link>
                                    </Button>
                                    <Button type="submit" disabled={loading} className="bg-[#1976d2] hover:bg-[#1565c0] text-white h-11 px-8 text-base font-medium shadow-sm transition-colors">
                                        {loading ? "Salvando..." : "Cadastrar Usuário"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}