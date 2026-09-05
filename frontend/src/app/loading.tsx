import { Pill } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-white/95 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Carregando conteúdo"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative grid size-20 place-items-center">
          <div
            className="absolute inset-0 animate-spin rounded-full border-4 border-[#D8ECF7] border-t-[#1976D2] motion-reduce:animate-none"
            aria-hidden="true"
          />
          <div className="grid size-14 place-items-center rounded-full bg-[#EAF5FB] text-[#003967] shadow-sm">
            <Pill className="size-7" aria-hidden="true" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-base font-semibold text-[#003967]">Carregando</p>
          <p className="mt-1 text-sm text-gray-500">Aguarde um instante...</p>
        </div>
      </div>
    </div>
  );
}
