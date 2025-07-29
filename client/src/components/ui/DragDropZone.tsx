import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Upload, File, X, CheckCircle, AlertCircle, Image, FileText, Music, Video } from 'lucide-react';

interface FileWithPreview extends File {
  id: string;
  preview?: string;
  progress?: number;
  error?: string;
  uploaded?: boolean;
}

interface DragDropZoneProps {
  onFilesChange?: (files: FileWithPreview[]) => void;
  onFileUpload?: (file: FileWithPreview) => Promise<void>;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in bytes
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  showPreview?: boolean;
  autoUpload?: boolean;
}

export const DragDropZone: React.FC<DragDropZoneProps> = ({
  onFilesChange,
  onFileUpload,
  accept = '*/*',
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = true,
  disabled = false,
  className,
  showPreview = true,
  autoUpload = false
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (type.startsWith('audio/')) return <Music className="w-4 h-4" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `Le fichier est trop volumineux. Taille max: ${formatFileSize(maxSize)}`;
    }
    
    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.match(type.replace('*', '.*'));
      });
      
      if (!isAccepted) {
        return `Type de fichier non accepté. Types acceptés: ${accept}`;
      }
    }
    
    return null;
  };

  const processFiles = useCallback(async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    
    if (!multiple && filesArray.length > 1) {
      return;
    }
    
    if (files.length + filesArray.length > maxFiles) {
      return;
    }

    const processedFiles: FileWithPreview[] = await Promise.all(
      filesArray.map(async (file) => {
        const error = validateFile(file);
        const id = Math.random().toString(36).substr(2, 9);
        
        let preview: string | undefined;
        if (file.type.startsWith('image/') && showPreview) {
          preview = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
        }

        return {
          ...file,
          id,
          preview,
          error,
          progress: 0,
          uploaded: false
        } as FileWithPreview;
      })
    );

    const newFiles = [...files, ...processedFiles];
    setFiles(newFiles);
    onFilesChange?.(newFiles);

    // Auto upload if enabled
    if (autoUpload && onFileUpload) {
      for (const file of processedFiles.filter(f => !f.error)) {
        await uploadFile(file);
      }
    }
  }, [files, maxFiles, multiple, showPreview, autoUpload, onFileUpload, onFilesChange]);

  const uploadFile = async (file: FileWithPreview) => {
    if (!onFileUpload) return;

    setIsUploading(true);
    
    try {
      // Simulate upload progress
      const updateProgress = (progress: number) => {
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ));
      };

      // Simulate progressive upload
      for (let i = 0; i <= 100; i += 10) {
        updateProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await onFileUpload(file);
      
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, uploaded: true, progress: 100 } : f
      ));
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, error: 'Erreur lors du téléchargement' } : f
      ));
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    const newFiles = files.filter(f => f.id !== fileId);
    setFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const droppedFiles = e.dataTransfer.files;
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      processFiles(selectedFiles);
    }
    
    // Reset input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <motion.div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
          "hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20",
          isDragOver && "border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[1.02]",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "cursor-pointer",
          "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        
        <motion.div
          animate={{
            scale: isDragOver ? 1.1 : 1,
            opacity: isDragOver ? 0.8 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          <Upload className={cn(
            "mx-auto h-12 w-12 mb-4 transition-colors",
            isDragOver ? "text-blue-500" : "text-gray-400"
          )} />
          
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {isDragOver ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            ou cliquez pour sélectionner
          </p>
          
          <div className="text-xs text-gray-400 space-y-1">
            <p>Formats acceptés: {accept === '*/*' ? 'Tous' : accept}</p>
            <p>Taille max: {formatFileSize(maxSize)} • Max {maxFiles} fichier{maxFiles > 1 ? 's' : ''}</p>
          </div>
        </motion.div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 rounded-xl flex items-center justify-center"
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">Téléchargement...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* File List */}
      <AnimatePresence mode="popLayout">
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg border",
                  "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                  file.error && "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                )}
              >
                {/* File Preview or Icon */}
                <div className="flex-shrink-0">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {getFileIcon(file)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                  
                  {/* Progress Bar */}
                  {file.progress !== undefined && file.progress > 0 && !file.uploaded && !file.error && (
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                        <motion.div
                          className="bg-blue-500 h-1 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Error Message */}
                  {file.error && (
                    <p className="text-xs text-red-500 mt-1">{file.error}</p>
                  )}
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {file.uploaded ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : file.error ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Upload Button */}
      {!autoUpload && files.some(f => !f.uploaded && !f.error) && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            files.filter(f => !f.uploaded && !f.error).forEach(uploadFile);
          }}
          disabled={isUploading}
          className={cn(
            "w-full py-2 px-4 rounded-lg font-medium transition-all duration-200",
            "bg-blue-500 hover:bg-blue-600 text-white",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          )}
        >
          {isUploading ? 'Téléchargement...' : 'Télécharger les fichiers'}
        </motion.button>
      )}
    </div>
  );
};