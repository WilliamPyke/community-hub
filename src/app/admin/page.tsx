"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Copy, Check } from "@phosphor-icons/react";

function generateCode(): string {
  const chars = "0123456789ABCDEF";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function AdminPage() {
  const [code, setCode] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(generateCode());
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="max-w-md mx-auto mt-16"
    >
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={24} className="text-emerald-400" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
          Admin Authentication
        </h1>
        <p className="text-sm text-zinc-500 mt-2 max-w-[45ch] mx-auto leading-relaxed">
          Send this verification code to the Mallard Nexus bot on Discord to
          receive your login link.
        </p>
      </div>

      <div className="bg-[#141416] border border-zinc-800/60 rounded-lg p-6">
        <span className="text-xs text-zinc-600 block mb-2">
          Your verification code
        </span>
        <div className="flex items-center justify-between">
          <span className="font-mono text-3xl font-bold tracking-[0.25em] text-zinc-100">
            {code}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors active:scale-[0.95]"
            aria-label="Copy code"
          >
            {copied ? (
              <Check size={18} className="text-emerald-400" />
            ) : (
              <Copy size={18} className="text-zinc-500" />
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          How it works
        </h2>
        <ol className="space-y-2.5">
          {[
            "Copy the code above",
            'DM it to "Mallard Nexus" on Discord',
            "Bot verifies your Moderator role",
            "Click the magic link sent back to you",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700/50 flex items-center justify-center shrink-0 mt-0.5">
                <span className="font-mono text-[10px] text-zinc-400">
                  {i + 1}
                </span>
              </span>
              <span className="text-sm text-zinc-400">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </motion.div>
  );
}
