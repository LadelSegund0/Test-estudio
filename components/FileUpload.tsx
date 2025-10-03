import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileChange: (files: FileList | null) => void;
  error: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Fix: Explicitly type 'f' as 'File' to resolve TypeScript error.
      setFileNames(Array.from(files).map((f: File) => f.name));
      onFileChange(files);
    }
  }, [onFileChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Fix: Explicitly type 'f' as 'File' to resolve TypeScript error.
      setFileNames(Array.from(files).map((f: File) => f.name));
      onFileChange(files);
    }
  };

  return (
    <div className="w-full text-center">
      <div 
        className={`w-full p-8 border-4 border-dashed rounded-lg transition-colors duration-300 ${isDragging ? 'border-cyan-400 bg-slate-700' : 'border-slate-600 hover:border-cyan-500'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".pdf"
          className="hidden"
          onChange={handleFileSelect}
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          <UploadIcon className="w-16 h-16 text-slate-400 mb-4" />
          <p className="text-lg font-semibold text-slate-300">Arrastra y suelta tus PDF(s) aquí</p>
          <p className="text-slate-400">o</p>
          <span className="mt-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-105">
            Buscar Archivos
          </span>
        </label>
      </div>
      {fileNames.length > 0 && (
        <div className="mt-4 text-left">
            <h3 className="font-semibold text-slate-300">Archivos seleccionados:</h3>
            <ul className="list-disc list-inside text-slate-400">
                {fileNames.map((name, i) => <li key={i}>{name}</li>)}
            </ul>
        </div>
      )}
      {error && <p className="mt-4 text-red-400">{error}</p>}
    </div>
  );
};

export default FileUpload;