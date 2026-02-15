"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePollPage() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const handleSubmit = async () => {
    if (!question || options.filter((o) => o.trim() !== "").length < 2) {
      alert("Please add a question and at least 2 options");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/poll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        options: options.filter((o) => o.trim() !== ""),
      }),
    });

    let data = null;

try {
  data = await res.json();
} catch (err) {
  alert("Invalid server response");
  setLoading(false);
  return;
}


    setLoading(false);

    if (!res.ok) {
      alert("Error creating poll");
      return;
    }

    router.push(`/poll/${data.id}`);
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create a Poll</h1>

      <input
        className="w-full p-3 border rounded mb-4 bg-gray-900"
        placeholder="Enter your question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {options.map((option, index) => (
        <input
          key={index}
          className="w-full p-3 border rounded mb-3 bg-gray-900"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) =>
            handleOptionChange(index, e.target.value)
          }
        />
      ))}

      <button
        onClick={addOption}
        className="mb-4 text-blue-400"
      >
        + Add another option
      </button>

      <button
        onClick={handleSubmit}
        className="w-full bg-white-600 p-3 rounded"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Poll"}
      </button>
    </main>
  );
}
