"use client";
import React, { useState, useContext } from "react";
import { apiFetch } from "../lib/api";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";

type Props = { mode: "login" | "register" };

export default function AuthForm({ mode }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { setAuth } = useContext(AuthContext);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const payload: any = { email, password };
      if (mode === "register") payload.name = name;
      const res = await apiFetch(path, { method: "POST", body: JSON.stringify(payload) });
      setAuth(res.token, { _id: res._id, name: res.name, email: res.email });
      router.push("/feedback");
    } catch (error: any) {
      setErr(error?.data?.message || error?.message || "Request failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 shadow rounded mt-12">
      <h2 className="text-2xl mb-4">{mode === "login" ? "Login" : "Register"}</h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded" />
        )}
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-2 border rounded" />
        <button className="w-full p-2 bg-blue-600 text-white rounded">{mode === "login" ? "Login" : "Register"}</button>
      </form>
    </div>
  );
}