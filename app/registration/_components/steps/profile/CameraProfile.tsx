"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { HiUser } from "react-icons/hi2";
import { LuPlus } from "react-icons/lu";

export default function CameraOrFileProfile() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [photo, setPhoto] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [showSelect, setShowSelect] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt" | "unknown">("unknown");
    const [checkingPermission, setCheckingPermission] = useState(false);
    const autoOpenRef = useRef(true);

    // ---- FILE PICKER ----
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        const url = URL.createObjectURL(selectedFile);
        setPhoto(url);
        setShowSelect(false);
    };

    // ---- CAMERA PERMISSION ----
    const checkCameraPermission = async (): Promise<boolean> => {
        try {
            if (!navigator.permissions || !navigator.permissions.query) {
                return await requestCameraAccess();
            }

            const result = await navigator.permissions.query({ name: "camera" as PermissionName });
            setCameraPermission(result.state as "granted" | "denied" | "prompt");

            if (result.state === "granted") {
                return true;
            } else if (result.state === "denied") {
                setCameraError("Camera permission has been denied. Please enable it in your device settings.");
                return false;
            } else {
                return await requestCameraAccess();
            }
        } catch (error) {
            console.warn("Permission check error:", error);
            return await requestCameraAccess();
        }
    };

    const requestCameraAccess = async (): Promise<boolean> => {
        try {
            setCheckingPermission(true);
            const constraints: MediaStreamConstraints = {
                video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false,
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setCameraPermission("granted");
            mediaStream.getTracks().forEach((track) => track.stop());
            setCheckingPermission(false);
            return true;
        } catch (error: unknown) {
            setCheckingPermission(false);
            let errorMsg = "Unable to access camera";
            if (error instanceof DOMException) {
                if (error.name === "NotFoundError") {
                    errorMsg = "No camera found on this device";
                } else if (error.name === "NotAllowedError") {
                    errorMsg = "Camera permission denied. Please enable camera access in settings.";
                } else if (error.name === "NotReadableError") {
                    errorMsg = "Camera is already in use by another app";
                } else if (error.name === "SecurityError") {
                    errorMsg = "Camera access requires HTTPS connection";
                }
            }
            setCameraError(errorMsg);
            setCameraPermission("denied");
            return false;
        }
    };

    // ---- CAMERA MODE ----
    const startCamera = async (facingMode: "user" | "environment" = "environment") => {
        try {
            setCameraError(null);
            setShowSelect(false);

            const hasPermission = await checkCameraPermission();
            if (!hasPermission) {
                return;
            }

            const constraints: MediaStreamConstraints = {
                video: {
                    facingMode: { ideal: facingMode },
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
            setShowCamera(true);

            // Set a small delay to ensure video element is rendered
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.play().catch((err) => {
                        console.warn("Play error:", err);
                    });
                }
            }, 100);
        } catch (error: unknown) {
            let errorMsg = "Failed to access camera";
            if (error instanceof DOMException) {
                if (error.name === "NotFoundError") {
                    errorMsg = "No camera found on this device";
                } else if (error.name === "NotAllowedError") {
                    errorMsg = "Camera permission denied";
                } else if (error.name === "NotReadableError") {
                    errorMsg = "Camera is already in use";
                }
            }
            setCameraError(errorMsg);
            console.error("Camera error:", error);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
        setShowCamera(false);
        setCameraError(null);
    };

    const takePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Draw image normally (no mirror for rear camera)
        ctx.drawImage(video, 0, 0);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
        setPhoto(dataUrl);
        stopCamera();
    };

    // Auto-open camera for mobile devices on mount
    React.useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

        // Auto-open camera for mobile only once
        if (isMobileDevice && autoOpenRef.current) {
            autoOpenRef.current = false;
            setTimeout(() => {
                startCamera("environment");
            }, 600);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col items-center gap-2">
            <label className="relative cursor-pointer group" onClick={() => setShowSelect(true)}>
                <div className="w-24 h-24 rounded-full bg-[#EFEFEF] flex items-center justify-center group-hover:border-[#958FFA] transition relative overflow-hidden">{photo ? <Image src={photo} alt="Profile" fill className="object-cover" /> : <HiUser className="text-5xl text-[#D4D4D4]" />}</div>

                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center border-2 border-gray-300 group-hover:border-[#958FFA] transition">
                    <LuPlus className="text-white" />
                </div>
            </label>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            {showSelect && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-xl w-sm sm:w-lg text-center space-y-3">
                        <h3 className="font-semibold mb-2">Pilih Opsi</h3>

                        {/* Camera Permission Error */}
                        {cameraError && <div className="w-full p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 text-center">{cameraError}</div>}

                        {/* Camera Buttons */}
                        <button className="w-full py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed" onClick={() => startCamera("environment")} disabled={cameraPermission === "denied" || checkingPermission}>
                            {checkingPermission ? "Meminta Akses..." : "Ambil Foto (Kamera Belakang)"}
                        </button>

                        <button className="w-full py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed" onClick={() => startCamera("user")} disabled={cameraPermission === "denied" || checkingPermission}>
                            {checkingPermission ? "Meminta Akses..." : "Ambil Foto (Selfie)"}
                        </button>

                        {/* File Upload */}
                        <button
                            className="w-full py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                            onClick={() => {
                                fileInputRef.current?.click();
                                setShowSelect(false);
                            }}
                        >
                            Pilih dari Galeri
                        </button>

                        <button className="text-gray-500 text-sm mt-1 hover:text-gray-700" onClick={() => setShowSelect(false)}>
                            Batal
                        </button>
                    </div>
                </div>
            )}

            {showCamera && stream && (
                <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 p-4">
                    <div className="w-full max-w-sm bg-black rounded-lg overflow-hidden">
                        <video 
                            ref={videoRef} 
                            className="w-full h-auto bg-black"
                            playsInline
                            autoPlay
                            muted
                            style={{ display: "block" }}
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button 
                            onClick={takePhoto} 
                            className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition text-lg"
                        >
                            📸 Ambil Foto
                        </button>

                        <button 
                            onClick={stopCamera} 
                            className="px-8 py-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition font-semibold text-lg"
                        >
                            ✕ Batal
                        </button>
                    </div>

                    <canvas ref={canvasRef} className="hidden" />
                </div>
            )}

            <span className="text-sm text-gray-600 mt-4">Tambahkan foto profil</span>
        </div>
    );
}
