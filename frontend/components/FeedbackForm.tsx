// frontend/components/FeedbackForm.tsx
"use client";
import React, { useState } from "react";
import { apiFetch } from "../lib/api";

export default function FeedbackForm({ onCreated }: { onCreated?: (f: any) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch("/feedback", { method: "POST", body: JSON.stringify({ title, description, category }) });
      setTitle(""); setDescription("");
      if (onCreated) onCreated(res);
    } catch (error: any) {
      setErr(error?.data?.message || error?.message || "Failed");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 p-4 border rounded">
      {err && <div className="text-red-600">{err}</div>}
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded" required />
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded">
        <option value="general">General</option>
        <option value="ui">UI</option>
        <option value="ux">UX</option>
        <option value="bug">Bug</option>
      </select>
      <button className="px-4 py-2 bg-green-600 text-white rounded">Create Feedback</button>
    </form>
  );
}
