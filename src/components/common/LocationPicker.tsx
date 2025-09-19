// src/components/common/LocationPicker.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, TextField, Alert, CircularProgress,
  Typography, Chip
} from '@mui/material';
import { MyLocation, Place, Search } from '@mui/icons-material';

interface LocationPickerProps {
  open: boolean;
  onClose: () => void;
  onLocationSelect: (location: { latitude: number; longitude: number; address?: string }) => void;
  initialLocation?: { latitude: number; longitude: number };
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  open,
  onClose,
  onLocationSelect,
  initialLocation
}) => {
  const [currentLocation, setCurrentLocation] = useState(initialLocation);
  const [searchAddress, setSearchAddress] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  const getCurrentPosition = async () => {
    setIsGettingLocation(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      setCurrentLocation(location);
      
      // Reverse geocoding pour obtenir l'adresse
      try {
        const address = await reverseGeocode(location.latitude, location.longitude);
        setSelectedAddress(address);
      } catch {
        setSelectedAddress(`${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`);
      }

    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Permission de géolocalisation refusée');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Position non disponible');
            break;
          case error.TIMEOUT:
            setError('Timeout de géolocalisation');
            break;
          default:
            setError('Erreur de géolocalisation');
        }
      } else {
        setError('Erreur inconnue de géolocalisation');
      }
    } finally {
      setIsGettingLocation(false);
    }
  };

  const searchLocation = async () => {
    if (!searchAddress.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      // Utiliser un service de géocodage (ici Nominatim OSM en exemple)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress + ', Gabon')}&limit=1`
      );
      
      const results = await response.json();
      
      if (results.length > 0) {
        const result = results[0];
        const location = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon)
        };
        
        setCurrentLocation(location);
        setSelectedAddress(result.display_name);
      } else {
        setError('Adresse non trouvée');
      }
    } catch (error) {
      setError('Erreur lors de la recherche d\'adresse');
    } finally {
      setIsSearching(false);
    }
  };

  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const result = await response.json();
    return result.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  };

  const handleConfirm = () => {
    if (currentLocation) {
      onLocationSelect({
        ...currentLocation,
        address: selectedAddress
      });
      onClose();
    }
  };

  const isInGabon = (lat: number, lon: number): boolean => {
    // Boundaries approximatives du Gabon
    return lat >= -4.0 && lat <= 2.3 && lon >= 8.5 && lon <= 14.8;
  };

  useEffect(() => {
    if (initialLocation) {
      setCurrentLocation(initialLocation);
      reverseGeocode(initialLocation.latitude, initialLocation.longitude)
        .then(setSelectedAddress)
        .catch(() => setSelectedAddress('Position actuelle'));
    }
  }, [initialLocation]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Sélectionner la localisation</DialogTitle>
      
      <DialogContent>
        {/* Recherche par adresse */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Rechercher une adresse"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
            InputProps={{
              endAdornment: (
                <Button
                  onClick={searchLocation}
                  disabled={isSearching || !searchAddress.trim()}
                  startIcon={isSearching ? <CircularProgress size={20} /> : <Search />}
                >
                  Rechercher
                </Button>
              )
            }}
            placeholder="Ex: Libreville, Boulevard Triomphal"
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Géolocalisation automatique */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={getCurrentPosition}
            disabled={isGettingLocation}
            startIcon={isGettingLocation ? <CircularProgress size={20} /> : <MyLocation />}
            fullWidth
          >
            {isGettingLocation ? 'Localisation en cours...' : 'Utiliser ma position actuelle'}
          </Button>
        </Box>

        {/* Erreurs */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Position sélectionnée */}
        {currentLocation && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Position sélectionnée :
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Place color="primary" />
              <Typography variant="body2">
                {selectedAddress}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={`Lat: ${currentLocation.latitude.toFixed(6)}`}
                size="small"
                variant="outlined"
              />
              <Chip
                label={`Lon: ${currentLocation.longitude.toFixed(6)}`}
                size="small"
                variant="outlined"
              />
              {!isInGabon(currentLocation.latitude, currentLocation.longitude) && (
                <Chip
                  label="⚠️ Hors Gabon"
                  size="small"
                  color="warning"
                />
              )}
            </Box>

            {/* Mini carte ou preview */}
            <Box sx={{ 
              mt: 2, 
              height: 200, 
              bgcolor: 'grey.100', 
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Typography variant="body2" color="text.secondary">
                📍 Carte interactive
              </Typography>
              <Typography variant="caption" sx={{ position: 'absolute', bottom: 8, left: 8 }}>
                {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!currentLocation}
          startIcon={<Place />}
        >
          Confirmer la position
        </Button>
      </DialogActions>
    </Dialog>
  );
};
