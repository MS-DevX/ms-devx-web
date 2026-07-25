"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const APP_NAME = "MS DevX Tools";

function fallbackCopy(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.cssText = "position:fixed;left:-999999px;top:-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textArea);
  }
}

async function copyToClipboard(text: string) {
  if (typeof window === "undefined") return false;
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return fallbackCopy(text);
    }
  }
  return fallbackCopy(text);
}

export function useShare() {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const clearFeedback = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCopied(false);
      setShared(false);
      setError(null);
    }, 2500);
  }, []);

  const buildToolMessage = useCallback(
    (toolName: string, url: string) => {
      return `I have been using this ${toolName} on ${APP_NAME} and it is amazing. Try it out yourself!\n${url}`;
    },
    [],
  );

  const buildToolResultMessage = useCallback(
    (toolName: string, resultLabel: string, resultValue: string, url: string) => {
      return `My ${resultLabel} is ${resultValue} using ${APP_NAME}. Try it yourself!\n${url}`;
    },
    [],
  );

  const buildBlogMessage = useCallback(
    (title: string, excerpt: string | null, url: string) => {
      if (excerpt) {
        return `${excerpt}\n\nI found this useful article on ${APP_NAME}. Try it yourself!\n${url}`;
      }
      return `I found this useful article on ${APP_NAME}. Try it yourself!\n${url}`;
    },
    [],
  );

  const share = useCallback(
    async (text: string, url?: string) => {
      const fullText = url ? `${text}\n${url}` : text;

      if (typeof window === "undefined") return false;

      if (navigator.share) {
        try {
          await navigator.share({
            title: "Share",
            text: fullText,
          });
          setShared(true);
          setError(null);
          clearFeedback();
          return true;
        } catch (e: unknown) {
          if (e instanceof Error && e.name !== "AbortError") {
            const ok = await copyToClipboard(fullText);
            if (ok) {
              setCopied(true);
              setError(null);
            } else {
              setError("Could not copy to clipboard.");
            }
            clearFeedback();
            return ok;
          }
          return false;
        }
      }

      const ok = await copyToClipboard(fullText);
      if (ok) {
        setCopied(true);
        setError(null);
      } else {
        setError("Could not copy to clipboard.");
      }
      clearFeedback();
      return ok;
    },
    [clearFeedback],
  );

  const copyLink = useCallback(
    async (url: string) => {
      const ok = await copyToClipboard(url);
      if (ok) {
        setCopied(true);
        setError(null);
      } else {
        setError("Could not copy to clipboard.");
      }
      clearFeedback();
      return ok;
    },
    [clearFeedback],
  );

  const shareWhatsApp = useCallback((text: string) => {
    if (typeof window === "undefined") return;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const shareTelegram = useCallback((text: string) => {
    if (typeof window === "undefined") return;
    const url = `https://t.me/share/url?url=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  return {
    copied,
    shared,
    error,
    setError,
    share,
    copyLink,
    shareWhatsApp,
    shareTelegram,
    buildToolMessage,
    buildToolResultMessage,
    buildBlogMessage,
    clearFeedback: () => {
      setCopied(false);
      setShared(false);
      setError(null);
    },
  };
}
