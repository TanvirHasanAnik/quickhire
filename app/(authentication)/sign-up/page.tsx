'use client'
import staticRoutes from "@/lib/static-routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { User, userSchema } from "../components/UserSchema";

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema)
  });
  const router = useRouter()

  const onSubmit = async (data: User) => {
  try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      console.log(result);
      console.log(res.status);

      if(res.ok){
        router.push(staticRoutes.signIn)
      }
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  function goToLoginPage() {
    router.push(staticRoutes.signIn)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("name")} placeholder="Name" />
        {errors.name && <p>{errors.name.message}</p>}

        <input type="email" {...register("email")} placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}

        <input type="password" {...register("password")} placeholder="Password" />
        {errors.password && <p>{errors.password.message}</p>}

        <button type="submit">Register</button>
      </form>
      <button onClick={goToLoginPage}>Already have an account</button>
    </>
  )
}