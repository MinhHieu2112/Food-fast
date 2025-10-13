'use client';

import Image from "next/image";
import { useState } from "react";

export default function UploadImageBox({ defaultImage, onUpload }) {
  const [imageUrl, setImageUrl] = useState(defaultImage || "/default-avatar.png");
  const [uploading, setUploading] = useState(false);

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

    const result = await res.json();
    if (result?.url) {
      setImageUrl(result.url);
      if (onUpload) onUpload(result.url);
    }
    setUploading(false);
  }

  return (
    <div className="p-2 rounded-lg relative w-[250px]">
      <Image
        className="rounded-lg w-full h-auto mb-3 object-cover"
        src={imageUrl || "/default-avatar.png"}
        width={250}
        height={250}
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
