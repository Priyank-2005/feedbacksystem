"use client";

import React, { useEffect, useState, useContext } from "react";
import { apiFetch } from "../lib/api";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";

/**
 * Option B: Automatically detect ID from URL if server wrapper fails.
 * Also includes:
 *  - One-vote-per-user behavior (backend enforces it)
 *  - Admin delete feedback + delete comments
 *  - Better error logging
 */
export default function FeedbackDetailClient({ id }: { id?: string }) {
  const router = useRouter();
  const { token, user } = useContext(AuthContext);

  const [derivedId, setDerivedId] = useState<string | undefined>(id);
  const [item, setItem] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");

  /** -----------------------------------------
   *   Derive ID from URL if props.id is missing
   * ----------------------------------------- */
  useEffect(() => {
    if (!derivedId && typeof window !== "undefined") {
      const parts = window.location.pathname.split("/").filter(Boolean);
      const fallbackId = parts.pop();
      if (fallbackId) {
        setDerivedId(fallbackId);
        console.info("Derived ID from URL:", fallbackId);
      } else {
        console.warn("Could not derive ID from URL path.");
      }
    }
  }, [derivedId]);

  const idToUse = derivedId;

  /** -----------------------------------------
   *   LOAD FEEDBACK + COMMENTS
   * ----------------------------------------- */
  const load = async () => {
    if (!idToUse) return;

    try {
      const data = await apiFetch(`/feedback/${idToUse}`, { method: "GET" });
      setItem(data);
    } catch (err) {
      console.error("Fetch feedback error:", err);
    }

    try {
      const comm = await apiFetch(`/comments/${idToUse}`, { method: "GET" });
      setComments(comm || []);
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idToUse]);

  /** -----------------------------------------
   *   ADMIN DELETE FEEDBACK
   * ----------------------------------------- */
  const deleteFeedback = async () => {
    if (!confirm("Delete this feedback?")) return;

    try {
      await apiFetch(`/feedback/${idToUse}`, { method: "DELETE" });
      router.push("/");
    } catch (err) {
      console.error("Delete feedback error:", err);
      alert("Failed to delete.");
    }
  };

  /** -----------------------------------------
   *   ADMIN DELETE COMMENT
   * ----------------------------------------- */
  const deleteComment = async (commentId: string) => {
    try {
      await apiFetch(`/comments/${commentId}`, { method: "DELETE" });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Comment delete error:", err);
    }
  };

  /** -----------------------------------------
   *   UPVOTE (One-Vote-Per-User backend logic)
   * ----------------------------------------- */
  const upvote = async () => {
    if (!token) return alert("Please login to upvote.");

    try {
      const res = await apiFetch(`/feedback/${idToUse}/upvote`, {
        method: "PUT",
      });

      if (res.message === "You already upvoted this feedback") {
        alert("You already upvoted.");
        return;
      }

      const updated = await apiFetch(`/feedback/${idToUse}`, { method: "GET" });
      setItem(updated);
    } catch (err: any) {
      console.error("Upvote error:", err);
      alert(err?.data?.message || "Upvote failed");
    }
  };

  /** -----------------------------------------
   *   ADD COMMENT
   * ----------------------------------------- */
  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idToUse) return alert("Missing feedback id");
    if (!token) return alert("Login required.");

    try {
      const res = await apiFetch(`/comments/${idToUse}`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      setComments((p) => [...p, res]);
      setText("");
    } catch (err) {
      console.error("Add comment error:", err);
      alert("Failed to add comment.");
    }
  };

  /** -----------------------------------------
   *   LOADING + INVALID UI
   * ----------------------------------------- */
  if (!idToUse) return <div className="p-8">Invalid feedback id.</div>;
  if (!item) return <div className="p-8">Loading...</div>;

  /** -----------------------------------------
   *   UI START
   * ----------------------------------------- */
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">

      <button onClick={() => router.back()} className="text-blue-600 text-sm">
        ← Back
      </button>

      {/* ----- FEEDBACK CARD ----- */}
      <div className="p-4 border rounded bg-white shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold">{item.title}</h1>
            <p className="mt-2 text-gray-700">{item.description}</p>
            <p className="mt-2 text-sm text-gray-500">
              Category: {item.category}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={upvote}
              className="px-3 py-1 bg-gray-100 rounded"
            >
              ▲ {item.votes}
            </button>

            {user?.isAdmin && (
              <button
                onClick={deleteFeedback}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ----- COMMENTS SECTION ----- */}
      <div className="p-4 border rounded bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Comments</h3>

        <div className="space-y-4 mb-6">
          {comments.map((c) => (
            <div key={c._id} className="p-3 border rounded bg-gray-50">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  {c.user?.name || "Anonymous"}
                </span>

                {user?.isAdmin && (
                  <button
                    onClick={() => deleteComment(c._id)}
                    className="text-red-500 text-xs"
                  >
                    delete
                  </button>
                )}
              </div>

              <div>{c.text}</div>
            </div>
          ))}

          {comments.length === 0 && (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>

        {/* ----- ADD COMMENT ----- */}
        <form onSubmit={addComment} className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Add comment..."
            required
          />

          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Add Comment
          </button>
        </form>
      </div>
    </div>
  );
}
