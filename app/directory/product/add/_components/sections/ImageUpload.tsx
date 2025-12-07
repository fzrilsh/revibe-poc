"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { LuPlus } from "react-icons/lu";

interface ImageUploadProps {
    imagePreview?: string;
    onImageChange: (file: File | null, dataUrl?: string) => void;
}

export default function ImageUpload({ imagePreview, onImageChange }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [photo, setPhoto] = useState<string | null>(imagePreview ?? null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [showSelect, setShowSelect] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt" | "unknown">("unknown");
    const [checkingPermission, setCheckingPermission] = useState(false);

    // File picker
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPhoto(url);
        onImageChange(file, url);
        setShowSelect(false);
    };

    // Permission helpers
    const requestCameraAccess = async (): Promise<boolean> => {
        try {
            setCheckingPermission(true);
            const constraints: MediaStreamConstraints = { video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false };
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setCameraPermission("granted");
            mediaStream.getTracks().forEach((track) => track.stop());
            setCheckingPermission(false);
            return true;
        } catch (error: unknown) {
            setCheckingPermission(false);
            let errorMsg = "Unable to access camera";
            if (error instanceof DOMException) {
                if (error.name === "NotFoundError") errorMsg = "No camera found";
                else if (error.name === "NotAllowedError") errorMsg = "Camera permission denied";
                else if (error.name === "NotReadableError") errorMsg = "Camera in use";
                else if (error.name === "SecurityError") errorMsg = "Camera requires HTTPS";
            }
            setCameraError(errorMsg);
            setCameraPermission("denied");
            return false;
        }
    };

    const checkCameraPermission = async (): Promise<boolean> => {
        try {
            if (!navigator.permissions || !navigator.permissions.query) {
                return await requestCameraAccess();
            }
            const result = await navigator.permissions.query({ name: "camera" as PermissionName });
            setCameraPermission(result.state as "granted" | "denied" | "prompt");
            if (result.state === "granted") return true;
            if (result.state === "denied") {
                setCameraError("Camera permission denied. Enable it in settings.");
                return false;
            }
            return await requestCameraAccess();
        } catch (err) {
            console.warn("Permission check error", err);
            return await requestCameraAccess();
        }
    };

    // Camera flow
    const startCamera = async (facingMode: "user" | "environment" = "environment") => {
        setCameraError(null);
        setShowSelect(false);
        const hasPermission = await checkCameraPermission();
        if (!hasPermission) return;

        try {
            const constraints: MediaStreamConstraints = {
                video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false,
            };
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
            setShowCamera(true);

            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.play().catch((err) => console.warn("video play error", err));
                }
            }, 80);
        } catch (error: unknown) {
            let errorMsg = "Failed to access camera";
            if (error instanceof DOMException) {
                if (error.name === "NotFoundError") errorMsg = "No camera found";
                else if (error.name === "NotAllowedError") errorMsg = "Camera permission denied";
                else if (error.name === "NotReadableError") errorMsg = "Camera in use";
            }
            setCameraError(errorMsg);
        }
    };

    const stopCamera = useCallback(() => {
        setShowCamera(false);
        setStream((prev) => {
            if (prev) {
                prev.getTracks().forEach((t) => t.stop());
            }
            return null;
        });
    }, []);

    const takePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
        
        // Convert dataUrl to File object
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" });
                setPhoto(dataUrl);
                onImageChange(file, dataUrl);
            }
        }, "image/jpeg", 0.95);
        
        stopCamera();
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => stopCamera();
    }, [stopCamera]);

    return (
        <div className="flex flex-col items-center gap-2">
            <label className="group cursor-pointer relative w-32 h-32 rounded-md bg-gray-200 flex items-center justify-center" onClick={() => setShowSelect(true)}>
                {photo ? (
                    <Image src={photo} alt="Preview" fill className="object-cover" />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                        <svg width="79" height="51" viewBox="0 0 79 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3.95425 50.5556H74.378C77.5287 50.5556 79.4105 47.1651 77.6673 44.6291L62.4813 22.5365C61.3081 20.8298 58.9492 20.323 57.1381 21.3888L44.4483 28.8561C42.6763 29.8988 40.3714 29.4386 39.1722 27.8027L26.3142 10.2622C24.6214 7.95293 21.0074 8.16532 19.6167 10.6558L0.479099 44.9283C-0.940405 47.4704 0.964861 50.5556 3.95425 50.5556Z"
                                fill="#B7B7B7"
                                fillOpacity="0.7"
                            />
                            <path d="M56.5679 8.34644C56.5679 12.9561 52.8111 16.6929 48.1768 16.6929C43.5425 16.6929 39.7857 12.9561 39.7857 8.34644C39.7857 3.73683 43.5425 0 48.1768 0C52.8111 0 56.5679 3.73683 56.5679 8.34644Z" fill="#B7B7B7" fillOpacity="0.7" />
                        </svg>

                        <div className="absolute bg-neutral-950 rounded-full text-white p-2 flex items-center justify-center -bottom-5">
                            <LuPlus className="text-xl" />
                        </div>
                    </div>
                )}
            </label>

            <input ref={fileInputRef} id="image" name="image" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            {showSelect && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-white p-5 rounded-xl w-full max-w-sm text-center space-y-3">
                        <h3 className="font-semibold">Pilih Opsi</h3>
                        {cameraError && <div className="w-full p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">{cameraError}</div>}
                        <button className="w-full py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:bg-gray-400" onClick={() => startCamera("environment")} disabled={cameraPermission === "denied" || checkingPermission}>
                            {checkingPermission ? "Meminta akses..." : "Ambil Foto (Kamera Belakang)"}
                        </button>
                        <button className="w-full py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition disabled:bg-gray-400" onClick={() => startCamera("user")} disabled={cameraPermission === "denied" || checkingPermission}>
                            {checkingPermission ? "Meminta akses..." : "Ambil Foto (Selfie)"}
                        </button>
                        <button
                            className="w-full py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                            onClick={() => {
                                fileInputRef.current?.click();
                                setShowSelect(false);
                            }}
                        >
                            Pilih dari Galeri
                        </button>
                        <button className="text-gray-500 text-sm hover:text-gray-700" onClick={() => setShowSelect(false)}>
                            Batal
                        </button>
                    </div>
                </div>
            )}

            {showCamera && stream && (
                <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 p-4">
                    <div className="w-full max-w-sm bg-black rounded-lg overflow-hidden">
                        <video ref={videoRef} className="w-full h-auto bg-black" playsInline autoPlay muted />
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button onClick={takePhoto} className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition text-lg">
                            📸 Ambil Foto
                        </button>
                        <button onClick={stopCamera} className="px-8 py-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition font-semibold text-lg">
                            ✕ Batal
                        </button>
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                </div>
            )}
        </div>
    );
}
