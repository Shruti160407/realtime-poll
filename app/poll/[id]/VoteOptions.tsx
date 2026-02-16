"use client";

import { useState, useEffect } from "react";
import { getPusherClient } from "@/lib/pusherClient";
//import { v4 as uuidv4 } from "uuid";

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
  const [voterId, setVoterId] = useState<string | null>(null);


  //  Load previously selected option from localStorage
  useEffect(() => {
  if (typeof window !== "undefined") {
    try {
      const saved = window.localStorage.getItem(`voted-${pollId}`);
      if (saved) {
        setSelectedOption(saved);
      }
    } catch {}
  }
}, [pollId]);


  useEffect(() => {
  let id = localStorage.getItem("voterId");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("voterId", id);
  }

  setVoterId(id);
}, []);


  //  Subscribe to Pusher updates
  useEffect(() => {
  const client = getPusherClient();
  if (!client) return;

  const channel = client.subscribe(`poll-${pollId}`);

  channel.bind("vote-updated", (data: any) => {
    setLocalOptions(data.options);
  });

  return () => {
    client.unsubscribe(`poll-${pollId}`);
  };
}, [pollId]);


const handleVote = async (optionId: string) => {
  if (loading) return;
  setLoading(true);

  let voterId: string | null = null;

  if (typeof window !== "undefined") {
    try {
      voterId = window.localStorage.getItem("voterId");
    } catch {}
  }

  if (!voterId) {
    voterId =
      Date.now().toString() +
      "-" +
      Math.floor(Math.random() * 1000000).toString();

    try {
      window.localStorage.setItem("voterId", voterId);
    } catch {}
  }

  // Optimistic update
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

  try {
    window.localStorage.setItem(`voted-${pollId}`, optionId);
  } catch {}

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
