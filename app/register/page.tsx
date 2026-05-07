import { redirect } from "next/navigation";
import RegisterForm from "@/components/RegisterForm";
import { getAuthUser } from "@/lib/dal";

export default async function RegisterPage() {
  const user = await getAuthUser();

  if (user) {
    redirect("/dashboard");
  }

  return <RegisterForm />;
}
