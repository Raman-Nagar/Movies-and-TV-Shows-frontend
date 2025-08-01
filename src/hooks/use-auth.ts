import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

export const useSignup = () =>
    useMutation({
        mutationFn: (data: { name: string; email: string; password: string }) =>
            apiRequest("POST", "/signup", data)
    });

export const useLogin = () =>
    useMutation({
        mutationFn: (data: { email: string; password: string }) =>
            apiRequest("POST", "/login", data),
        onSuccess: (data: any) => {
            localStorage.setItem("token", data?.token);
            localStorage.setItem("user", JSON.stringify(data?.user));
        },
    });

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
};

export const useAuth = () => {
    const user = localStorage.getItem("user");
    if (!user) return { user: null };

    return { user: JSON.parse(user) };
}