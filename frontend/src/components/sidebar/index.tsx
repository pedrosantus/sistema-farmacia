
'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Settings, FileChartColumn, ChartColumnStacked, Users, PillBottle, Home } from "lucide-react";


const navLinks = [
    { href: "/dashboard", icon: Home, label: "Início" },
    { href: "/dispensacao", icon: PillBottle, label: "Dispensação" },
    { href: "/paciente", icon: Users, label: "Pacientes" },
    { href: "/estoque", icon: ChartColumnStacked, label: "Estoque" },
    { href: "/estoque/relatorio", icon: FileChartColumn, label: "Relatórios" },
    { href: "/configuracoes", icon: Settings, label: "Configurações" },
];

export default function AppSidebar() {
    const pathname = usePathname();
    const activeHref = navLinks
        .filter(({ href }) => href !== "#" && (pathname === href || pathname.startsWith(`${href}/`)))
        .sort((a, b) => b.href.length - a.href.length)[0]?.href;

    return (
        <div className="contents">

            {/* Sidebar desktop */}
            <aside className="p-4 hidden sm:flex flex-col fixed left-0 top-0 h-screen w-56 
            border-r z-40">

                {/* Logo */}
                <div className="flex items-center justify-center w-45">
                    <Image
                        src="/logo_hiperdia.svg"
                        alt="Logo do sistema"
                        width={120}
                        height={40}
                        priority
                        className="w-full h-auto"
                    />
                </div>

                <nav className="flex flex-col gap-1 p-3 flex-1 w-full">
                    {navLinks.map(({ href, icon: Icon, label }) => (
                        <Link
                            key={label}
                            href={href}
                            className="flex items-center gap-3 rounded-lg w-full text-[20px] max-w-full font-medium
                            text-[#003967] hover:bg-[#9ACAE4] hover:text-[#003967] transition-colors"
                        >
                            <Icon className="h-5 w-5 shrink-0" />
                            {label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Navegação inferior mobile */}
            <nav
                aria-label="Navegação principal"
                className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,57,103,0.10)] backdrop-blur-sm sm:hidden"
            >
                <div className="grid min-h-16 grid-cols-6 items-stretch">
                    {navLinks.map(({ href, icon: Icon, label }) => {
                        const isActive = activeHref === href;

                        return (
                            <Link
                                key={label}
                                href={href}
                                aria-current={isActive ? "page" : undefined}
                                className={`flex min-w-0 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-medium leading-tight transition-colors ${
                                    isActive
                                        ? "bg-[#E5F3FA] text-[#003967]"
                                        : "text-[#5E7181] hover:bg-[#F2F8FB] hover:text-[#003967]"
                                }`}
                            >
                                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                                <span className="w-full truncate text-center">{label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    )
}
