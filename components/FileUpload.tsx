"use client";

import React, { useCallback, useState } from "react";
import { Upload, FileJson, Shield, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  onFileSelect: (file: File) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function FileUpload({
  onFileSelect,
  isLoading,
  error,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type === "application/json" || file.name.endsWith(".json")) {
          setFileName(file.name);
          await onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        setFileName(file.name);
        await onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 px-4 py-3 rounded-xl border border-emerald-400/20"
      >
        <Shield className="w-4 h-4 flex-shrink-0" />
        <span>
          Your data never leaves your device — all analysis happens in your
          browser
        </span>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center
            w-full h-64 px-6 py-8
            border-2 border-dashed rounded-2xl
            cursor-pointer transition-all duration-300
            ${
              isDragging
                ? "border-purple-400 bg-purple-400/10 scale-[1.02]"
                : "border-gray-600 bg-gray-800/50 hover:border-purple-400/50 hover:bg-gray-800"
            }
            ${isLoading ? "pointer-events-none opacity-70" : ""}
          `}
        >
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileInput}
            className="hidden"
            disabled={isLoading}
          />

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
                <p className="text-gray-300">Processing your data...</p>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                  <div className="relative p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                    {isDragging ? (
                      <FileJson className="w-10 h-10 text-white" />
                    ) : (
                      <Upload className="w-10 h-10 text-white" />
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-lg font-medium text-white mb-1">
                    {isDragging
                      ? "Drop your file here"
                      : "Upload conversations.json"}
                  </p>
                  <p className="text-sm text-gray-400">
                    Drag and drop or click to browse
                  </p>
                </div>

                {fileName && !error && (
                  <p className="text-sm text-purple-400 flex items-center gap-2">
                    <FileJson className="w-4 h-4" />
                    {fileName}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </label>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 flex items-start gap-3 text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-xl border border-red-400/20"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-gray-500 mb-2">
          Don&apos;t have your export yet?
        </p>
        <ol className="text-xs text-gray-600 space-y-1">
          <li>1. Go to ChatGPT → Settings → Data controls</li>
          <li>2. Click &quot;Export data&quot; and confirm</li>
          <li>3. Download the zip file from your email</li>
          <li>4. Extract and upload the conversations.json file</li>
        </ol>
      </motion.div>
    </div>
  );
}
