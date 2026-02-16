"use client";

import { useState, useEffect } from "react";
import { pusherClient } from "@/lib/pusherClient";
import { v4 as uuidv4 } from "uuid";

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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  //  Load previously selected option from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`voted-${pollId}`);
    if (saved) {
      setSelectedOption(saved);
    }
  }, [pollId]);

  //  Subscribe to Pusher updates
  useEffect(() => {
    const channel = pusherClient.subscribe(`poll-${pollId}`);

    channel.bind(
      "vote-updated",
      (data: {
        options: { id: string; text: string; votes: { id: string }[] }[];
      }) => {
        setLocalOptions(data.options);
      }
    );

    return () => {
      pusherClient.unsubscribe(`poll-${pollId}`);
    };
  }, [pollId]);

    const handleVote = async (optionId: string) => {
  if (loading) return;
  setLoading(true);

  let voterId = localStorage.getItem("voterId");

  if (!voterId) {
    voterId = uuidv4();
    localStorage.setItem("voterId", voterId);
  }

  //  Optimistic update (instant UI)
  setLocalOptions((prev) =>
    prev.map((option) =>
      option.id === optionId
        ? { ...option, votes: [...option.votes, { id: "optimistic" }] }
        : option
    )
  );

  const res = await fetch("/api/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pollId, optionId, voterId }),
  });

  if (!res.ok) {
    setLoading(false);
    return;
  }

  localStorage.setItem(`voted-${pollId}`, optionId);
  setSelectedOption(optionId);

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

        const isSelected = selectedOption === option.id;

        return (
          <li
            key={option.id}
            className={`p-4 border rounded-lg cursor-pointer transition
              ${isSelected ? "bg-blue-900 border-blue-500" : "hover:bg-gray-800"}
              ${loading ? "opacity-50 pointer-events-none" : ""}
            `}
            onClick={() => handleVote(option.id)}
          >
            <div className="flex justify-between mb-2">
              <span>{option.text}</span>
              <span>
                {option.votes.length} votes ({percentage}%)
              </span>
            </div>

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
