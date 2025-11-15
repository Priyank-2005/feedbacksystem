"use client";

import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { apiFetch } from "../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Normalize user object — backend might return res.user or res.name/res.email/res._id
      const userObj = res.user ?? { _id: res._id ?? res.userId, name: res.name ?? res.user?.name, email: res.email ?? res.user?.email };

      // token must exist
      login(res.token, userObj);
      toast.success("Logged in successfully!");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto mt-12">
      <h1 className="h1">Login</h1>
      <form onSubmit={submit} className="space-y-3 mt-4">
        <input className="input" placeholder="Email" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="btn btn-primary w-full" disabled={loading}>{loading ? "Loading..." : "Login"}</button>
        <div className="muted text-center mt-2">
          Don't have an account? <a className="link" onClick={()=>router.push("/register")}>Register</a>
        </div>
      </form>
    </div>
  );
}
