import React, { useState, useCallback } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { Controller, useForm, useWatch, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PersonFormData } from '../../types/forms';
import { personValidationSchema } from '../../utils/validation';
import { PhotoUpload } from '../common/PhotoUpload';
import { LocationPicker } from '../common/LocationPicker';
import { VulnerabilityCalculator } from '../common/VulnerabilityCalculator';
import { NIPInput } from '../common/NIPInput';

interface PersonFormProps {
  onSubmit: (data: PersonFormData) => Promise<void>;
  initialData?: Partial<PersonFormData>;
  mode: 'create' | 'edit';
}

export const PersonForm: React.FC<PersonFormProps> = ({
  onSubmit,
  initialData,
  mode
}) => {
  const [vulnerabilityScore, setVulnerabilityScore] = useState<number | null>(
    initialData?.vulnerabilityScore || null
  );
  
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<PersonFormData>({
    //resolver: yupResolver(personValidationSchema),//// Commentez cette ligne
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      nationalId: initialData?.nationalId || '',
      nip: initialData?.nip || '',
      phoneNumber: initialData?.phoneNumber || '',
      email: initialData?.email || '',
      dateOfBirth: initialData?.dateOfBirth || new Date(),
      gender: initialData?.gender || 'M',
      province: initialData?.province || '',
      city: initialData?.city || '',
      address: initialData?.address || '',
      photo: initialData?.photo || null,
      vulnerabilityScore: initialData?.vulnerabilityScore || null,
      coordinates: initialData?.coordinates || null,
    },
  });

  const watchedData = useWatch({ control });

  const handlePhotoUpload = useCallback((file: File | null) => {
    setValue('photo', file);
  }, [setValue]);

  const handleLocationSelect = useCallback((location: { latitude: number; longitude: number }) => {
    setValue('coordinates', location);
  }, [setValue]);

  const onFormSubmit = async (data: PersonFormData) => {
    try {
      const formData: PersonFormData = {
        ...data,
        vulnerabilityScore,
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Erreur soumission formulaire:', error);
      throw error;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate>
      <Typography variant="h6" gutterBottom>
        {mode === 'create' ? 'Nouvelle Identité' : 'Modifier Identité'}
      </Typography>

      <Grid container spacing={3}>
        {/* Section Photo & Info Principale */}
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <PhotoUpload
              onUpload={handlePhotoUpload}
              preview={watchedData.photo || null}
            />
          </Box>
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
                    fullWidth
                    label="Prénom *"
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
                    fullWidth
                    label="Nom *"
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
                    fullWidth
                    label="CNI *"
                    placeholder="123456789012"
                    error={!!errors.nationalId}
                    helperText={errors.nationalId?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="nip"
                control={control}
                render={({ field }) => (
                  <NIPInput
                    value={field.value || ''}
                    onChange={field.onChange}
                    error={errors.nip?.message}
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
                    fullWidth
                    label="Téléphone *"
                    placeholder="+241 07 12 34 56"
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
                    value={field.value || ''}
                    fullWidth
                    label="Email"
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
                  <TextField
                    {...field}
                    fullWidth
                    label="Date de naissance *"
                    type="date"
                    value={field.value instanceof Date ? 
                      field.value.toISOString().split('T')[0] : field.value}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                    InputLabelProps={{ shrink: true }}
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
                    >
                      <MenuItem value="M">Masculin</MenuItem>
                      <MenuItem value="F">Féminin</MenuItem>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <FormHelperText>{errors.gender.message}</FormHelperText>
                )}
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
                    >
                      <MenuItem value="Estuaire">Estuaire</MenuItem>
                      <MenuItem value="Haut-Ogooué">Haut-Ogooué</MenuItem>
                      <MenuItem value="Moyen-Ogooué">Moyen-Ogooué</MenuItem>
                      <MenuItem value="Ngounié">Ngounié</MenuItem>
                      <MenuItem value="Nyanga">Nyanga</MenuItem>
                      <MenuItem value="Ogooué-Ivindo">Ogooué-Ivindo</MenuItem>
                      <MenuItem value="Ogooué-Lolo">Ogooué-Lolo</MenuItem>
                      <MenuItem value="Ogooué-Maritime">Ogooué-Maritime</MenuItem>
                      <MenuItem value="Woleu-Ntem">Woleu-Ntem</MenuItem>
                    </Select>
                  )}
                />
                {errors.province && (
                  <FormHelperText>{errors.province.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Ville *"
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
                    fullWidth
                    label="Adresse"
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
            initialLocation={initialData?.coordinates || undefined}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <VulnerabilityCalculator
            age={watchedData.dateOfBirth ? 
              (new Date().getFullYear() - new Date(watchedData.dateOfBirth).getFullYear()) : 
              null
            }
            hasPhoto={!!watchedData.photo}
            onScoreCalculate={setVulnerabilityScore}
          />
        </Grid>

        {/* Boutons d'action */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="outlined" type="button">
              Annuler
            </Button>
            <Button 
              variant="contained" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : 
               mode === 'create' ? 'Créer' : 'Modifier'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};