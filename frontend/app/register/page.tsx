"use client";

import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { apiFetch } from "../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      const userObj = res.user ?? { _id: res._id ?? res.userId, name: res.name ?? res.user?.name, email: res.email ?? res.user?.email };

      login(res.token, userObj);
      toast.success("Registered and logged in!");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto mt-12">
      <h1 className="h1">Create account</h1>
      <form onSubmit={submit} className="space-y-3 mt-4">
        <input className="input" placeholder="Name" required value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="input" placeholder="Email" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="btn btn-primary w-full" disabled={loading}>{loading ? "Loading..." : "Register"}</button>
        <div className="muted text-center mt-2">
          Already have an account? <a className="link" onClick={()=>router.push("/login")}>Login</a>
        </div>
      </form>
    </div>
  );
}
