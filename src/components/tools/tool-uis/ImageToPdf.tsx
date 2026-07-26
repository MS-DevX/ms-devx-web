"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface ImageItem {
  id: string;
  file: File;
  url: string;
  name: string;
}

const PAGE_SIZES: Record<string, [number, number]> = {
  A4: [595.28, 841.89],
  Letter: [612, 792],
  Legal: [612, 1008],
};

async function fileToImageData(file: File): Promise<{ arrayBuffer: ArrayBuffer; embedFn: "embedJpg" | "embedPng" }> {
  const arrayBuffer = await file.arrayBuffer();
  const type = file.type;

  if (type === "image/jpeg" || type === "image/jpg") {
    return { arrayBuffer, embedFn: "embedJpg" };
  }

  if (type === "image/png") {
    return { arrayBuffer, embedFn: "embedPng" };
  }

  if (type === "image/webp") {
    const pngBuffer = await webpToPng(arrayBuffer);
    return { arrayBuffer: pngBuffer, embedFn: "embedPng" };
  }

  throw new Error("Unsupported image type");
}

function webpToPng(arrayBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([arrayBuffer], { type: "image/webp" });
    const url = URL.createObjectURL(blob);
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((pngBlob) => {
        URL.revokeObjectURL(url);
        if (!pngBlob) return reject(new Error("WebP conversion failed"));
        pngBlob.arrayBuffer().then(resolve);
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load WebP image"));
    };
    img.src = url;
  });
}

export default function ImageToPdf() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState(20);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addImages = useCallback((files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type)
    );
    if (valid.length === 0) return;
    const newImages: ImageItem[] = valid.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addImages(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    addImages(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.url);
      return prev.filter((i) => i.id !== id);
    });
  };

  const moveImage = (index: number, direction: number) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();
      const [pw, ph] = PAGE_SIZES[pageSize];
      const isLandscape = orientation === "landscape";
      const pageW = isLandscape ? ph : pw;
      const pageH = isLandscape ? pw : ph;
      const m = margin;

      for (const img of images) {
        const { arrayBuffer, embedFn } = await fileToImageData(img.file);
        const image = await pdfDoc[embedFn](arrayBuffer);
        const maxW = pageW - m * 2;
        const maxH = pageH - m * 2;
        const scale = Math.min(maxW / image.width, maxH / image.height);
        const scaledW = image.width * scale;
        const scaledH = image.height * scale;
        const x = (pageW - scaledW) / 2;
        const y = (pageH - scaledH) / 2;
        const page = pdfDoc.addPage([pageW, pageH]);
        page.drawImage(image, { x, y, width: scaledW, height: scaledH });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = images.length === 1
        ? images[0].name.replace(/\.[^.]+$/, "") + ".pdf"
        : "converted-images.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGenerating(false);
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
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
          className="sr-only"
        />
        <div className="text-4xl mb-3">🖼️</div>
        <p className="text-foreground font-semibold mb-1">
          {dragOver ? "Drop images here" : "Click or drag images here"}
        </p>
        <p className="text-sm text-muted-foreground">JPG, PNG, WebP — multiple files allowed</p>
      </div>

      {/* Settings */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted rounded-xl">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
              Page Size
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
              Orientation
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setOrientation("portrait")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  orientation === "portrait"
                    ? "bg-primary text-white"
                    : "bg-[var(--bg-card)] border border-border text-muted-foreground hover:border-primary/10"
                }`}
              >
                Portrait
              </button>
              <button
                onClick={() => setOrientation("landscape")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  orientation === "landscape"
                    ? "bg-primary text-white"
                    : "bg-[var(--bg-card)] border border-border text-muted-foreground hover:border-primary/10"
                }`}
              >
                Landscape
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
              Margin: {margin}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <div className="flex items-end">
            <span className="text-sm text-muted-foreground">
              {images.length} {images.length === 1 ? "image" : "images"}
            </span>
          </div>
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="space-y-2 mb-6">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-border"
            >
              <Image
                src={img.url}
                alt={img.name}
                unoptimized
                width={56}
                height={56}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{img.name}</p>
                <p className="text-xs text-muted-foreground">
                  Image {idx + 1} of {images.length}
                </p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => moveImage(idx, -1)}
                  disabled={idx === 0}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveImage(idx, 1)}
                  disabled={idx === images.length - 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeImage(img.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-all"
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Button */}
      {images.length > 0 && (
        <div className="text-center">
          <button
            onClick={generatePdf}
            disabled={isGenerating}
            className="px-10 py-3.5 bg-primary text-white font-bold text-base rounded-xl hover:opacity-90 transition-all shadow-[0_4px_14px_rgba(30,64,175,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? "⏳ Generating PDF..." : "📄 Generate PDF"}
          </button>
        </div>
      )}
    </div>
  );
}
