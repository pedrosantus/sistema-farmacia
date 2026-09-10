import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ConfiguracoesClient from "./ConfiguracoesClient";
import { buscarUsuariosAction } from "@/actions/usuario";
import { buscarUnidadeAction } from "@/actions/unidade";

export default async function ConfiguracoesPage() {
  const cookieStore = await cookies();
  const userInfoCookie = cookieStore.get("UserInfo")?.value;

  if (!userInfoCookie) redirect("/login");

  const userInfo = JSON.parse(userInfoCookie);

  const [usuariosResult, unidadeResult] = await Promise.all([
    buscarUsuariosAction(),
    buscarUnidadeAction(userInfo.id_unidade),
  ]);

  return (
    <ConfiguracoesClient
      usuariosIniciais={usuariosResult.data ?? []}
      unidadeInicial={unidadeResult.data ?? null}
      userInfo={userInfo}
    />
  );
}