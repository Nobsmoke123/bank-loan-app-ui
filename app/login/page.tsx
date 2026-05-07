import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { getAuthUser } from "@/lib/dal";

export default async function LoginPage() {
  const user = await getAuthUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
