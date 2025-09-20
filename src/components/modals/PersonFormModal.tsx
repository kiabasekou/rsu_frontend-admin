import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { PersonForm } from '../forms/PersonForm';
import { PersonFormData, PersonIdentity } from '../../types/forms';

interface PersonFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PersonFormData) => Promise<void>;
  initialData?: PersonIdentity;
  mode: 'create' | 'edit';
}

export const PersonFormModal: React.FC<PersonFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (data: PersonFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      // Ici, vous pouvez ajouter une notification d'erreur
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          height: fullScreen ? '100vh' : 'auto',
          maxHeight: fullScreen ? '100vh' : '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        {mode === 'create' ? 'Nouvelle Identité' : 'Modifier Identité'}
        <IconButton
          aria-label="fermer"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <PersonForm
            onSubmit={handleSubmit}
            initialData={initialData}
            mode={mode}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Annuler
        </Button>
        <Button
          form="person-form"
          type="submit"
          variant="contained"
          color="primary"
        >
          {mode === 'create' ? 'Créer' : 'Enregistrer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};