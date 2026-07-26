"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import QRCode from "qrcode";

interface QrType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const QR_TYPES: QrType[] = [
  {
    id: "url",
    name: "URL",
    icon: "🔗",
    description: "Link to a website",
  },
  {
    id: "text",
    name: "Text",
    icon: "📝",
    description: "Plain text message",
  },
  {
    id: "email",
    name: "Email",
    icon: "📧",
    description: "Send an email",
  },
  {
    id: "phone",
    name: "Phone",
    icon: "📞",
    description: "Call a phone number",
  },
  {
    id: "wifi",
    name: "WiFi",
    icon: "📶",
    description: "Connect to WiFi",
  },
  {
    id: "sms",
    name: "SMS",
    icon: "💬",
    description: "Send a text message",
  },
];

const WIFI_ENCRYPTION = [
  { value: "WPA", label: "WPA/WPA2" },
  { value: "WEP", label: "WEP" },
  { value: "nopass", label: "None (Open)" },
];

const SIZE_PRESETS = [
  { value: 128, label: "Small (128px)" },
  { value: 256, label: "Medium (256px)" },
  { value: 384, label: "Large (384px)" },
  { value: 512, label: "XL (512px)" },
];

export default function QrCodeGenerator() {
  const [activeType, setActiveType] = useState("url");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [copied, setCopied] = useState(false);
  const [_generating, setGenerating] = useState(false);

  const [url, setUrl] = useState("https://msdevx.com/tools");
  const [text, setText] = useState("Hello from MS DevX Tools QR Code Generator!");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [smsNumber, setSmsNumber] = useState("");
  const [smsBody, setSmsBody] = useState("");

  const _canvasRef = useRef<HTMLCanvasElement>(null);

  const getQRContent = useCallback(() => {
    switch (activeType) {
      case "url":
        if (!url.trim()) return "";
        let formattedUrl = url.trim();
        if (
          !formattedUrl.startsWith("http://") &&
          !formattedUrl.startsWith("https://")
        ) {
          formattedUrl = "https://" + formattedUrl;
        }
        return formattedUrl;

      case "text":
        return text.trim();

      case "email":
        if (!emailTo.trim()) return "";
        let mailto = `mailto:${encodeURIComponent(emailTo.trim())}`;
        const params: string[] = [];
        if (emailSubject.trim()) {
          params.push(`subject=${encodeURIComponent(emailSubject.trim())}`);
        }
        if (emailBody.trim()) {
          params.push(`body=${encodeURIComponent(emailBody.trim())}`);
        }
        if (params.length > 0) {
          mailto += `?${params.join("&")}`;
        }
        return mailto;

      case "phone":
        if (!phoneNumber.trim()) return "";
        return `tel:${phoneNumber.trim()}`;

      case "wifi":
        if (!wifiSsid.trim()) return "";
        let wifiStr = `WIFI:T:${wifiEncryption};S:${wifiSsid};`;
        if (wifiEncryption !== "nopass" && wifiPassword.trim()) {
          wifiStr += `P:${wifiPassword};`;
        }
        if (wifiHidden) {
          wifiStr += `H:true;`;
        }
        wifiStr += `;`;
        return wifiStr;

      case "sms":
        if (!smsNumber.trim()) return "";
        let smsStr = `SMSTO:${smsNumber.trim()}`;
        if (smsBody.trim()) {
          smsStr += `:${smsBody.trim()}`;
        }
        return smsStr;

      default:
        return "";
    }
  }, [
    activeType,
    url,
    text,
    emailTo,
    emailSubject,
    emailBody,
    phoneNumber,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    wifiHidden,
    smsNumber,
    smsBody,
  ]);

  useEffect(() => {
    const content = getQRContent();

    if (!content) {
      setQrDataUrl("");
      return;
    }

    setGenerating(true);

    const generateQR = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(content, {
          width: size,
          margin: 2,
          errorCorrectionLevel: errorLevel,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });
        setQrDataUrl(dataUrl);
    } catch (_err) {
        console.error("QR generation error:", _err);
        setQrDataUrl("");
      } finally {
        setGenerating(false);
      }
    };

    const timeoutId = setTimeout(generateQR, 150);
    return () => clearTimeout(timeoutId);
  }, [getQRContent, size, errorLevel]);

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.download = `ms-tools-qr-${activeType}-${Date.now()}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleCopyImage = async () => {
    if (!qrDataUrl) return;

    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = qrDataUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error("Copy failed:", e);
      }
    }
  };


  const renderTypeForm = () => {
    switch (activeType) {
      case "url":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Website URL
              </label>
              <div className="flex items-center rounded-lg border border-border overflow-hidden">
                <span className="px-4 py-3 bg-muted text-muted-foreground text-sm border-r border-border">
                  https://
                </span>
                <input
                  type="text"
                  value={url.replace(/^https?:\/\//, "")}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value;
                    if (val.startsWith("http://") || val.startsWith("https://")) {
                      setUrl(val);
                    } else {
                      setUrl(val ? `https://${val}` : "");
                    }
                  }}
                  placeholder="example.com or https://example.com"
                  className="flex-1 px-4 py-3 text-sm focus:outline-none text-foreground bg-background"
                />
              </div>
            </div>
          </div>
        );

      case "text":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Text
              </label>
              <textarea
                value={text}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                placeholder="Enter your text here..."
                rows={4}
                className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
          </div>
        );

      case "email":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                To (Email Address) *
              </label>
              <input
                type="email"
                value={emailTo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailTo(e.target.value)}
                placeholder="recipient@example.com"
                className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Subject
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailSubject(e.target.value)}
                placeholder="Email subject"
                className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Body
              </label>
              <textarea
                value={emailBody}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmailBody(e.target.value)}
                placeholder="Email body content..."
                rows={3}
                className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
          </div>
        );

      case "phone":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                placeholder="+1 555 123 4567 or 555-123-4567"
                className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Include country code for international numbers (e.g., +44, +91)
              </p>
            </div>
          </div>
        );

      case "wifi":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Network Name (SSID) *
              </label>
              <input
                type="text"
                value={wifiSsid}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWifiSsid(e.target.value)}
                placeholder="MyHomeWiFi"
                className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                type="text"
                value={wifiPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWifiPassword(e.target.value)}
                placeholder="WiFi password (leave empty for open networks)"
                className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Encryption
                </label>
                <select
                  value={wifiEncryption}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setWifiEncryption(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {WIFI_ENCRYPTION.map((enc) => (
                    <option key={enc.value} value={enc.value}>
                      {enc.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wifiHidden}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWifiHidden(e.target.checked)}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">Hidden Network</span>
                </label>
              </div>
            </div>
          </div>
        );

      case "sms":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={smsNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSmsNumber(e.target.value)}
                placeholder="+1 555 123 4567"
                className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <textarea
                value={smsBody}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSmsBody(e.target.value)}
                placeholder="Your SMS message..."
                rows={3}
                className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/60">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="ml-2 text-sm font-medium text-muted-foreground">
                  qr-generator.json
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Select QR Code Type
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {QR_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setActiveType(type.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-sm font-medium transition-all border-2 ${
                        activeType === type.id
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border bg-card text-foreground hover:border-primary/50"
                      }`}
                    >
                      <span className="text-xl">{type.icon}</span>
                      <span className="text-xs">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/30">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">
                    {QR_TYPES.find((t) => t.id === activeType)?.icon}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {QR_TYPES.find((t) => t.id === activeType)?.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {QR_TYPES.find((t) => t.id === activeType)?.description}
                    </p>
                  </div>
                </div>
                {renderTypeForm()}
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              ⚙️ QR Code Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Size
                </label>
                <select
                  value={size}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSize(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {SIZE_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Error Correction
                </label>
                <select
                  value={errorLevel}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setErrorLevel(e.target.value as "L" | "M" | "Q" | "H")}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%) - Recommended</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/60 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Preview
              </span>
              <span className="text-xs text-muted-foreground">
                {size}px
              </span>
            </div>

            <div className="p-6">
              <div
                className={`flex items-center justify-center p-6 rounded-xl mb-4 bg-muted/30 ${
                  qrDataUrl ? "" : "opacity-50"
                }`}
                style={{ minHeight: "280px" }}
              >
                {qrDataUrl ? (
                  <div className="relative">
                    <Image
                      src={qrDataUrl}
                      alt="Generated QR Code"
                      className="rounded-lg shadow-lg"
                      width={Math.min(size, 250)}
                      height={Math.min(size, 250)}
                    />
                    <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-primary"></div>
                    <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-primary"></div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-primary"></div>
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-5xl mb-3">📱</div>
                    <p className="text-sm text-muted-foreground">
                      {getQRContent()
                        ? "Generating QR code..."
                        : "Enter content to generate QR code"}
                    </p>
                  </div>
                )}
              </div>

              {qrDataUrl && (
                <div className="space-y-3">
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white rounded-xl transition-all bg-primary hover:opacity-90 shadow-lg shadow-primary/20"
                  >
                    ⬇️ Download PNG
                  </button>
                  <button
                    onClick={handleCopyImage}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all border-2 border-border text-foreground hover:border-primary hover:bg-primary/10"
                  >
                    {copied ? "✓ Copied!" : "📋 Copy Image"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              💡 Tips
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Test your QR code with your phone camera before sharing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Higher error correction allows QR code to be scanned even when damaged</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>WiFi QR codes let guests connect without typing passwords</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>URL QR codes automatically add https:// if missing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
