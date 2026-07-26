"use client";

import { useState, useRef, useCallback } from "react";

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<"range" | "custom">("range");
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(1);
  const [customPages, setCustomPages] = useState("");
  const [isSplitting, setIsSplitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadPdf = useCallback(async (pdfFile: File) => {
    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setFile(pdfFile);
      setPageCount(pdf.getPageCount());
      setRangeEnd(pdf.getPageCount());
    } catch {
      alert("Could not read this PDF file. It may be corrupted or password-protected.");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadPdf(f);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) loadPdf(f);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const resetFile = () => {
    setFile(null);
    setPageCount(0);
    setRangeStart(1);
    setRangeEnd(1);
    setCustomPages("");
  };

  const parseCustomPages = (): number[] | null => {
    const pages = new Set<number>();
    const parts = customPages.split(",").map((p) => p.trim());
    for (const part of parts) {
      if (part.includes("-")) {
        const [a, b] = part.split("-").map(Number);
        if (isNaN(a) || isNaN(b) || a < 1 || b > pageCount || a > b) return null;
        for (let i = a; i <= b; i++) pages.add(i);
      } else {
        const n = Number(part);
        if (isNaN(n) || n < 1 || n > pageCount) return null;
        pages.add(n);
      }
    }
    return [...pages].sort((a, b) => a - b);
  };

  const splitPdf = async () => {
    if (!file) return;
    setIsSplitting(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const indices = pdf.getPageIndices();

      let selectedIndices: number[];
      if (mode === "range") {
        selectedIndices = indices.slice(rangeStart - 1, rangeEnd);
      } else {
        const parsed = parseCustomPages();
        if (!parsed || parsed.length === 0) {
          alert("Invalid page selection. Use numbers like 1,3,5 or ranges like 1-5.");
          setIsSplitting(false);
          return;
        }
        selectedIndices = parsed.map((p) => p - 1).filter((i) => i >= 0 && i < pageCount);
      }

      if (selectedIndices.length === 0) {
        alert("No pages selected.");
        setIsSplitting(false);
        return;
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, selectedIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));
      const pdfBytes = await newPdf.save();

      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const baseName = file.name.replace(/\.pdf$/i, "");
      a.download = `${baseName}-pages-${mode === "range" ? `${rangeStart}-${rangeEnd}` : "selected"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Split failed:", err);
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div>
      {/* Upload */}
      {!file ? (
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
          <div className="text-4xl mb-3">✂️</div>
          <p className="text-foreground font-semibold mb-1">
            {dragOver ? "Drop PDF here" : "Click or drag a PDF file here"}
          </p>
          <p className="text-sm text-muted-foreground">Select a PDF to split into smaller documents</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Info */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-border">
            <span className="text-lg flex-shrink-0">📄</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{pageCount} {pageCount === 1 ? "page" : "pages"}</p>
            </div>
            <button
              onClick={resetFile}
              className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/10 transition-all"
            >
              Change File
            </button>
          </div>

          {/* Split Mode */}
          <div className="p-4 bg-muted rounded-xl space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                Split Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode("range")}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    mode === "range"
                      ? "bg-primary text-white"
                      : "bg-[var(--bg-card)] border border-border text-muted-foreground hover:border-primary/10"
                  }`}
                >
                  Page Range
                </button>
                <button
                  onClick={() => setMode("custom")}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    mode === "custom"
                      ? "bg-primary text-white"
                      : "bg-[var(--bg-card)] border border-border text-muted-foreground hover:border-primary/10"
                  }`}
                >
                  Specific Pages
                </button>
              </div>
            </div>

            {mode === "range" ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    From Page
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={rangeEnd}
                    value={rangeStart}
                    onChange={(e) => setRangeStart(Math.max(1, Math.min(Number(e.target.value), rangeEnd)))}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    To Page
                  </label>
                  <input
                    type="number"
                    min={rangeStart}
                    max={pageCount}
                    value={rangeEnd}
                    onChange={(e) => setRangeEnd(Math.max(rangeStart, Math.min(Number(e.target.value), pageCount)))}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Page Numbers
                </label>
                <input
                  type="text"
                  value={customPages}
                  onChange={(e) => setCustomPages(e.target.value)}
                  placeholder={`e.g. 1,3,5-8 (max ${pageCount})`}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use commas for individual pages, dashes for ranges
                </p>
              </div>
            )}
          </div>

          {/* Split Button */}
          <div className="text-center">
            <button
              onClick={splitPdf}
              disabled={isSplitting}
              className="px-10 py-3.5 bg-primary text-white font-bold text-base rounded-xl hover:opacity-90 transition-all shadow-[0_4px_14px_rgba(30,64,175,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSplitting ? "⏳ Splitting..." : "✂️ Extract Pages"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
