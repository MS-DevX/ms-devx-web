"use client";

import { useState, useRef, useCallback } from "react";

interface ExtractedPage {
  index: number;
  text: string;
}

export default function PdfToText() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<ExtractedPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const extractText = useCallback(async (pdfFile: File) => {
    setLoading(true);
    setProgress(0);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }).promise;
      const totalPages = pdf.numPages;
      const extracted: ExtractedPage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        extracted.push({ index: i, text });
        setProgress(Math.round((i / totalPages) * 100));
      }

      setFile(pdfFile);
      setPages(extracted);
    } catch (err: unknown) {
      console.error("PDF text extraction failed:", err);
      const message = err instanceof Error ? err.message : "";
      if (message.includes("Failed to fetch") || message.includes("dynamically imported") || err instanceof TypeError) {
        alert("Failed to load the PDF engine. Please refresh the page and try again.");
      } else {
        alert("Could not extract text from this PDF. It may be a scanned document or password-protected.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const allText = pages.map((p) => `--- Page ${p.index} ---\n${p.text}`).join("\n\n");

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(allText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy to clipboard.");
    }
  };

  const copyPage = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      alert("Failed to copy to clipboard.");
    }
  };

  const downloadTxt = () => {
    const blob = new Blob([allText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file!.name.replace(/\.pdf$/i, "") + "-text.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) extractText(f);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) extractText(f);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const resetFile = () => {
    setFile(null);
    setPages([]);
    setProgress(0);
  };

  return (
    <div>
      {!file && !loading ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/10 hover:bg-muted"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="sr-only"
          />
          <div className="text-4xl mb-3">📝</div>
          <p className="text-foreground font-semibold mb-1">
            {dragOver ? "Drop PDF here" : "Click or drag a PDF file here"}
          </p>
          <p className="text-sm text-muted-foreground">Extract text content from PDF pages</p>
        </div>
      ) : null}

      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-border rounded-full animate-spin border-t-primary mx-auto mb-4" />
          <p className="text-foreground font-semibold mb-1">Extracting text...</p>
          <div className="max-w-xs mx-auto bg-muted rounded-full h-2 mt-3">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
        </div>
      )}

      {file && pages.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-border">
            <span className="text-lg flex-shrink-0">📄</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{pages.length} {pages.length === 1 ? "page" : "pages"}</p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={downloadTxt}
                className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-primary text-white hover:opacity-90 transition-all"
              >
                ⬇ .txt
              </button>
              <button
                onClick={copyAll}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg border transition-all ${
                  copied
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/10"
                }`}
              >
                {copied ? "Copied!" : "Copy All"}
              </button>
              <button
                onClick={resetFile}
                className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/10 transition-all"
              >
                Change File
              </button>
            </div>
          </div>

          {pages.map((page, idx) => (
            <div key={idx} className="rounded-xl bg-[var(--bg-card)] border border-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-muted border-b border-border">
                <span className="text-sm font-semibold text-foreground">Page {page.index}</span>
                <button
                  onClick={() => copyPage(page.text)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/10 transition-all"
                >
                  Copy
                </button>
              </div>
              <div className="p-4">
                {page.text ? (
                  <pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                    {page.text}
                  </pre>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No text found on this page.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
