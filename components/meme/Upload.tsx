"use client";

import { FaUpload } from "react-icons/fa";

function Upload() {
  return (
    <div className="w-60 border-zinc-700 border-2 rounded flex flex-col gap-y-3 cursor-pointer hover:bg-zinc-900 text-center px-10 py-5 items-center">
      <FaUpload size={35} />
      Upload PNG, JPG, or GIF here (max 25MB)
      <input type="file" accept=".png, .jpg, .gif" className="hidden" />
    </div>
  );
}

export default Upload;
