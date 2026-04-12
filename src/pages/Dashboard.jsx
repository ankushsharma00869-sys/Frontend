import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import apiEndPoints from "../Util/apiEndpoints";
import axios from "axios";

import {
  Upload,
  FileText,
  FileImage,
  File,
  Lock
} from "lucide-react";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [remainingUploads, setRemainingUploads] = useState(5);

  const { getToken } = useAuth();
  const { fetchUserCredits } = useContext(UserCreditsContext);

  const MAX_FILES = 5;

  // ✅ FILE ICON
  const getFileIcon = (name) => {
    const ext = name?.split(".").pop()?.toLowerCase();

    if (ext === "pdf")
      return <FileText className="w-5 h-5 text-orange-500" />;

    if (["png", "jpg", "jpeg"].includes(ext))
      return <FileImage className="w-5 h-5 text-purple-500" />;

    return <File className="w-5 h-5 text-blue-500" />;
  };

  // ✅ FORMAT SIZE
  const formatSize = (size) => {
    if (size > 1024 * 1024)
      return (size / (1024 * 1024)).toFixed(1) + " MB";
    return (size / 1024).toFixed(1) + " KB";
  };

  // ✅ FETCH FILES
  const fetchRecentFiles = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const res = await axios.get(apiEndPoints.FETCH_FILES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sorted = res.data
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
        .slice(0, 5);

      setFiles(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentFiles();
  }, []);

  // ✅ COUNT FIX
  useEffect(() => {
    setRemainingUploads(MAX_FILES - uploadingFiles.length);
  }, [uploadingFiles]);

  // ✅ FILE CHANGE
  const handleFileChange = (e) => {
    setUploadingFiles(Array.from(e.target.files));
  };

  // ✅ REMOVE FILE
  const handleRemoveFile = (index) => {
    const updated = [...uploadingFiles];
    updated.splice(index, 1);
    setUploadingFiles(updated);
  };

  // ✅ UPLOAD
  const handleUpload = async () => {
    if (uploadingFiles.length === 0) {
      setMessage("Please select files");
      setMessageType("error");
      return;
    }

    setUploading(true);
    setMessage("Uploading...");
    setMessageType("info");

    const formData = new FormData();
    uploadingFiles.forEach((file) =>
      formData.append("files", file)
    );

    try {
      const token = await getToken();

      await axios.post(apiEndPoints.UPLOAD_FILE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Upload successful");
      setMessageType("success");
      setUploadingFiles([]);

      fetchRecentFiles();
      fetchUserCredits();
    } catch (err) {
      setMessage("Upload failed");
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="p-6">

        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-2">My Drive</h1>
        <p className="text-gray-500 mb-6">
          Upload, manage, and share your files securely
        </p>

        {/* MESSAGE */}
        {message && (
          <div
            className={`mb-4 p-3 rounded ${messageType === "error"
              ? "bg-red-50 text-red-600"
              : messageType === "success"
                ? "bg-green-50 text-green-600"
                : "bg-purple-50 text-purple-600"
              }`}
          >
            {message}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">

          {/* LEFT - UPLOAD BOX */}
          <div className="w-full md:w-[40%]">

            <div className="bg-white p-4 rounded-2xl shadow border">

              <div className="flex justify-between mb-2">
                <h2 className="font-semibold">Upload Files</h2>
                <span className="text-sm text-gray-500">
                  {remainingUploads} of {MAX_FILES} remaining
                </span>
              </div>

              <label className="border-2 border-dashed border-purple-400 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 transition">

                <Upload className="w-8 h-8 text-purple-500 mb-2" />

                <p className="text-sm text-gray-600">
                  Drag & drop files here
                </p>

                <span className="text-xs text-gray-400">
                  or click to browse
                </span>

                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* SELECTED FILES */}
              <div className="mt-3">
                {uploadingFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm bg-gray-100 p-2 rounded mb-2"
                  >
                    <span>{file.name}</span>

                    <button
                      onClick={() => handleRemoveFile(i)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleUpload}
                className="w-full mt-3 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>

          {/* RIGHT - RECENT FILES */}
          <div className="w-full md:w-[60%]">

            <div className="bg-white rounded-2xl shadow border">

              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">
                  Recent Files ({files.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">

                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="text-left px-6 py-3">Name</th>
                      <th className="text-center px-6 py-3">Size</th>
                      <th className="text-center px-6 py-3">Uploaded By</th>
                      <th className="text-center px-6 py-3">Modified</th>
                      <th className="text-center px-6 py-3">Sharing</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {files.map((file, i) => (
                      <tr key={i} className="hover:bg-gray-50">

                        <td className="px-6 py-4 flex items-center gap-3">
                          {getFileIcon(file.name)}
                          <span className="truncate max-w-55">
                            {file.name}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          {formatSize(file.size)}
                        </td>

                        <td className="px-6 py-4 text-center text-gray-600">
                          You
                        </td>

                        <td className="px-6 py-4 text-center text-gray-600">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-600">
                            <Lock className="w-4 h-4" />
                            Private
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;