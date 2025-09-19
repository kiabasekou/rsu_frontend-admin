import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, MenuItem, FormControl,
  InputLabel, Select, FormHelperText, Box,
  CircularProgress, Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { PersonAdd } from '@mui/icons-material';
import { personSchema } from '../../schemas/validationSchemas';
import { PhotoUpload } from '../common/PhotoUpload';
import { LocationPicker } from '../common/LocationPicker';
import { VulnerabilityCalculator } from '../common/VulnerabilityCalculator';
import { InferType } from 'yup';

type PersonFormData = InferType<typeof personSchema>;

interface PersonFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PersonFormData) => Promise<void>;
  initialData?: Partial<PersonFormData>;
  mode: 'create' | 'edit';
}

export const PersonForm: React.FC<PersonFormProps> = ({
  open, onClose, onSubmit, initialData, mode
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [vulnerabilityScore, setVulnerabilityScore] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset
  } = useForm<PersonFormData>({
    resolver: yupResolver(personSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      nationalId: '',
      phoneNumber: '',
      email: '',
      gender: 'M',
      province: 'Estuaire',
      photo: null,
      coordinates: null,
      socialPrograms: [],
      vulnerabilityScore: null,
      ...initialData
    },
    mode: 'onChange'
  });

  const watchedData = watch();

  const handleFormSubmit = async (data: PersonFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = {
        ...data,
        vulnerabilityScore
      };

      await onSubmit(formData);
      reset();
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = useCallback((file: File | null) => {
    setValue('photo', file);
  }, [setValue]);

  const handleLocationSelect = useCallback((coordinates: { latitude: number; longitude: number } | null) => {
    setValue('coordinates', coordinates);
  }, [setValue]);

  const gabonProvinces = [
    'Estuaire', 'Haut-Ogooué', 'Moyen-Ogooué', 'Ngounié',
    'Nyanga', 'Ogooué-Ivindo', 'Ogooué-Lolo', 'Ogooué-Maritime', 'Woleu-Ntem'
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { minHeight: '80vh' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonAdd />
        {mode === 'create' ? 'Nouvelle Identité' : 'Modifier Identité'}
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={3}>
            
            {/* Section Photo & Info Principale */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <PhotoUpload
                  onUpload={handlePhotoUpload}
                  preview={watchedData.photo as string | File | undefined}
                />
              </Box>

              {vulnerabilityScore && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Score vulnérabilité: <strong>{vulnerabilityScore}/100</strong>
                </Alert>
              )}
            </Grid>

            {/* Informations Personnelles */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Prénom *"
                        fullWidth
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Nom de famille *"
                        fullWidth
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="nationalId"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="CNI Gabonaise *"
                        fullWidth
                        placeholder="123456789012"
                        error={!!errors.nationalId}
                        helperText={errors.nationalId?.message || "12 chiffres"}
                        inputProps={{ maxLength: 12 }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Téléphone *"
                        fullWidth
                        placeholder="+241 01 23 45 67"
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email"
                        fullWidth
                        type="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Date de naissance *"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.dateOfBirth,
                            helperText: errors.dateOfBirth?.message,
                          }
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.gender}>
                    <InputLabel id="gender-label">Genre *</InputLabel>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="gender-label"
                          label="Genre *"
                          fullWidth
                        >
                          <MenuItem value="M">Masculin</MenuItem>
                          <MenuItem value="F">Féminin</MenuItem>
                          <MenuItem value="Autre">Autre</MenuItem>
                        </Select>
                      )}
                    />
                    <FormHelperText>{errors.gender?.message}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.province}>
                    <InputLabel id="province-label">Province *</InputLabel>
                    <Controller
                      name="province"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="province-label"
                          label="Province *"
                          fullWidth
                        >
                          {gabonProvinces.map(p => (
                            <MenuItem key={p} value={p}>{p}</MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    <FormHelperText>{errors.province?.message}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Ville *"
                        fullWidth
                        error={!!errors.city}
                        helperText={errors.city?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Adresse complète *"
                        fullWidth
                        multiline
                        rows={2}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            {/* Section Location & Vulnerability */}
            <Grid item xs={12} md={6}>
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={initialData?.coordinates}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <VulnerabilityCalculator
                age={watchedData.dateOfBirth ? (new Date().getFullYear() - watchedData.dateOfBirth.getFullYear()) : null}
                hasPhoto={!!watchedData.photo}
                onScoreCalculate={setVulnerabilityScore}
              />
              <Controller
                name="socialPrograms"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Programmes Sociaux"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    value={field.value?.join(', ') || ''}
                    sx={{ mt: 2 }}
                    error={!!errors.socialPrograms}
                    helperText={errors.socialPrograms?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">Annuler</Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? <CircularProgress size={24} /> : (mode === 'create' ? 'Créer' : 'Sauvegarder')}
        </Button>
      </DialogActions>
      {submitError && (
        <Box sx={{ p: 2, pt: 0 }}>
          <Alert severity="error">{submitError}</Alert>
        </Box>
      )}
    </Dialog>
  );
};