'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { UserLogin, loginSchema } from "../components/UserSchema";
import staticRoutes from "@/lib/static-routes";

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const router = useRouter()

  const onSubmit = async (data: UserLogin) => {
    try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        const result = await res.json();
        if (result.token) {
        localStorage.setItem("authToken", result.token);
        console.log("Token stored:", result.token);

        router.push(staticRoutes.landing);
        } else {
          console.error("Login failed: No token returned");
        }
  
        console.log(result);
      } catch (error) {
        console.error("Signup failed", error);
      }
    };

    function goToRegisterPage() {
      router.push(staticRoutes.signUp)
    }

  return (
    <>
        <form onSubmit={handleSubmit(onSubmit)}>
        <input type="email" {...register("email")} placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}

        <input type="password" {...register("password")} placeholder="Password" />
        {errors.password && <p>{errors.password.message}</p>}

        <button type="submit">Login</button>
        </form>

        <button onClick={goToRegisterPage}>Create new account</button>
    </>
  )
}