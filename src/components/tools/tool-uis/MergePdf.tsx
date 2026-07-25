"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function MergePdf() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const valid = Array.from(fileList).filter((f) => f.type === "application/pdf");
    if (valid.length === 0) return;
    const newFiles: FileItem[] = valid.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: number) => {
    const target = index + direction;
    if (target < 0 || target >= files.length) return;
    const next = [...files];
    [next[index], next[target]] = [next[target], next[index]];
    setFiles(next);
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const f of files) {
        const arrayBuffer = await f.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pageIndices = pdf.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(pdf, pageIndices);
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged-document.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Merge failed:", err);
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div>
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-6 ${
          dragOver
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/10 hover:bg-muted"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          className="sr-only"
        />
        <div className="text-4xl mb-3">📑</div>
        <p className="text-foreground font-semibold mb-1">
          {dragOver ? "Drop PDFs here" : "Click or drag PDF files here"}
        </p>
        <p className="text-sm text-muted-foreground">Select at least 2 PDF files to merge</p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2 mb-6">
          {files.map((f, idx) => (
            <div
              key={f.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-border"
            >
              <span className="text-lg flex-shrink-0">📄</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{f.name}</p>
                <p className="text-xs text-muted-foreground">{formatSize(f.size)}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => moveFile(idx, -1)}
                  disabled={idx === 0}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveFile(idx, 1)}
                  disabled={idx === files.length - 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeFile(f.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-all"
                  aria-label="Remove file"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info + Generate */}
      {files.length > 0 && (
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            {files.length} {files.length === 1 ? "file" : "files"} selected —
            {files.length < 2 ? " add one more to merge" : " ready to merge"}
          </p>
          <button
            onClick={mergePdfs}
            disabled={isMerging || files.length < 2}
            className="px-10 py-3.5 bg-primary text-white font-bold text-base rounded-xl hover:opacity-90 transition-all shadow-[0_4px_14px_rgba(30,64,175,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMerging ? "⏳ Merging..." : "🔗 Merge PDFs"}
          </button>
        </div>
      )}
    </div>
  );
}
