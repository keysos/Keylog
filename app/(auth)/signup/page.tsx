"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const RegisterSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().pipe(z.email("Please enter a valid email address")),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFields = z.infer<typeof RegisterSchema>;

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFields>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit: SubmitHandler<RegisterFields> = async (data) => {
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
    console.log(data);
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="text-muted-foreground flex w-full max-w-sm flex-col items-center gap-6">
        <h1 className="text-center text-4xl font-semibold">
          Create your account
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Input
                id="username"
                {...register("username")}
                type="text"
                placeholder="Username"
                disabled={isSubmitting}
                className="text-sm sm:text-base sm:placeholder:text-base"
              />
              {errors.username && (
                <p className="text-destructive text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                id="email"
                {...register("email")}
                type="email"
                placeholder="Email"
                disabled={isSubmitting}
                className="text-sm sm:text-base sm:placeholder:text-base"
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
                  className="text-sm sm:text-base sm:placeholder:text-base"
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
          <Button
            disabled={isSubmitting}
            type="submit"
            className={"w-full sm:text-base"}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                <span>Signing up...</span>
              </div>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="hover:text-foreground text-sm sm:text-base"
          >
            Already have an account? Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
