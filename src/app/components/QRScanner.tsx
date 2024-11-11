import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QrScanner: React.FC = () => {
  const qrCodeRef = useRef<HTMLDivElement | null>(null);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  //   const [facingMode, setFacingMode] = useState("environment");
  const [scanning, setScanning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeResult, setQrCodeResult] = useState<string | null>(null); // Store the result of image scan
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const qrCodeInstance = new Html5Qrcode("qr-reader");
    setHtml5QrCode(qrCodeInstance);

    return () => {
      qrCodeInstance.stop().catch((err) => {
        setError(`Error stopping QR code scanner: ${err}`);
      });
    };
  }, []);

  //   const switchCamera = () => {
  //     const newFacingMode = facingMode === "user" ? "environment" : "user";
  //     setFacingMode(newFacingMode);
  //     stopScanning(); // Stop scanning before switching the camera
  //   };

  const startScanning = () => {
    if (!html5QrCode) return;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    html5QrCode
      .start(
        { facingMode: "environment" }, // Use user camera
        config,
        (decodedText: string) => {
          console.log(`QR Code scanned: ${decodedText}`);
          setQrCodeResult(decodedText); // Set result of the scan
          stopScanning(); // Stop scanning after successful scan
        },
        (errorMessage: string) => {
          console.log(`Error scanning: ${errorMessage}`);
        }
      )
      .then(() => {
        setScanning(true);
        setError(null);
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

  const handleImageScan = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    if (!file) return;
    if (!html5QrCode) return;
    html5QrCode
      .scanFile(file)
      .then((decodedText) => {
        console.log(`QR Code scanned from image: ${decodedText}`);
        setQrCodeResult(decodedText); // Set result from image scan
      })
      .catch((err) => {
        setError(`Error scanning QR code from image: ${err}`);
      });
  };

  return (
    <div className="flex flex-col justify-between h-screen py-4 px-2">
      <div className="flex items-center justify-between px-2">
        <div>🔙</div>
        <p className="font-semibold">Scan QR Code</p>
        <div>
          <button onClick={() => fileInputRef.current?.click()}>Album</button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageScan}
          />
        </div>
      </div>
      <div className="relative">
        <div
          id="qr-reader"
          ref={qrCodeRef}
          className="w-full h-auto z-10"
        ></div>
        <p className="w-full absolute p-4 z-20 text-center transform -translate-x-1/2 -translate-y-1/2 bottom-0 left-1/2 text-white">
          Align QR code within frame to scan
        </p>
      </div>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      {qrCodeResult && (
        <div style={{ marginTop: "10px" }}>
          <p>QR Code result: {qrCodeResult}</p>
        </div>
      )}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={startScanning}
          disabled={scanning}
          className="border p-2 rounded-sm"
        >
          Start Scanning (Camera)
        </button>
        <button
          onClick={stopScanning}
          disabled={!scanning}
          className="border p-2 rounded-sm"
        >
          Stop Scanning
        </button>
      </div>
      {/* <button onClick={switchCamera}>Switch Camera</button> */}
    </div>
  );
};

export default QrScanner;
