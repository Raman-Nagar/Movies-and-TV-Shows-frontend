import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useSignup } from "../hooks/use-auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    cPassword: z.string().min(6, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.cPassword, {
    message: "Passwords do not match",
    path: ["cPassword"],
  });

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { mutateAsync: signup, isPending } = useSignup();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      cPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setError("");
    try {
      await signup({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "Signup failed");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="John Doe"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="you@example.com"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="cPassword">Confirm Password</Label>
              <Input
                id="cPassword"
                type="password"
                {...form.register("cPassword")}
              />
              {form.formState.errors.cPassword && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.cPassword.message}
                </p>
              )}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating account..." : "Sign Up"}
            </Button>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
