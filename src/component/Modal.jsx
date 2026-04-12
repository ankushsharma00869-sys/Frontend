import React from "react";
import { X } from "lucide-react";

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

            {/* Modal */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Delete File
                    </h2>

                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4">
                    <p className="text-gray-600 text-sm">
                        Are you sure you want to delete this file? This action cannot be undone.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-5 py-3 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;