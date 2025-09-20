import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  LocationOn,
  MyLocation,
  Map,
} from '@mui/icons-material';

interface LocationPickerProps {
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
  initialLocation?: { latitude: number; longitude: number };
  showMap?: boolean;
  enableGPS?: boolean;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation,
  showMap = true,
  enableGPS = true,
}) => {
  const [coordinates, setCoordinates] = useState(initialLocation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualEntry, setManualEntry] = useState(false);

  const [latitude, setLatitude] = useState(initialLocation?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(initialLocation?.longitude?.toString() || '');

  useEffect(() => {
    if (initialLocation) {
      setCoordinates(initialLocation);
      setLatitude(initialLocation.latitude.toString());
      setLongitude(initialLocation.longitude.toString());
    }
  }, [initialLocation]);

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par ce navigateur');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCoordinates(newCoords);
        setLatitude(newCoords.latitude.toString());
        setLongitude(newCoords.longitude.toString());
        onLocationSelect(newCoords);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        setError('Erreur de géolocalisation');
      }
    );
  };

  const handleManualSubmit = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      setError('Coordonnées invalides');
      return;
    }

    const newCoords = { latitude: lat, longitude: lng };
    setCoordinates(newCoords);
    onLocationSelect(newCoords);
    setError(null);
    setManualEntry(false);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        <LocationOn color="primary" /> Localisation
      </Typography>

      {coordinates && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Position: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {manualEntry ? (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            type="number"
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            type="number"
            size="small"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleManualSubmit} size="small">
              Confirmer
            </Button>
            <Button variant="outlined" onClick={() => setManualEntry(false)} size="small">
              Annuler
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {enableGPS && (
            <Button
              variant="contained"
              onClick={getCurrentLocation}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <MyLocation />}
              size="small"
            >
              {loading ? 'Localisation...' : 'Position GPS'}
            </Button>
          )}
          
          <Button
            variant="outlined"
            onClick={() => setManualEntry(true)}
            size="small"
          >
            Saisie manuelle
          </Button>
        </Box>
      )}
    </Paper>
  );
};