"use client";
import Link from "next/link";
import React from "react";

export default function FeedbackCard({ feedback }: any) {
  return (
    <div className="card" role="article" aria-labelledby={`fb-${feedback._id}`}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <div>
          <h3 id={`fb-${feedback._id}`} className="h2">{feedback.title}</h3>
          <p className="muted" style={{marginTop:6}}>{feedback.description}</p>
          <div style={{marginTop:10}}>
            <span className="badge">{feedback.category}</span>
          </div>
        </div>

        <div style={{textAlign:"right"}}>
          <div className="text-strong" style={{fontWeight:700}}>{feedback.votes} ▲</div>
          <div style={{marginTop:8}}>
            <Link href={`/feedback/${feedback._id}`} className="link">Open</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
