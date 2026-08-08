import React, { useEffect, useId, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import {
  MENU_IMAGE_MAX_BYTES,
  MENU_IMAGE_TYPES,
  validateMenuImage,
} from "../lib/menuService";

export function MenuImageUpload({
  currentImage,
  file,
  onFileChange,
  disabled = false,
  required = false,
}) {
  const inputId = useId();
  const [previewUrl, setPreviewUrl] = useState(currentImage || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl(currentImage || "");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [currentImage, file]);

  const handleChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    if (!selectedFile) return;

    const validationError = validateMenuImage(selectedFile);
    if (validationError) {
      setError(validationError);
      event.target.value = "";
      onFileChange(null);
      return;
    }

    setError("");
    onFileChange(selectedFile);
  };

  const clearSelection = () => {
    setError("");
    onFileChange(null);
  };

  return (
    <div className="rounded-xl border-2 border-[#1E1E1E] bg-[#FEFDF9] p-3.5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl border-2 border-[#1E1E1E] bg-[#E1ECD3] sm:w-40">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Pratinjau gambar menu"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#6B7860]">
              <ImagePlus size={32} aria-hidden="true" />
            </div>
          )}
          <span className="absolute bottom-1.5 right-1.5 rounded bg-[#1E1E1E] px-1.5 py-0.5 font-mono text-[8px] text-white">
            PREVIEW
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <label className="mb-1 block font-mono text-[10px] uppercase text-[#6B7860]" htmlFor={inputId}>
            Upload gambar hidangan {required && <span className="text-red-500">*</span>}
          </label>
          <p className="mb-3 text-[11px] font-medium leading-relaxed text-gray-600">
            JPG, PNG, atau WebP. Maksimal {MENU_IMAGE_MAX_BYTES / 1024 / 1024} MB. File disimpan ke Supabase Storage saat menu disimpan.
          </p>

          <input
            id={inputId}
            type="file"
            accept={MENU_IMAGE_TYPES.join(",")}
            onChange={handleChange}
            disabled={disabled}
            required={required && !currentImage && !file}
            className="sr-only"
          />

          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor={inputId}
              aria-disabled={disabled}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border-2 border-[#1E1E1E] bg-white px-3 py-2 font-mono text-[10px] font-bold uppercase shadow-[2px_2px_0_#1E1E1E] transition-colors hover:bg-[#E1ECD3] ${disabled ? "pointer-events-none opacity-50" : ""}`}
            >
              <ImagePlus size={14} aria-hidden="true" />
              {file ? "Ganti File" : currentImage ? "Ganti Gambar" : "Pilih Gambar"}
            </label>

            {file && (
              <button
                type="button"
                onClick={clearSelection}
                disabled={disabled}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-2 font-mono text-[10px] font-bold uppercase text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                <X size={13} aria-hidden="true" />
                Batal
              </button>
            )}
          </div>

          {file && (
            <p className="mt-2 truncate font-mono text-[10px] text-[#1E1E1E]">
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
          {error && <p className="mt-2 text-[11px] font-bold text-red-700" role="alert">{error}</p>}
        </div>
      </div>
    </div>
  );
}
