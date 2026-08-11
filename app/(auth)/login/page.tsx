"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .pipe(z.email("Please enter a valid email address")),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFields = z.infer<typeof LoginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFields>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<LoginFields> = async (data) => {
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
    console.log(data);
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="text-muted-foreground flex w-full max-w-sm flex-col items-center gap-6">
        <h1 className="text-center text-4xl font-semibold">Welcome Back</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Input
                id="email"
                {...register("email")}
                type="email"
                placeholder="Email"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-destructive text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  disabled={isSubmitting}
                />
                <Button
                  variant={"ghost"}
                  type="button"
                  size={"icon"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className={"absolute top-0 right-0 hover:bg-transparent"}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          {errors.root && (
            <p className="text-destructive text-sm">{errors.root.message}</p>
          )}
          <Button disabled={isSubmitting} type="submit" className={"w-full"}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                <span>Logging in...</span>
              </div>
            ) : (
              "Log in"
            )}
          </Button>
        </form>

        <div className="flex flex-col text-center">
          <Link href="/signup" className="hover:text-foreground">
            No account? Sign up here
          </Link>
          <Link href="/" className="hover:text-foreground">
            Forgot your password? Reset
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
