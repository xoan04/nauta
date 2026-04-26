import { redirect } from "next/navigation";

/** El perfil de usuario en Perlapp vive en la ruta pública `/perfil`. */
export default function ProfilePage() {
  redirect("/perfil");
}
