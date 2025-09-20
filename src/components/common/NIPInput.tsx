import React, { useState, useCallback } from 'react';
import { TextField, InputAdornment, IconButton, Chip } from '@mui/material';
import { CheckCircle, Error, Info } from '@mui/icons-material';
import { NIPValidationService, ValidationResult } from '../../services/nipValidation';

interface NIPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const NIPInput: React.FC<NIPInputProps> = ({ value, onChange, error }) => {
  const [validationStatus, setValidationStatus] = useState<ValidationResult>();
  const [isValidating, setIsValidating] = useState(false);

  const handleNIPChange = useCallback(async (nip: string) => {
    const formattedNIP = nip.toUpperCase().replace(/[^A-Z0-9]/g, '');
    onChange(formattedNIP);
    
    if (formattedNIP.length === 14) {
      setIsValidating(true);
      try {
        const validation = await NIPValidationService.validateNIPFormat(formattedNIP);
        setValidationStatus(validation);
      } catch (err) {
        setValidationStatus({
          isValid: false,
          error: 'Erreur de validation',
          details: {
            format: false,
            checksum: false,
            birthDate: false,
          }
        });
      } finally {
        setIsValidating(false);
      }
    } else {
      setValidationStatus(undefined);
    }
  }, [onChange]);

  const getValidationIcon = () => {
    if (isValidating) return <Info color="info" />;
    if (!validationStatus) return null;
    return validationStatus.isValid ? 
      <CheckCircle color="success" /> : 
      <Error color="error" />;
  };

  const getHelperText = () => {
    if (error) return error;
    if (validationStatus?.error) return validationStatus.error;
    if (validationStatus?.isValid) return '✓ NIP valide';
    return 'Format: 14 caractères alphanumériques (ex: AB1234567890123)';
  };

  return (
    <>
      <TextField
        label="Numéro d'Identification Personnel (NIP) *"
        value={value}
        onChange={(e) => handleNIPChange(e.target.value)}
        error={!!error || !validationStatus?.isValid}
        helperText={getHelperText()}
        inputProps={{ maxLength: 14 }}
        placeholder="AB1234567890123"
        fullWidth
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {getValidationIcon()}
            </InputAdornment>
          ),
        }}
      />
      
      {validationStatus?.isValid && (
        <Chip
          label="NIP Vérifié"
          color="success"
          size="small"
          icon={<CheckCircle />}
          sx={{ mt: 1 }}
        />
      )}
    </>
  );
};