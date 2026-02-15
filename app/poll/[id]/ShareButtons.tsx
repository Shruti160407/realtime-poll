"use client";

import { useState } from "react";

export default function ShareButtons() {
  const [copied, setCopied] = useState(false);

  const pollUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pollUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Vote on this poll",
        url: pollUrl,
      });
    } else {
      alert("Sharing not supported on this device");
    }
  };

  return (
    <div className="flex gap-4 mt-4">
      <button
        onClick={handleCopy}
        className="bg-white text-black px-4 py-2 rounded-lg"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>

      <button
        onClick={handleShare}
        className="bg-gray-700 text-white px-4 py-2 rounded-lg"
      >
        Share
      </button>
    </div>
  );
}
