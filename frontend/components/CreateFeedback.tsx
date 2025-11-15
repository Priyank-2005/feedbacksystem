// frontend/components/CreateFeedback.tsx
"use client";
import React, { useState, useContext } from "react";
import { apiFetch } from "../lib/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function CreateFeedback({ onCreated }: { onCreated?: (f: any) => void }) {
    const { token } = useContext(AuthContext);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("general");
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast.error("Please login to create feedback.");
            return;
        }
        setLoading(true);
        try {
            const created = await apiFetch("/feedback", {
                method: "POST",
                body: JSON.stringify({ title, description, category }),
            });
            toast.success("Feedback created");
            setTitle(""); setDescription(""); setCategory("general");
            if (onCreated) onCreated(created);
        } catch (err: any) {
            console.error("create feedback error", err);
            toast.error(err?.data?.message || "Failed to create feedback");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card max-w-3xl mx-auto mb-6">
            <h3 className="h2">Create Feedback</h3>
            <form onSubmit={submit} className="mt-3" style={{ display: "grid", gap: 12 }}>
                <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short, descriptive title" required />
                <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the idea or problem" rows={4} required />
                <select
                    className="input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="general">General</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="uiux">UI / UX</option>
                    <option value="performance">Performance</option>
                    <option value="integration">Integration</option>
                    <option value="security">Security</option>
                    <option value="docs">Documentation</option>
                </select>


                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Creating..." : "Create Feedback"}
                    </button>
                </div>
            </form>
        </div>
    );
}
