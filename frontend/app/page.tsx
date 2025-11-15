// frontend/app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import CreateFeedback from "../components/CreateFeedback";
import FeedbackCard from "../components/FeedbackCard";

export default function HomePage() {
  const [list, setList] = useState<any[]>([]);

  const load = async () => {
    try {
      const data = await apiFetch("/feedback");
      setList(data);
    } catch (err) {
      console.error("load feedback error", err);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <CreateFeedback onCreated={(f) => setList(prev => [f, ...prev])} />
      <div style={{display:"grid",gap:12}}>
        {list.map(f => <FeedbackCard key={f._id} feedback={f} />)}
        {list.length === 0 && <div className="card">No feedback yet</div>}
      </div>
    </div>
  );
}
