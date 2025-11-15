"use client";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout, token } = useContext(AuthContext) as any;
  const router = useRouter();

  return (
    <header className="card flex items-center justify-between">
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{
          width:44,height:44,borderRadius:10,
          background: "linear-gradient(135deg,var(--accent-1),var(--accent-2))",
          boxShadow:"var(--card-glow)"
        }} className="floaty"></div>

        <div>
          <div className="h1" style={{margin:0,cursor:"pointer"}} onClick={()=>router.push("/")}>Feedback System</div>
          <div className="muted" style={{marginTop:2}}>Ship product-changing ideas</div>
        </div>
      </div>

      <div style={{display:"flex",alignItems:"center",gap:12}}>
        {(user || token) ? (
          <>
            <div className="text-strong" style={{marginRight:8}}>{user?.name ?? "You"}</div>
            <button
              onClick={() => { logout(); router.push("/login"); }}
              className="btn btn-ghost"
            >
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => router.push("/login")} className="btn btn-primary">Login</button>
        )}
      </div>
    </header>
  );
}
