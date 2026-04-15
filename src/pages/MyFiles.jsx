import React, { useState } from 'react'
import apiEndPoints from "../Util/apiEndpoints.js";
import DashboardLayout from '../layout/DashboardLayout';
import { Grid, List, File, Globe, Lock, Copy, Download, FileIcon, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FileCard from '../component/FileCard';
import { Image, Video, Music, FileText } from 'lucide-react';
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

  /**fetching the files for a logged in user */
  const fetchFiles = async () => {
    try {
      const token = await getToken();

      const response = await axios.get(
        apiEndPoints.FETCH_FILES,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setFiles(response.data);
      }
    } catch (error) {
      console.error('Error fetching the file from server', error);
      toast.error(`Error fetching the files: ${error.message}`);
    }
  };


  /** toggles the public/privete statusf a file   */
  const togglePublic = async (fileToUpdate) => {
    try {
      const token = await getToken();

      await axios.patch(
        apiEndPoints.TOGGLE_FILE(fileToUpdate.id),  // ✔ correct
        {}, // body (empty)
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      setFiles((prev) => prev.map((file) => file.id === fileToUpdate.id
        ? { ...file, isPublic: !file.isPublic }
        : file
      )
      );


    } catch (error) {
      console.error('Error toggling file status', error);
      toast.error('Error toggling file status', error.message);


    }

  };

  //Handle file download 
  const handleDownload = async (file) => {
    try {
      const token = await getToken();

      const response = await axios.get(
        apiEndPoints.DOWNLOAD_FILE(file.id),
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );

      // create a blob url and trigger donwload 
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", file.name);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Downoad failed', error);
      toast.error('Error downloading file', error.message);


    }

  }
  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      fileId: null
    })
  }

  // Opens delete confirmation model
  const openDeleteConfirmation = (fileId) => {
    setDeleteConfirmation({
      isOpen: true,
      fileId
    })
  }


  // open shaing link modal
  const openShareModal = (fileId) => {
    const link = apiEndPoints.PUBLIC_VIEW_LINK(fileId);


    setShareModal({
      isOpen: true,
      fileId,
      link

    });
  };


  // close share link link moal

  const closeShareModal = () => {
    setShareModal({
      isOpen: false,
      fileId: null,
      link: ""
    })

  }

  // deleting a file after confirmation 
  const handleDelete = async () => {
    const fileId = deleteConfirmation.fileId;
    if (!fileId) return;

    try {
      const token = await getToken();
      console.log("DELETE URL:", apiEndPoints.DELETE_FILE(fileId));

      const response = await axios.delete(
        apiEndPoints.DELETE_FILE(fileId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        setFiles((prev) => prev.filter((file) => file.id !== fileId));
        toast.success("File deleted");
        closeDeleteConfirmation();
      }

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error deleting file");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);
  const getFileIcon = (file) => {
    const extension = file?.name?.split('.')?.pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
      return <Image size={20} className="text-purple-500" />;
    }

    if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension)) {
      return <Video size={20} className="text-blue-500" />;
    }

    if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(extension)) {
      return <Music size={20} className="text-green-500" />;
    }

    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) {
      return <FileText size={20} className="text-blue-500" />;
    }

    return <FileIcon size={20} className="text-gray-500" />;
  };

  return (
    <DashboardLayout activeMenu="My Files">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            My Files {files.length}
          </h2>

          <div className="flex items-center gap-3">
            <List
              onClick={() => setViewMode("list")}
              size={24}
              className={`cursor-pointer transition-colors ${viewMode === "list"
                ? "text-blue-600"
                : "text-gray-400 hover:text-gray-600"}`} />

            <Grid
              onClick={() => setViewMode("grid")}
              size={24}
              className={`cursor-pointer transition-colors ${viewMode === "grid"
                ? "text-blue-600"
                : "text-gray-400 hover:text-gray-600"}`} />
          </div>
        </div>

        {files.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center text-center">
            <File

              size={30}
              className="text-purple-300 mb-4" />

            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No files uploaded yet


            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Start uploading file to see them listed here. you can upload
              document, images,and other files to share and manage the securely.

            </p>
            <button
              onClick={() => navigate('/upload')}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            >
              Go to Upload
            </button>


          </div>


        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {files.map((file) => (
              <FileCard
                key={file.id}

                file={file}

                onDelete={openDeleteConfirmation}
                onTogglePublic={togglePublic}
                onDownload={handleDownload}
                onShareLink={openShareModal}

              />


            ))}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                  <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sharing</th>
                  <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 transition-colors">

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file)}
                        {file.name}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {(file.size / 1024).toFixed(1)} KB
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-4">

                        <button
                          onClick={() => togglePublic(file)}
                          className="flex items-center gap-1 cursor-pointer group">
                          {file.isPublic ? (
                            <>
                              <Globe size={16} className="text-green-500" />
                              <span className="group-hover:underline">Public</span>
                            </>
                          ) : (
                            <>
                              <Lock size={16} className="text-gray-500" />
                              <span className="group-hover:underline">Private</span>
                            </>
                          )}
                        </button>

                        {file.isPublic && (
                          <button
                            onClick={() => openShareModal(file.id)}
                            className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800">
                            <Copy size={16} />
                            <span className="group-hover:underline">
                              Share Link
                            </span>
                          </button>
                        )}

                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleDownload(file)}
                            title="Download"
                            className="text-gray-500 hover:text-blue-600">
                            <Download size={18} />
                          </button>
                        </div>

                        <div className="flex justify-center">

                          <button
                            title="Delete"
                            onClick={() => openDeleteConfirmation(file.id)}

                            className="text-gray-500 hover:text-red-600">
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="flex justify-center">
                          {file.isPublic ? (

                            <a href={apiEndPoints.PUBLIC_VIEW_LINK(file.id)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gray-500 hover:text-blue-600"
                            >
                              <Eye size={16} />
                            </a>

                          ) : (
                            <span className="w-4.5"></span>
                          )}

                        </div>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>


          </div>
        )}
        <ConfirmationDialog
          isOpen={deleteConfirmation.isOpen}
          onClose={closeDeleteConfirmation}
          onConfirm={handleDelete}
          title="Delete File"
          message="Are you sure to delete this file? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmationButtonClass="bg-red-600 hover:bg-red-700"
        />
        <LinkShareModal
          isOpen={shareModal.isOpen}
          onClose={closeShareModal}
          link={shareModal.link}
          fileId={shareModal.fileId}
        />
      </div>

    </DashboardLayout>
  );
}

export default MyFiles;
