declare module "qrcode" {
  interface QRCodeOptions {
    width?: number;
    margin?: number;
    errorCorrectionLevel?: "L" | "M" | "Q" | "H";
    color?: {
      dark?: string;
      light?: string;
    };
  }

  function toDataURL(text: string, options?: QRCodeOptions): Promise<string>;
  function toString(text: string, options?: QRCodeOptions): Promise<string>;
  function toCanvas(
    canvasElement: HTMLCanvasElement,
    text: string,
    options?: QRCodeOptions
  ): Promise<void>;
}
