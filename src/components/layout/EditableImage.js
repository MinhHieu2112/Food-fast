"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function EditableImage({value, onUpload }) {
  const [imageUrl, setImageUrl] = useState(value || '');
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    setImageUrl(value || '');
  }, [value]);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const data = new FormData();
    data.append("file", file);

    // Gửi đến API Cloudinary
    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    console.log("📡 Response status:", res.status);

    const result = await res.json();

    console.log("📤 Raw API result:", result);

    if (result?.url) {
      setImageUrl(result.url);
      if (onUpload) 
        onUpload(result.url);
    }
    setUploading(false);
  }

  return (
    <div className="p-2 rounded-lg relative w-[150px]">
      <Image
        className="rounded-lg w-full h-auto mb-3 object-cover"
        src={imageUrl || "/default-avatar.png"}
        width={200}
        height={200}
        alt="avatar"
      />
      <label className="block text-center cursor-pointer">
        <input type="file" className="hidden" onChange={handleFileChange} />
        <span className="block border rounded-lg p-2 hover:bg-gray-100 transition">
          {uploading ? "Uploading..." : "Edit"}
        </span>
      </label>
    </div>
  );
}
