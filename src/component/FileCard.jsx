import {
    Copy,
    Download,
    Eye,
    FileIcon,
    FileText,
    Globe,
    Image,
    Lock,
    Music,
    Trash,
    Video
} from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const FileCard = ({ file, onDelete, onTogglePublic, onDownload }) => {
    const [showActions, setShowActions] = useState(false);

    // ✅ SAFE ID (MongoDB + API safe)
    const fileId = file?.id || file?._id;

    const getFileIcon = () => {
        const ext = file?.name?.split('.')?.pop()?.toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext))
            return <Image size={40} className="text-purple-500" />;

        if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext))
            return <Video size={40} className="text-blue-500" />;

        if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(ext))
            return <Music size={40} className="text-green-500" />;

        if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext))
            return <FileText size={40} className="text-blue-500" />;

        return <FileIcon size={40} className="text-gray-400" />;
    };

    const formatSize = (bytes = 0) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    // ✅ PRODUCTION SAFE LINK (works localhost + vercel)
    const publicLink = `${window.location.origin}/file/${fileId}`;

    const handleCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(publicLink);
        toast.success("Link copied!");
    };

    return (
        <div
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1"
        >
            {/* TOP ICON */}
            <div className="h-32 bg-linear-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
                {getFileIcon()}
            </div>

            {/* PUBLIC / PRIVATE BADGE */}
            <div className="absolute top-2 right-2">
                <div className={`p-1.5 rounded-full ${file?.isPublic ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {file?.isPublic
                        ? <Globe size={14} className="text-green-600" />
                        : <Lock size={14} className="text-gray-500" />}
                </div>
            </div>

            {/* INFO */}
            <div className="p-3 text-center">
                <h3 className="text-sm font-medium text-gray-800 truncate">
                    {file?.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    {formatSize(file?.size)}
                </p>
            </div>

            {/* ACTION OVERLAY */}
            <div
                className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-all duration-300 
                ${showActions ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >

                {/* COPY LINK */}
                {file?.isPublic && (
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-full bg-white/90 hover:bg-purple-100 hover:text-purple-600"
                    >
                        <Copy size={16} />
                    </button>
                )}

                {/* VIEW */}
                {file?.isPublic && (
                    <a
                        href={publicLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-full bg-white/90 hover:bg-blue-100 hover:text-blue-600"
                    >
                        <Eye size={16} />
                    </a>
                )}

                {/* DOWNLOAD */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDownload(file);
                    }}
                    className="p-2 rounded-full bg-white/90 hover:bg-green-100 hover:text-green-600"
                >
                    <Download size={16} />
                </button>

                {/* TOGGLE PUBLIC */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onTogglePublic(file);
                    }}
                    className="p-2 rounded-full bg-white/90 hover:bg-amber-100 hover:text-amber-600"
                >
                    {file?.isPublic ? <Lock size={16} /> : <Globe size={16} />}
                </button>

                {/* DELETE */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(fileId);
                    }}
                    className="p-2 rounded-full bg-white/90 hover:bg-red-100 hover:text-red-600"
                >
                    <Trash size={16} />
                </button>
            </div>
        </div>
    );
};

export default FileCard;