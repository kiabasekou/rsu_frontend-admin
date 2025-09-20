import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Avatar,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  PhotoCamera,
} from '@mui/icons-material';

interface PhotoUploadProps {
  onUpload: (file: File | null) => void;
  preview?: string | File | null;
  maxSize?: number; // en MB
  allowedTypes?: string[];
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onUpload,
  preview,
  maxSize = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPreviewUrl = (): string | null => {
    if (!preview) return null;
    if (typeof preview === 'string') return preview;
    if (preview instanceof File) return URL.createObjectURL(preview);
    return null;
  };

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `Type de fichier non supporté. Types autorisés: ${allowedTypes.join(', ')}`;
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `Fichier trop volumineux. Taille maximale: ${maxSize}MB`;
    }
    
    return null;
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Compression/redimensionnement de l'image
      const compressedFile = await compressImage(file);
      onUpload(compressedFile);
    } catch (err) {
      setError('Erreur lors du traitement de l\'image');
    } finally {
      setUploading(false);
    }
  }, [onUpload, maxSize, allowedTypes]);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Redimensionner à 400x400 max en gardant le ratio
        const maxSize = 400;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob!], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          0.8
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const previewUrl = getPreviewUrl();

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Paper
        sx={{
          p: 2,
          border: dragOver ? '2px dashed primary.main' : '2px dashed grey.300',
          borderRadius: 2,
          bgcolor: dragOver ? 'primary.50' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'primary.50',
          },
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <Box sx={{ py: 4 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Traitement de l'image...
            </Typography>
          </Box>
        ) : previewUrl ? (
          <Box>
            <Avatar
              src={previewUrl}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCamera />}
                size="small"
              >
                Changer
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleFileInputChange}
                />
              </Button>
              <IconButton
                color="error"
                onClick={() => onUpload(null)}
                size="small"
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box sx={{ py: 4 }}>
            <CloudUpload sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Photo d'identité
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Glissez-déposez ou cliquez pour sélectionner
            </Typography>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUpload />}
            >
              Sélectionner une photo
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleFileInputChange}
              />
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Formats acceptés: JPEG, PNG, WebP (max {maxSize}MB)
            </Typography>
          </Box>
        )}
      </Paper>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};