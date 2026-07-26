"use client";

import { CheckCircle2, Download, FileUp, Loader2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { ToolUiProps } from "@/lib/types";
import { cn } from "@/lib/utils";

type PdfAction = "compress" | "merge" | "split" | "text";

interface ActionState {
  files: File[];
  loading: boolean;
  success: boolean;
  message: string;
  downloadUrl: string | null;
  downloadName: string | null;
}

const initialActionState: ActionState = {
  files: [],
  loading: false,
  success: false,
  message: "",
  downloadUrl: null,
  downloadName: null,
};

export default function PdfToolkit({ className }: ToolUiProps) {
  const [states, setStates] = useState<Record<PdfAction, ActionState>>({
    compress: { ...initialActionState },
    merge: { ...initialActionState },
    split: { ...initialActionState },
    text: { ...initialActionState },
  });

  const updateState = (action: PdfAction, patch: Partial<ActionState>) => {
    setStates((prev) => ({
      ...prev,
      [action]: { ...prev[action], ...patch },
    }));
  };

  const handleFilesChange = (action: PdfAction, fileList: FileList | null) => {
    const files = fileList ? Array.from(fileList) : [];
    updateState(action, {
      files,
      success: false,
      message: "",
      downloadUrl: null,
      downloadName: null,
    });
  };

  const handleProcess = async (action: PdfAction) => {
    const { files } = states[action];
    if (files.length === 0) {
      updateState(action, {
        message: "Please select at least one PDF file.",
        success: false,
      });
      return;
    }

    updateState(action, { loading: true, success: false, message: "", downloadUrl: null });

    try {
      if (action === "compress") {
        const file = files[0];
        const bytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
        const blob = new Blob([new Uint8Array(compressedBytes)], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const name = file.name.replace(/\.pdf$/i, "-compressed.pdf");

        updateState(action, {
          loading: false,
          success: true,
          message: `Successfully processed "${file.name}"! Original: ${(file.size / 1024).toFixed(1)} KB → Processed: ${(blob.size / 1024).toFixed(1)} KB.`,
          downloadUrl: url,
          downloadName: name,
        });
      } else if (action === "merge") {
        if (files.length < 2) {
          updateState(action, {
            loading: false,
            message: "Please select 2 or more PDF files to merge.",
            success: false,
          });
          return;
        }

        const mergedPdf = await PDFDocument.create();
        for (const file of files) {
          const bytes = await file.arrayBuffer();
          const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedBytes = await mergedPdf.save({ useObjectStreams: true });
        const blob = new Blob([new Uint8Array(mergedBytes)], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        updateState(action, {
          loading: false,
          success: true,
          message: `Successfully merged ${files.length} PDF files!`,
          downloadUrl: url,
          downloadName: "merged-document.pdf",
        });
      } else if (action === "split") {
        const file = files[0];
        const bytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pageCount = pdfDoc.getPageCount();

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, [0]);
        newPdf.addPage(copiedPages[0]);

        const splitBytes = await newPdf.save();
        const blob = new Blob([new Uint8Array(splitBytes)], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        updateState(action, {
          loading: false,
          success: true,
          message: `Extracted Page 1 from "${file.name}" (total pages: ${pageCount}).`,
          downloadUrl: url,
          downloadName: `${file.name.replace(/\.pdf$/i, "")}-page-1.pdf`,
        });
      } else if (action === "text") {
        const file = files[0];
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }).promise;
        let fullText = `--- Extracted Text from ${file.name} ---\n\n`;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(" ");
          fullText += `--- Page ${i} ---\n${pageText}\n\n`;
        }

        const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        updateState(action, {
          loading: false,
          success: true,
          message: `Extracted text from ${pdf.numPages} page(s) of "${file.name}".`,
          downloadUrl: url,
          downloadName: `${file.name.replace(/\.pdf$/i, "")}-extracted.txt`,
        });
      }
    } catch (err: any) {
      updateState(action, {
        loading: false,
        success: false,
        message: err?.message || "An error occurred while processing the PDF file.",
      });
    }
  };

  const renderTabPanel = (action: PdfAction, label: string, isMultiple = false) => {
    const state = states[action];

    return (
      <TabsContent value={action} className="space-y-4 pt-4">
        <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center">
          <FileUp className="mx-auto mb-2 size-8 text-blue-700 dark:text-electric" />
          <p className="text-sm font-semibold text-foreground">
            Upload PDF for {label}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Processing happens 100% locally in your browser using pdf-lib — no files leave your device.
          </p>
          <Input
            type="file"
            accept=".pdf,application/pdf"
            multiple={isMultiple}
            className="mx-auto mt-4 max-w-xs text-xs"
            onChange={(e) => handleFilesChange(action, e.target.files)}
          />
          {state.files.length > 0 && (
            <div className="mt-2 text-xs font-medium text-blue-700 dark:text-electric">
              Selected: {state.files.map((f) => f.name).join(", ")}
            </div>
          )}
        </div>

        <Button
          onClick={() => handleProcess(action)}
          disabled={state.loading || state.files.length === 0}
          className="bg-electric text-white hover:bg-electric/90 font-semibold"
        >
          {state.loading ? (
            <>
              <Loader2 className="animate-spin" />
              Processing PDF...
            </>
          ) : (
            `${label} PDF`
          )}
        </Button>

        {state.message && (
          <div
            className={cn(
              "animate-in fade-in flex flex-col gap-2 rounded-xl border p-4 text-sm duration-300",
              state.success
                ? "border-teal-500/30 bg-teal-500/10 text-foreground"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            )}
          >
            <div className="flex items-center gap-2">
              {state.success && (
                <CheckCircle2 className="size-4 shrink-0 text-teal-600 dark:text-teal-400" />
              )}
              <span>{state.message}</span>
            </div>

            {state.downloadUrl && state.downloadName && (
              <a
                href={state.downloadUrl}
                download={state.downloadName}
                className="inline-flex items-center gap-2 self-start rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 dark:bg-electric dark:text-slate-950 transition-colors"
              >
                <Download className="size-3.5" />
                Download {state.downloadName}
              </a>
            )}
          </div>
        )}
      </TabsContent>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      <Tabs defaultValue="compress">
        <TabsList className="w-full flex-wrap sm:w-auto">
          <TabsTrigger value="compress">Compress</TabsTrigger>
          <TabsTrigger value="merge">Merge</TabsTrigger>
          <TabsTrigger value="split">Split</TabsTrigger>
          <TabsTrigger value="text">Extract Text</TabsTrigger>
        </TabsList>

        {renderTabPanel("compress", "Compress")}
        {renderTabPanel("merge", "Merge", true)}
        {renderTabPanel("split", "Split")}
        {renderTabPanel("text", "Extract Text")}
      </Tabs>
    </div>
  );
}
