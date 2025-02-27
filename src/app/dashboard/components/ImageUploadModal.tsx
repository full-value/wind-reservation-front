import React, { useState, useRef, useEffect } from 'react';
import useFileUpload from '@/hooks/useFileUpload';
import { useAlbumStore } from '@/state/albumStore';

import { notify } from '@/utils/notification';

import Modal from '@/app/shared/components/UI/Modal';
import CustomButton from '@/app/shared/components/UI/CustomButton';
import TrashIcon from '@/../../public/assets/icons/trash.svg';
import UploadIcon from '@/../../public/assets/icons/upload_arrow.svg';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumId: string;
  onUploadComplete?: () => void;
}

const ImageUploadModal = ({
  isOpen,
  onClose,
  albumId,
  onUploadComplete,
}: ImageUploadModalProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<File[]>([]); // To store compressed files
  const [dragging, setDragging] = useState(false); // State to track drag-and-drop status
  const [error, setError] = useState<string | null>(null); // Error state
  const [compressing, setCompressing] = useState(false); // To track compression status
  const [isUploadComplete, setIsUploadComplete] = useState(false); // Track if all uploads are complete
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference for the file input

  const { ParallelCompression, uploadMultipleFiles, uploadProgress, error: uploadError } = useFileUpload();
  // console.log('Upload progress is as following:', uploadProgress)

  const { getValidUploadUrls, cleanupInvalidUploadUrls } = useAlbumStore();
  const validUrls = getValidUploadUrls(albumId);

  const triggerFileInput = () => fileInputRef.current?.click();

  useEffect(() => {
    if (uploadError) {
      setError(uploadError);
    }
  }, [uploadError]);

  useEffect(() => {
    cleanupInvalidUploadUrls(albumId);
  }, [albumId, cleanupInvalidUploadUrls]);

  // useEffect(() => {
  //   console.log('Upload progress is :', uploadProgress)
  // }, [uploadProgress]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = Array.from(e.target.files || []);

    const newFiles = inputFiles.filter(
      (file) => !files.some((existingFile) => existingFile.name === file.name)
    )

    setFiles((prev) => [...prev, ...newFiles]);

    setCompressing(true);
    try {
      const newCompressedFiles = await ParallelCompression(newFiles);
      setCompressedFiles((prev) => [...prev, ...newCompressedFiles]);
      setIsUploadComplete(false);
    } catch (err) {
      setError('Failed to compress one or more files.');
      notify('error', 'Error!', 'Failed to compress one or more files.');
    } finally {
      setCompressing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true); // Highlight drop area
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false); // Remove highlight
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false); // Remove highlight

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFileChange({
        target: { files: droppedFiles } as any, // Simulate file input event
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleFileRemove = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove));
    setCompressedFiles(compressedFiles.filter((_, index) => files[index] != fileToRemove));
  };

  const handleUpload = async () => {
    if (!isUploadComplete) {
      const filesToUpload = files.filter(
        (file) => !uploadProgress[file.name]?.upload || uploadProgress[file.name]?.upload < 100
      );
  
      // Make sure we get the compressed files corresponding to filesToUpload
      const updatedCompressedFiles = filesToUpload.map((file) =>
        compressedFiles.find((compressedFile) => compressedFile.name === file.name)
      ).filter((compressedFile): compressedFile is File => compressedFile !== undefined);
  
      if (filesToUpload.length > 0 && validUrls && updatedCompressedFiles.length > 0) {
        try {
          await uploadMultipleFiles(albumId, filesToUpload, validUrls, updatedCompressedFiles);
          
          setIsUploadComplete(true);
          if (onUploadComplete) onUploadComplete();
        } catch (err) {
          setError('Failed to upload files. Please try again.');
          notify('error', 'Error!', 'Failed to upload files. Please try again.');
        }
      } else {
        setError('No valid URLs available for upload.')
        notify('warning', 'Warning!', 'No valid URLs available for upload.');
      }
    } else {
      handleOnClose();
    }
    
  };

  const handleCancelUpload = () => {
    console.log('canceled')
    setError(null);
    setFiles([]);
    setCompressedFiles([]);
    setIsUploadComplete(false);
    onClose();
  }

  const handleOnClose = () => {
    setError(null);
    setFiles([]);
    setCompressedFiles([]);
    setIsUploadComplete(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-header p-5 border-b border-solid">
        <h6 className="text-2xl font-extrabold">Upload or Drop</h6>
        <p className="text-sm text-gray-500">Upload only images JPG, PNG, HEIC, etc</p>
      </div>
      <div className="modal-body p-4">
        {/* Drag-and-Drop Area */}
        <div
          aria-label="Drag and drop files here or click to browse"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center border border-dashed p-6 roun ded-full rounded-lg mb-6 ${
            dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-400'
          }`}
        >
          <UploadIcon className="w-6 h-6 text-[#00A0FF]" />
          <p className="font-bold text-base leading-[22.4px] text-[#212529] mt-2.5">Drag image here</p>
          <p className="font-normal text-xs text-[#858688] leading-[22.8px]">or, click the button to browse</p>
          <button
            onClick={triggerFileInput}
            className="mt-2.5 px-4 py-2 rounded-md bg-[#212529] font-medium text-xs leading-[12px] text-white"
          >
            Select Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            name="imageUpload"
            id="imageUpload"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden" // Hide the input visually
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <h4 className="font-extrabold">
            <span className="text-[#00a0ff]">{files.length}/10</span>{' '}
            <span className="text-gray-900">Photos</span>
          </h4>
          <p className="font-normal italic">{error || (compressing ? 'Loading...' : 'Ready to upload')}</p>
        </div>

        {/* List of Files and Progress */}
        <div className="uploaded-files max-h-80 overflow-y-auto">
          {files.map((file, index) => (
            <div
              key={file.name}
              className="file-progress gap-4 my-3 p-2 rounded-lg shadow-sm bg-gray-100"
            >
              <div className="file-info flex justify-between items-center mb-1">
                <div>
                  <span className="file-name font-extrabold text-sm mr-2">{file.name}</span>
                  <span className="file-size font-normal text-sm">
                    {compressedFiles[index]
                      ? `${(compressedFiles[index].size / 1024 / 1024).toFixed(1)} MB`
                      : `${(file.size / 1024 / 1024).toFixed(1)} MB`}
                  </span>
                </div>
                <button
                  onClick={() => handleFileRemove(file)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <TrashIcon className="w-4 h-6 text-[#858688]" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="progress-container flex-grow h-1.5 bg-gray-200 rounded-full">
                  <div
                    className="progress-bar h-1.5 rounded-full bg-[#00a0ff]"
                    style={{
                      width: `${uploadProgress[file.name]?.upload || 0}%`,
                    }}
                  ></div>
                </div>
                <div className="progress-text text-[12px] text-gray-700 w-12 text-right">
                  {uploadProgress[file.name]?.upload
                    ? `${uploadProgress[file.name]?.upload}%` 
                    : '0%'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Button */}
        <div className="mt-4 flex justify-between gap-8">
          <button
            className="bg-gray-400 px-4 py-2 rounded-md gap-1 text-white text-xs"
            onClick={handleCancelUpload}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={compressing || compressedFiles.length === 0}
            className={`${compressing || compressedFiles.length === 0 ? 'bg-[#48728AFF]' :  'bg-[#00a0ff]'} font-bold px-4 py-2 rounded-md gap-1 text-white text-xs`}
          >
            {compressing ? "Compressing..." : (isUploadComplete ? "Close" : "Start Upload")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ImageUploadModal;
