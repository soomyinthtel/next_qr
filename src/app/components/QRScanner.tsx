import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QrScanner: React.FC = () => {
  const qrCodeRef = useRef<HTMLDivElement | null>(null);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // To capture errors for UI feedback

  useEffect(() => {
    const qrCodeInstance = new Html5Qrcode("qr-reader");
    setHtml5QrCode(qrCodeInstance);

    return () => {
      qrCodeInstance.stop().catch((err) => {
        setError(`Error stopping QR code scanner: ${err}`);
      });
    };
  }, []);

  const startScanning = () => {
    if (!html5QrCode) return;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    html5QrCode
      .start(
        { facingMode: "user" }, // Use user camera
        config,
        (decodedText: string) => {
          console.log(`QR Code scanned: ${decodedText}`);
          stopScanning();
          // Handle successful scan here (e.g., display result)
        },
        (errorMessage: string) => {
          console.log(`Error scanning: ${errorMessage}`);
        }
      )
      .then(() => {
        setScanning(true);
        setError(null); // Reset error state on successful start
      })
      .catch((err) => {
        setError(`Error starting QR code scanner: ${err}`);
      });
  };

  const stopScanning = () => {
    if (!html5QrCode) return;

    html5QrCode
      .stop()
      .then(() => {
        setScanning(false);
        setError(null);
      })
      .catch((err) => {
        setError(`Error stopping QR code scanner: ${err}`);
      });
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold mb-4">Scan QR Code</h1>
        <div id="qr-reader" ref={qrCodeRef} className="w-full h-full"></div>
      </div>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      <div style={{ marginTop: "10px" }}>
        <button onClick={startScanning} disabled={scanning}>
          Start Scanning
        </button>
        <button onClick={stopScanning} disabled={!scanning}>
          Stop Scanning
        </button>
      </div>
    </div>
  );
};

export default QrScanner;
