"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface TargetSize {
  label: string;
  bytes: number;
}

const TARGET_SIZES: TargetSize[] = [
  { label: "100 KB", bytes: 100 * 1024 },
  { label: "200 KB", bytes: 200 * 1024 },
  { label: "500 KB", bytes: 500 * 1024 },
];

function compressBlob(canvas: HTMLCanvasElement, quality: number, format: string): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), format, quality);
  });
}

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [target, setTarget] = useState<TargetSize>(TARGET_SIZES[0]);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (f: File) => {
    setLoading(true);
    try {
      const bitmap = await createImageBitmap(f);
      const cvs = document.createElement("canvas");
      cvs.width = bitmap.width;
      cvs.height = bitmap.height;
      const ctx = cvs.getContext("2d")!;
      ctx.drawImage(bitmap, 0, 0);
      bitmap.close();

      setFile(f);
      setCanvas(cvs);
      setCompressedBlob(null);
    } catch (err) {
      console.error(err);
      alert("Could not load this image.");
    } finally {
      setLoading(false);
    }
  }, []);

  const compress = useCallback(async () => {
    if (!canvas || !file) return;
    setLoading(true);
    try {
      const format = file.type === "image/png" ? "image/jpeg" : file.type === "image/webp" ? "image/webp" : "image/jpeg";
      let low = 0.02;
      let high = 1.0;
      let bestBlob: Blob | null = null;
      let _bestQuality = 1.0;

      for (let i = 0; i < 12; i++) {
        const mid = (low + high) / 2;
        const blob = await compressBlob(canvas, mid, format);
        if (blob && blob.size <= target.bytes) {
          bestBlob = blob;
          _bestQuality = mid;
          low = mid + 0.01;
        } else {
          high = mid - 0.01;
        }
        if (low > high) break;
      }

      if (!bestBlob) {
        bestBlob = await compressBlob(canvas, 0.02, format);
      }
      setCompressedBlob(bestBlob);
    } finally {
      setLoading(false);
    }
  }, [canvas, file, target]);

  const downloadCompressed = () => {
    if (!compressedBlob || !file) return;
    const link = document.createElement("a");
    const ext = compressedBlob.type === "image/webp" ? "webp" : "jpg";
    link.download = file.name.replace(/\.[^.]+$/, "") + `-compressed.${ext}`;
    link.href = URL.createObjectURL(compressedBlob);
    link.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const reset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setFile(null);
    setOriginalUrl(null);
    setCanvas(null);
    setCompressedBlob(null);
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
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="sr-only"
          />
          <div className="text-4xl mb-3">🗜️</div>
          <p className="text-foreground font-semibold mb-1">
            {dragOver ? "Drop an image here" : "Click or drag an image here"}
          </p>
          <p className="text-sm text-muted-foreground">Compress JPG, PNG, or WebP to your target size</p>
        </div>
      ) : null}

      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-border rounded-full animate-spin border-t-primary mx-auto mb-4" />
          <p className="text-foreground font-semibold">Compressing...</p>
        </div>
      )}

      {file && canvas && !loading && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-border">
            <span className="text-lg flex-shrink-0">🖼️</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                Original: {(file.size / 1024).toFixed(1)} KB &middot; {canvas.width}&times;{canvas.height}
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
                onClick={() => { setTarget(s); setCompressedBlob(null); }}
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
            disabled={loading}
            className="px-8 py-3 bg-primary text-white font-bold text-base rounded-xl hover:opacity-90 transition-all shadow-[0_4px_14px_rgba(30,64,175,0.25)] disabled:opacity-50"
          >
            Compress
          </button>

          {compressedBlob && (
            <div className="rounded-xl bg-[var(--bg-card)] border border-border overflow-hidden">
              <div className="p-4 relative flex items-center justify-center" style={{ minHeight: "24rem" }}>
                <Image
                  src={URL.createObjectURL(compressedBlob)}
                  alt="Compressed preview"
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-lg"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="px-4 pb-4 space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Original size</span>
                  <span className="font-semibold text-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Compressed size</span>
                  <span className="font-semibold text-green-600">{(compressedBlob.size / 1024).toFixed(1)} KB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Reduction</span>
                  <span className="font-semibold text-foreground">
                    {((1 - compressedBlob.size / file.size) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={downloadCompressed}
                    className="px-6 py-2 bg-primary text-white font-semibold text-sm rounded-lg hover:opacity-90 transition-all w-full"
                  >
                    ⬇ Download Compressed Image
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
