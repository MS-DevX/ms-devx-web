"use client";

import { CheckCircle2, FileUp, Loader2 } from "lucide-react";
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

type PdfAction = "compress" | "merge" | "split" | "convert";

interface TabState {
  fileName: string;
  loading: boolean;
  success: boolean;
  message: string;
}

const initialTabState: TabState = {
  fileName: "",
  loading: false,
  success: false,
  message: "",
};

export default function PdfToolkit({ className }: ToolUiProps) {
  const [states, setStates] = useState<Record<PdfAction, TabState>>({
    compress: { ...initialTabState },
    merge: { ...initialTabState },
    split: { ...initialTabState },
    convert: { ...initialTabState },
  });

  const updateTab = (action: PdfAction, patch: Partial<TabState>) => {
    setStates((prev) => ({
      ...prev,
      [action]: { ...prev[action], ...patch },
    }));
  };

  const handleFileChange = (action: PdfAction, file: File | undefined) => {
    updateTab(action, {
      fileName: file?.name ?? "",
      success: false,
      message: "",
    });
  };

  const handleProcess = (action: PdfAction) => {
    const { fileName } = states[action];

    if (!fileName) {
      updateTab(action, {
        message: "Please select a PDF file first.",
        success: false,
      });
      return;
    }

    updateTab(action, { loading: true, success: false, message: "" });

    setTimeout(() => {
      const messages: Record<PdfAction, string> = {
        compress: `Compressed "${fileName}" — saved ~42% file size (simulated).`,
        merge: `Merged "${fileName}" with additional pages successfully (simulated).`,
        split: `Split "${fileName}" into 3 separate PDF files (simulated).`,
        convert: `Converted "${fileName}" to DOCX format (simulated).`,
      };

      updateTab(action, {
        loading: false,
        success: true,
        message: messages[action],
      });
    }, 1600);
  };

  const renderTabPanel = (action: PdfAction, label: string) => {
    const state = states[action];

    return (
      <TabsContent value={action} className="space-y-4 pt-4">
        <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
          <FileUp className="mx-auto mb-2 size-8 text-electric" />
          <p className="text-sm font-medium text-foreground">
            Upload PDF for {label}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            No files leave your browser — mock processing only
          </p>
          <Input
            type="file"
            accept=".pdf,application/pdf"
            className="mx-auto mt-4 max-w-xs"
            onChange={(e) =>
              handleFileChange(action, e.target.files?.[0])
            }
          />
          {state.fileName && (
            <p className="mt-2 text-xs text-electric">{state.fileName}</p>
          )}
        </div>

        <Button
          onClick={() => handleProcess(action)}
          disabled={state.loading}
          className="bg-electric text-white hover:bg-electric/90"
        >
          {state.loading ? (
            <>
              <Loader2 className="animate-spin" />
              Processing...
            </>
          ) : (
            `${label} PDF`
          )}
        </Button>

        {state.message && (
          <div
            className={cn(
              "animate-in fade-in flex items-start gap-2 rounded-lg border p-3 text-sm duration-300",
              state.success
                ? "border-teal/30 bg-teal/10 text-foreground"
                : "border-border bg-muted/30 text-muted-foreground"
            )}
          >
            {state.success && (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" />
            )}
            <span>{state.message}</span>
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
          <TabsTrigger value="convert">Convert</TabsTrigger>
        </TabsList>

        {renderTabPanel("compress", "Compress")}
        {renderTabPanel("merge", "Merge")}
        {renderTabPanel("split", "Split")}
        {renderTabPanel("convert", "Convert")}
      </Tabs>
    </div>
  );
}
