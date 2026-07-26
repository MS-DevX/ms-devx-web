"use client";

import { useState, useRef, useCallback } from "react";

interface TargetSize {
  label: string;
  bytes: number;
}

const TARGET_SIZES: TargetSize[] = [
  { label: "100 KB", bytes: 100 * 1024 },
  { label: "200 KB", bytes: 200 * 1024 },
  { label: "500 KB", bytes: 500 * 1024 },
];

export default function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [canvases, setCanvases] = useState<HTMLCanvasElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState<TargetSize>(TARGET_SIZES[0]);
  const [compressedPdf, setCompressedPdf] = useState<Uint8Array | null>(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const renderPdf = useCallback(async (pdfFile: File) => {
    setLoading(true);
    setProgress(0);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }).promise;
      const totalPages = pdf.numPages;
      const rendered: HTMLCanvasElement[] = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport } as never).promise;
        rendered.push(canvas);
        setProgress(Math.round((i / totalPages) * 100));
      }

      setFile(pdfFile);
      setCanvases(rendered);
      setCompressedPdf(null);
      setCompressedSize(0);
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
  }, []);

  const compress = useCallback(async () => {
    if (!canvases.length || !file) return;
    setLoading(true);
    try {
      const { PDFDocument } = await import("pdf-lib");

      let low = 0.02;
      let high = 1.0;
      let bestBytes: ArrayBuffer[] | null = null;

      for (let i = 0; i < 14; i++) {
        const mid = (low + high) / 2;
        const blobs = await Promise.all(
          canvases.map((c) => new Promise<Blob | null>((resolve) => c.toBlob((b) => resolve(b), "image/jpeg", mid)))
        );
        const total = blobs.reduce((s, b) => s + (b ? b.size : 0), 0);

        if (total <= target.bytes) {
          bestBytes = await Promise.all(blobs.map((b) => b!.arrayBuffer()));
          low = mid + 0.01;
        } else {
          high = mid - 0.01;
        }
        if (low > high) break;
      }

      if (!bestBytes) {
        const blobs = await Promise.all(
          canvases.map((c) => new Promise<Blob | null>((resolve) => c.toBlob((b) => resolve(b), "image/jpeg", 0.02)))
        );
        bestBytes = await Promise.all(blobs.map((b) => b!.arrayBuffer()));
      }

      const pdfDoc = await PDFDocument.create();
      for (const bytes of bestBytes) {
        const img = await pdfDoc.embedJpg(bytes);
        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const result = await pdfDoc.save();
      setCompressedPdf(result);
      setCompressedSize(result.length);
    } catch (err) {
      console.error("Compression failed:", err);
      alert("Failed to compress PDF.");
    } finally {
      setLoading(false);
    }
  }, [canvases, file, target]);

  const downloadCompressed = () => {
    if (!compressedPdf || !file) return;
        const blob = new Blob([new Uint8Array(compressedPdf)], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = file.name.replace(/\.pdf$/i, "") + "-compressed.pdf";
    link.click();
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

  const reset = () => {
    setFile(null);
    setCanvases([]);
    setCompressedPdf(null);
    setCompressedSize(0);
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
          <div className="text-4xl mb-3">🗜️</div>
          <p className="text-foreground font-semibold mb-1">
            {dragOver ? "Drop a PDF here" : "Click or drag a PDF file here"}
          </p>
          <p className="text-sm text-muted-foreground">Compress PDF to your target file size</p>
        </div>
      ) : null}

      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-border rounded-full animate-spin border-t-primary mx-auto mb-4" />
          <p className="text-foreground font-semibold mb-1">
            {canvases.length === 0 ? "Rendering pages..." : "Compressing..."}
          </p>
          {canvases.length === 0 && (
            <>
              <div className="max-w-xs mx-auto bg-muted rounded-full h-2 mt-3">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
            </>
          )}
        </div>
      )}

      {file && canvases.length > 0 && !loading && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-border">
            <span className="text-lg flex-shrink-0">📄</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB &middot; {canvases.length} {canvases.length === 1 ? "page" : "pages"}
              </p>
            </div>
            <button
              onClick={reset}
              className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/10 transition-all"
            >
              Change File
            </button>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-semibold text-foreground">Target size:</span>
            {TARGET_SIZES.map((s) => (
              <button
                key={s.label}
                onClick={() => { setTarget(s); setCompressedPdf(null); setCompressedSize(0); }}
                className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
                  target.label === s.label
                    ? "bg-primary text-white border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/10"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <button
            onClick={compress}
            className="px-8 py-3 bg-primary text-white font-bold text-base rounded-xl hover:opacity-90 transition-all shadow-[0_4px_14px_rgba(30,64,175,0.25)]"
          >
            Compress PDF
          </button>

          {compressedPdf && (
            <div className="rounded-xl bg-[var(--bg-card)] border border-border p-4 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Original size</span>
                <span className="font-semibold text-foreground">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Compressed size</span>
                <span className="font-semibold text-green-600">{(compressedSize / 1024).toFixed(1)} KB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Reduction</span>
                <span className="font-semibold text-foreground">
                  {((1 - compressedSize / file.size) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="pt-2">
                <button
                  onClick={downloadCompressed}
                  className="px-6 py-2 bg-primary text-white font-semibold text-sm rounded-lg hover:opacity-90 transition-all w-full"
                >
                  ⬇ Download Compressed PDF
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
