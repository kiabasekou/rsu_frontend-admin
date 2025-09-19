// src/components/common/PhotoUpload.tsx

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box, Avatar, Button, IconButton, Dialog, DialogContent,
  Typography, CircularProgress, Alert, Slider
} from '@mui/material';
import { PhotoCamera, Delete, Crop } from '@mui/icons-material';
import Cropper from 'react-easy-crop';

interface PhotoUploadProps {
  onUpload: (file: File | null) => void;
  preview?: File | string;
  maxSize?: number;
  quality?: number;
  cropAspect?: number;
}

interface CroppedAreaPixels {
  width: number;
  height: number;
  x: number;
  y: number;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onUpload,
  preview,
  maxSize = 5,
  quality = 0.8,
  cropAspect = 1
}) => {
  const [cropDialog, setCropDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > maxSize * 1024 * 1024) {
      setError(`La taille du fichier ne doit pas dépasser ${maxSize}MB`);
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setCurrentImage(reader.result as string);
      setCropDialog(true);
    };
    reader.readAsDataURL(file);
  }, [maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    maxSize: maxSize * 1024 * 1024
  });

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: CroppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async (): Promise<File> => {
    if (!currentImage || !croppedAreaPixels) {
      throw new Error('Données manquantes');
    }

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx?.drawImage(
          img,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], 'photo.jpg', {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(file);
            } else {
              reject(new Error('Erreur création image'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Erreur chargement image'));
      img.src = currentImage;
    });
  };

  const handleSaveCrop = async () => {
    setUploading(true);
    try {
      const croppedFile = await createCroppedImage();
      onUpload(croppedFile);
      setCropDialog(false);
      setCurrentImage(null);
    } catch (error) {
      setError('Erreur lors du traitement de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    onUpload(null);
  };

  const previewUrl = preview 
    ? typeof preview === 'string' ? preview : URL.createObjectURL(preview)
    : null;

  return (
    <>
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        {previewUrl ? (
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={previewUrl}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                bgcolor: 'error.main',
                color: 'white',
                '&:hover': { bgcolor: 'error.dark' }
              }}
            >
              <Delete />
            </IconButton>
          </Box>
        ) : (
          <Box
            {...getRootProps()}
            sx={{
              width: 120,
              height: 120,
              border: 2,
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              borderStyle: 'dashed',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              bgcolor: isDragActive ? 'primary.50' : 'grey.50',
              transition: 'all 0.2s ease'
            }}
          >
            <input {...getInputProps()} />
            <PhotoCamera sx={{ fontSize: 40, color: 'grey.500', mb: 1 }} />
            <Typography variant="caption" align="center" color="text.secondary">
              {isDragActive ? 'Déposer ici' : 'Photo d\'identité'}
            </Typography>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 1, maxWidth: 300 }}>
          {error}
        </Alert>
      )}

      <Dialog
        open={cropDialog}
        onClose={() => setCropDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative', height: 400 }}>
          {currentImage && (
            <Cropper
              image={currentImage}
              crop={crop}
              zoom={zoom}
              aspect={cropAspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
          
          <Box sx={{ 
            position: 'absolute', 
            bottom: 16, 
            left: 16, 
            right: 16,
            bgcolor: 'background.paper',
            borderRadius: 1,
            p: 2
          }}>
            <Typography variant="body2" gutterBottom>
              Zoom
            </Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(_, value) => setZoom(value as number)}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button onClick={() => setCropDialog(false)}>
                Annuler
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveCrop}
                disabled={uploading}
                startIcon={uploading ? <CircularProgress size={20} /> : <Crop />}
              >
                {uploading ? 'Traitement...' : 'Valider'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
