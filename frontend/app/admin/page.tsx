"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { apiFetch } from "../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!user?.isAdmin) {
      toast.error("Admin access required");
      router.push("/");
      return;
    }

    load();
  }, [user]);

  const load = async () => {
    const data = await apiFetch("/feedback");
    setList(data);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete feedback?")) return;

    try {
      await apiFetch(`/feedback/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      setList(list.filter((f: any) => f._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      {list.map((fb: any) => (
        <div
          key={fb._id}
          className="p-4 border rounded bg-white flex justify-between items-start mb-3"
        >
          <div>
            <h3 className="font-semibold">{fb.title}</h3>
            <p className="text-gray-600">{fb.description}</p>
          </div>

          <button
            onClick={() => deleteItem(fb._id)}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
