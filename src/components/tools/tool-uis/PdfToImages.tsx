"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface RenderedPage {
  index: number;
  canvas: HTMLCanvasElement;
}

export default function PdfToImages() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [scale, setScale] = useState(2);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const renderPdf = useCallback(async (pdfFile: File) => {
    setLoading(true);
    setProgress(0);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }).promise;
      const totalPages = pdf.numPages;
      const renderedPages: RenderedPage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport } as never).promise;
        renderedPages.push({ index: i, canvas });
        setProgress(Math.round((i / totalPages) * 100));
      }

      setFile(pdfFile);
      setPages(renderedPages);
    } catch (err: unknown) {
      console.error("PDF render failed:", err);
      const message = err instanceof Error ? err.message : "";
      if (message.includes("Failed to fetch") || message.includes("dynamically imported") || err instanceof TypeError) {
        alert("Failed to load the PDF engine. Please refresh the page and try again.");
      } else {
        alert("Could not read this PDF. It may be corrupted or password-protected.");
      }
    } finally {
      setLoading(false);
    }
  }, [scale]);

  const downloadPage = (page: RenderedPage) => {
    const link = document.createElement("a");
    link.download = `${file!.name.replace(/\.pdf$/i, "")}-page-${page.index}.${format}`;
    if (format === "png") {
      page.canvas.toBlob((blob) => {
        if (blob) {
          link.href = URL.createObjectURL(blob);
          link.click();
        }
      }, "image/png");
    } else {
      page.canvas.toBlob((blob) => {
        if (blob) {
          link.href = URL.createObjectURL(blob);
          link.click();
        }
      }, "image/jpeg", 0.92);
    }
  };

  const downloadAll = async () => {
    for (const page of pages) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      downloadPage(page);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) renderPdf(f);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) renderPdf(f);
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
      {/* Upload */}
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
          <div className="text-4xl mb-3">🖼️</div>
          <p className="text-foreground font-semibold mb-1">
            {dragOver ? "Drop PDF here" : "Click or drag a PDF file here"}
          </p>
          <p className="text-sm text-muted-foreground">Convert PDF pages to PNG or JPEG images</p>
        </div>
      ) : null}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-border rounded-full animate-spin border-t-primary mx-auto mb-4" />
          <p className="text-foreground font-semibold mb-1">Rendering pages...</p>
          <div className="max-w-xs mx-auto bg-muted rounded-full h-2 mt-3">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
        </div>
      )}

      {/* Settings + Gallery */}
      {file && pages.length > 0 && (
        <div className="space-y-6">
          {/* File Info + Settings */}
          <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-border">
            <span className="text-lg flex-shrink-0">📄</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{pages.length} {pages.length === 1 ? "page" : "pages"}</p>
            </div>
            <div className="flex gap-2 items-center">
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as "png" | "jpeg")}
                className="px-2.5 py-1.5 text-sm rounded-lg bg-[var(--bg-card)] border border-border text-foreground focus:outline-none focus:border-primary"
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
              </select>
              <select
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="px-2.5 py-1.5 text-sm rounded-lg bg-[var(--bg-card)] border border-border text-foreground focus:outline-none focus:border-primary"
              >
                <option value="1">1× Quality</option>
                <option value="2">2× Quality</option>
                <option value="3">3× Quality</option>
              </select>
              <button
                onClick={resetFile}
                className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/10 transition-all"
              >
                Change File
              </button>
            </div>
          </div>

          {/* Page Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pages.map((page, idx) => (
              <div key={idx} className="rounded-xl bg-[var(--bg-card)] border border-border overflow-hidden">
                <div className="aspect-[3/4] bg-muted flex items-center justify-center overflow-hidden p-2 relative">
                  <Image
                    src={page.canvas.toDataURL()}
                    alt={`Page ${page.index}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="rounded-lg"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className="p-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Page {page.index}</span>
                  <button
                    onClick={() => downloadPage(page)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary text-white hover:opacity-90 transition-all"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Download All */}
          {pages.length > 1 && (
            <div className="text-center">
              <button
                onClick={downloadAll}
                className="px-8 py-3 bg-primary text-white font-bold text-base rounded-xl hover:opacity-90 transition-all shadow-[0_4px_14px_rgba(30,64,175,0.25)]"
              >
                ⬇️ Download All Pages
              </button>
              <p className="text-xs text-muted-foreground mt-2">
                Each page will download individually
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
