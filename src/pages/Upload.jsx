import React, { useContext, useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { useAuth } from '@clerk/clerk-react';
import { UserCreditsContext } from '../context/UserCreditsContext';
import { AlertCircle } from 'lucide-react';
import axios from 'axios';
import apiEndPoints from '../Util/apiEndpoints';
import UploadBox from "../component/UploadBox.jsx";

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const { getToken } = useAuth();
  const { credits, setCredits } = useContext(UserCreditsContext);

  const MAX_FILES = 10;

  // ✅ FIXED
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target?.files || []);

    if (files.length + selectedFiles.length > MAX_FILES) {
      setMessage(`You can only upload a maximum of ${MAX_FILES} files at once`);
      setMessageType("error");
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
    setMessage("");
    setMessageType("");
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setMessage("");
    setMessageType("");
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage("Please select at least one file to upload");
      setMessageType("error");
      return;
    }

    if (files.length > MAX_FILES) {
      setMessage(`You can only upload a maximum of ${MAX_FILES} files at once`);
      setMessageType("error");
      return;
    }

    setUploading(true);
    setMessage("Uploading files...");
    setMessageType("info");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const token = await getToken();

      const response = await axios.post(
        apiEndPoints.UPLOAD_FILE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.remainingCredits !== undefined) {
        setCredits(response.data.remainingCredits);
      }

      setMessage("Files uploaded successfully.");
      setMessageType("success");
      setFiles([]);

    } catch (error) {
      console.error("Error uploading files:", error);

      setMessage(
        error.response?.data?.message ||
        "Error uploading files. Please try again"
      );
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  const isUploadDisabled =
    files.length === 0 ||
    files.length > MAX_FILES ||
    credits <= 0 ||
    files.length > credits;

  return (
    <DashboardLayout activeMenu="Upload">
      <div className="p-6">

        {/* ✅ ERROR / SUCCESS MESSAGE */}
        {message && (
          <div
            className={`mb-4 p-3 rounded flex items-center gap-2 ${messageType === "error"
                ? "bg-red-50 text-red-700"
                : messageType === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-blue-50 text-blue-700"
              }`}
          >
            {messageType === "error" && <AlertCircle size={20} />}
            {message}
          </div>
        )}

        <UploadBox
          files={files}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
          uploading={uploading}
          onRemoveFile={handleRemoveFile}
          remainingCredits={credits}
          isUploadDisabled={isUploadDisabled}

          // ✅ IMPORTANT
          onError={(msg) => {
            setMessage(msg);
            setMessageType("error");
          }}
        />

      </div>
    </DashboardLayout>
  );
};

export default Upload;