import React from "react";
import { Copy, X, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const LinkShareModal = ({ isOpen, onClose, link }) => {
    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        toast.success("Link copied!");
    };

    const handleOpen = () => {
        window.open(link, "_blank");
    };

    const handleWhatsApp = () => {
        const text = `Check this file: ${link}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, "_blank");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

            <div className="w-full max-w-md bg-white rounded-xl shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Share File
                    </h2>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    <p className="text-sm text-gray-600 mb-3">
                        Share this link with others:
                    </p>

                    {/* Link Box */}
                    <div className="flex items-center border-2 border-purple-500 rounded-lg overflow-hidden">
                        <input
                            type="text"
                            value={link}
                            readOnly
                            className="flex-1 px-3 py-2 outline-none text-sm"
                        />
                        <button
                            onClick={handleCopy}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                        >
                            <Copy size={18} />
                        </button>
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                        Anyone with this link can access this file.
                    </p>

                    {/* 🔥 Action Buttons */}
                    <div className="flex gap-3 mt-4">

                        <button
                            onClick={handleOpen}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-100"
                        >
                            <ExternalLink size={16} />
                            Open Link
                        </button>

                        <button
                            onClick={handleWhatsApp}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            📱 WhatsApp
                        </button>

                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300"
                    >
                        Close
                    </button>

                    <button
                        onClick={handleCopy}
                        className="px-4 py-1.5 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                    >
                        Copy
                    </button>
                </div>

            </div>
        </div>
    );
};

export default LinkShareModal;