import React from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";

const UploadBox = ({
    files = [],
    onFileChange,
    onUpload,
    uploading = false,
    onRemoveFile,
    remainingCredits,
    isUploadDisabled,

    // reusable props
    maxFiles = 10,
    accept = {},
    title = "Drag & drop files here or click",
    onError, // ✅ NEW
}) => {

    const onDrop = (acceptedFiles) => {
        if (files.length + acceptedFiles.length > maxFiles) {
            onError?.(`You can only upload a maximum of ${maxFiles} files at once`);
            return;
        }

        onFileChange({
            target: {
                files: acceptedFiles,
            },
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        accept,
        preventDropOnDocument: true,
    });

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">

            {/* 🔥 Drag Area */}
            <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition ${isDragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
            >
                <input {...getInputProps()} />

                <UploadCloud size={40} className="text-blue-500 mb-2" />

                <p className="text-gray-700 font-medium text-center">
                    {isDragActive ? "Drop files here..." : title}
                </p>

                <p className="text-sm text-gray-400 mt-1">
                    Max files: {maxFiles}
                </p>
            </div>

            {/* 📂 FILE LIST */}
            {files.length > 0 && (
                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-lg"
                        >
                            <span className="text-sm truncate w-[80%]">
                                {file.name}
                            </span>

                            <button
                                onClick={() => onRemoveFile(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* 💳 Credits */}
            {remainingCredits !== undefined && (
                <div className="mt-4 text-sm text-gray-600">
                    Remaining Credits:{" "}
                    <span className="font-semibold">{remainingCredits}</span>
                </div>
            )}

            {/* 🚀 Upload Button */}
            <button
                onClick={onUpload}
                disabled={isUploadDisabled}
                className={`mt-4 w-full py-2 rounded-lg text-white font-medium transition ${isUploadDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
            >
                {uploading ? "Uploading..." : "Upload Files"}
            </button>
        </div>
    );
};

export default UploadBox;