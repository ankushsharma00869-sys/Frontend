import React, { useState, useEffect } from 'react';
import apiEndPoints from "../Util/apiEndpoints.js";
import DashboardLayout from '../layout/DashboardLayout';
import {
  Grid, List, File, Globe, Lock, Copy,
  Download, Eye, Trash2, Image, Video, Music, FileText
} from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import FileCard from '../component/FileCard';
import ConfirmationDialog from '../component/ConfirmationDialog.jsx';
import LinkShareModal from '../component/LinkShareModal.jsx';

function MyFiles() {

  const [files, setFiles] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    fileId: null
  });

  const [shareModal, setShareModal] = useState({
    isOpen: false,
    fileId: null,
    link: ""
  });

  // 🔥 FETCH FILES
  const fetchFiles = async () => {
    try {
      const token = await getToken();

      const response = await axios.get(apiEndPoints.FETCH_FILES, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setFiles(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching files");
    }
  };

  // 🔥 TOGGLE PUBLIC
  const togglePublic = async (fileToUpdate) => {
    try {
      const token = await getToken();

      await axios.patch(
        apiEndPoints.TOGGLE_FILE(fileToUpdate.id),
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setFiles(prev =>
        prev.map(file =>
          file.id === fileToUpdate.id
            ? { ...file, isPublic: !file.isPublic }
            : file
        )
      );

    } catch (error) {
      toast.error("Toggle failed");
    }
  };

  // 🔥 DOWNLOAD
  const handleDownload = async (file) => {
    try {
      const token = await getToken();

      const response = await axios.get(
        apiEndPoints.DOWNLOAD_FILE(file.id),
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", file.name);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      toast.error("Download failed");
    }
  };

  // 🔥 DELETE
  const handleDelete = async () => {
    const fileId = deleteConfirmation.fileId;
    if (!fileId) return;

    try {
      const token = await getToken();

      await axios.delete(apiEndPoints.DELETE_FILE(fileId), {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFiles(prev => prev.filter(file => file.id !== fileId));
      toast.success("Deleted");

      setDeleteConfirmation({ isOpen: false, fileId: null });

    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // 🔥 ICON FIXED (NO FileIcon)
  const getFileIcon = (file) => {
    const ext = file?.name?.split('.')?.pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext))
      return <Image size={20} className="text-purple-500" />;

    if (['mp4', 'webm', 'mov'].includes(ext))
      return <Video size={20} className="text-blue-500" />;

    if (['mp3', 'wav', 'ogg'].includes(ext))
      return <Music size={20} className="text-green-500" />;

    if (['pdf', 'doc', 'docx', 'txt'].includes(ext))
      return <FileText size={20} className="text-blue-500" />;

    return <File size={20} className="text-gray-500" />; // ✅ FIX
  };

  return (
    <DashboardLayout activeMenu="My Files">
      <div className="p-6">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">
            My Files ({files.length})
          </h2>

          <div className="flex gap-3">
            <List onClick={() => setViewMode("list")} />
            <Grid onClick={() => setViewMode("grid")} />
          </div>
        </div>

        {/* EMPTY */}
        {files.length === 0 ? (
          <div className="text-center">
            <File size={40} />
            <p>No files</p>
            <button onClick={() => navigate('/upload')}>
              Upload
            </button>
          </div>
        ) : viewMode === "grid" ? (

          // GRID VIEW
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map(file => (
              <FileCard
                key={file.id}
                file={file}
                onDelete={(id) => setDeleteConfirmation({ isOpen: true, fileId: id })}
                onTogglePublic={togglePublic}
                onDownload={handleDownload}
              />
            ))}
          </div>

        ) : (

          // LIST VIEW
          <table className="w-full">
            <tbody>
              {files.map(file => (
                <tr key={file.id}>
                  <td>{getFileIcon(file)} {file.name}</td>
                  <td>{(file.size / 1024).toFixed(1)} KB</td>

                  <td>
                    <button onClick={() => handleDownload(file)}>
                      <Download size={16} />
                    </button>

                    <button onClick={() => setDeleteConfirmation({ isOpen: true, fileId: file.id })}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* MODALS */}
        <ConfirmationDialog
          isOpen={deleteConfirmation.isOpen}
          onClose={() => setDeleteConfirmation({ isOpen: false, fileId: null })}
          onConfirm={handleDelete}
        />

        <LinkShareModal
          isOpen={shareModal.isOpen}
          onClose={() => setShareModal({ isOpen: false })}
          link={shareModal.link}
        />

      </div>
    </DashboardLayout>
  );
}

export default MyFiles;