"use client";

import { useState } from "react";
import { useEffect } from "react";
import { pusherClient } from "@/lib/pusherClient";


export default function VoteOptions({
  pollId,
  options,
}: {
  pollId: string;
  options: {
    id: string;
    text: string;
    votes: { id: string }[];
  }[];
}) {
  const [localOptions, setLocalOptions] = useState(options);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const channel = pusherClient.subscribe(`poll-${pollId}`);

  channel.bind("vote-updated", (data: { options: { id: string; text: string; votes: { id: string }[] }[] }
) => {
    setLocalOptions(data.options);
  });

  return () => {
    pusherClient.unsubscribe(`poll-${pollId}`);
  };
}, [pollId]);


  const handleVote = async (optionId: string) => {
    if (loading) return;

    setLoading(true);

    const voterId =
      localStorage.getItem("voterId") || crypto.randomUUID();

    localStorage.setItem("voterId", voterId);

    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pollId,
        optionId,
        voterId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      setLoading(false);
      return;
    }

    // Update vote count locally (no reload)
    setLocalOptions((prev) =>
      prev.map((option) =>
        option.id === optionId
          ? {
              ...option,
              votes: [...option.votes, { id: "temp" }],
            }
          : option
      )
    );

    setLoading(false);
  };

  return (
  <ul className="space-y-4">
    {localOptions.map((option) => {
      const totalVotes = localOptions.reduce(
        (sum, opt) => sum + opt.votes.length,
        0
      );

      const percentage =
        totalVotes === 0
          ? 0
          : Math.round((option.votes.length / totalVotes) * 100);

      return (
        <li
          key={option.id}
          className="p-4 border rounded-lg cursor-pointer hover:bg-gray-800 transition"
          onClick={() => handleVote(option.id)}
        >
          <div className="flex justify-between mb-2">
            <span>{option.text}</span>
            <span>
              {option.votes.length} votes ({percentage}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded h-3">
            <div
              className="bg-blue-500 h-3 rounded transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </li>
      );
    })}
  </ul>
);
}

