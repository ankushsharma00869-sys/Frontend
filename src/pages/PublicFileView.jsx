import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiEndPoints from "../Util/apiEndpoints";
import toast from "react-hot-toast";
import { Copy, Share2, Download, File } from "lucide-react";

const PublicFileView = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareModal, setShareModal] = useState(false);

  const { fileId } = useParams();

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await axios.get(
          apiEndPoints.PUBLIC_FILE_VIEW(fileId)
        );
        setFile(res.data);
      } catch {
        toast.error("File not found or private");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [fileId]);

  const handleDownload = async () => {
    try {
      const res = await axios.get(
        apiEndPoints.DOWNLOAD_FILE(fileId),
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");

      a.href = url;
      a.download = file.name;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    }
  };

  const copyLink = () => {
    const link = `http://localhost:5173/file/${fileId}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (!file) return null;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="flex justify-between items-center px-8 py-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <Share2 className="text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-700">CloudShare</h1>
        </div>

        <button
          onClick={() => setShareModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
        >
          <Copy size={16} />
          Share Link
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="flex justify-center mt-16">
        <div className="bg-white w-130 p-10 rounded-xl shadow-md text-center">

          {/* ICON */}
          <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <File size={32} className="text-blue-600" />
          </div>

          {/* NAME */}
          <h2 className="mt-5 text-xl font-semibold text-gray-800">
            {file.name}
          </h2>

          {/* META */}
          <p className="text-gray-500 text-sm mt-1">
            {(file.size / 1024).toFixed(2)} KB • {file.createdAt}
          </p>

          {/* TYPE */}
          <span className="inline-block mt-3 px-3 py-1 bg-gray-100 text-xs rounded-full">
            {file.type}
          </span>

          {/* DOWNLOAD */}
          <button
            onClick={handleDownload}
            className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            <Download size={16} className="inline mr-2" />
            Download File
          </button>

          {/* DIVIDER */}
          <hr className="my-8" />

          {/* FILE INFO */}
          <div className="text-left text-sm">
            <h3 className="font-semibold mb-4 text-gray-700">
              File Information
            </h3>

            <div className="flex justify-between py-1">
              <span className="text-gray-500">File Name:</span>
              <span className="text-gray-800">{file.name}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-gray-500">File Type:</span>
              <span className="text-gray-800">{file.type}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-gray-500">File Size:</span>
              <span className="text-gray-800">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-gray-500">Shared:</span>
              <span className="text-gray-800">{file.createdAt}</span>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-8 bg-blue-50 text-blue-600 p-3 rounded-lg text-sm">
            This file has been shared publicly. Anyone with this link can view and download it.
          </div>
        </div>
      </div>

      {/* SHARE MODAL */}
      {shareModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-md w-80 text-center">

            <h3 className="font-semibold text-lg mb-3">Share Link</h3>

            <input
              value={`http://localhost:5173/file/${fileId}`}
              readOnly
              className="w-full border p-2 rounded mb-3"
            />

            <button
              onClick={copyLink}
              className="w-full bg-blue-600 text-white py-2 rounded mb-2 hover:bg-blue-700"
            >
              Copy Link
            </button>

            <button
              onClick={() => setShareModal(false)}
              className="text-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicFileView;