"use client";

import type { ReactNode } from "react";

interface ResultBoxProps {
  children: ReactNode;
  show?: boolean;
}

export default function ResultBox({ children, show = true }: ResultBoxProps) {
  if (!show) return null;
  return (
    <div className="bg-muted rounded-xl p-6 mt-6 border border-border">
      {children}
    </div>
  );
}
