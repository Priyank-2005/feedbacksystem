// frontend/app/feedback/page.tsx
"use client";
import React, { useEffect, useState, useContext } from "react";
import { apiFetch } from "../../lib/api";
import FeedbackCard from "../../components/FeedbackCard";
import FeedbackForm from "../../components/FeedbackForm";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function FeedbackPage() {
  const [items, setItems] = useState<any[]>([]);
  const { token } = useContext(AuthContext);
  const router = useRouter();

  const load = async () => {
    try {
      const data = await apiFetch("/feedback", { method: "GET" });
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upvote = async (id: string) => {
    try {
      await apiFetch(`/feedback/${id}/upvote`, { method: "PUT" });
      await load();
    } catch (err) {
      alert("You must be logged in to upvote");
    }
  };

  const openDetail = (id: string) => router.push(`/feedback/${id}`);

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Feedback</h2>
      </div>

      {/* Create form (requires authentication) */}
      <FeedbackForm onCreated={(f) => setItems([f, ...items])} />

      <div className="space-y-3">
        {items.map((fb) => (
          <FeedbackCard key={fb._id} feedback={fb} onUpvote={upvote} onOpen={openDetail} />
        ))}
      </div>
    </div>
  );
}
