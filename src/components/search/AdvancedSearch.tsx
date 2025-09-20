import React, { useState } from 'react';
import {
  Box,
  Grid, // Grid classique
  TextField,
  Button,
  IconButton,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
} from '@mui/material';
import { Search, FilterAlt, Save, Clear, ExpandMore, ExpandLess } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { SearchFilters } from '../../types/forms';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onSaveSearch: (name: string, filters: SearchFilters) => void;
  savedSearches: Array<{ name: string; filters: SearchFilters }>;
  isLoading?: boolean;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  onSaveSearch,
  savedSearches,
  isLoading = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({});
    onSearch({});
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Barre de recherche principale */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Rechercher par nom, CNI, téléphone..."
            value={filters.query || ''}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={isLoading}
            startIcon={<Search />}
            fullWidth
          >
            Rechercher
          </Button>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => setExpanded(!expanded)}
              color="primary"
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <IconButton onClick={handleClear} color="secondary">
              <Clear />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Filtres avancés */}
      <Collapse in={expanded}>
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Grid container spacing={2}>
            {/* Filtres par champs */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="CNI"
                value={filters.nationalId || ''}
                onChange={(e) => handleFilterChange('nationalId', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Téléphone"
                value={filters.phoneNumber || ''}
                onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Genre</InputLabel>
                <Select
                  value={filters.gender || ''}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  label="Genre"
                >
                  <MenuItem value="">Tous</MenuItem>
                  <MenuItem value="M">Masculin</MenuItem>
                  <MenuItem value="F">Féminin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Province</InputLabel>
                <Select
                  value={filters.province || ''}
                  onChange={(e) => handleFilterChange('province', e.target.value)}
                  label="Province"
                >
                  <MenuItem value="">Toutes</MenuItem>
                  <MenuItem value="Estuaire">Estuaire</MenuItem>
                  <MenuItem value="Haut-Ogooué">Haut-Ogooué</MenuItem>
                  {/* Autres provinces... */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Ville"
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />
            </Grid>
            
            {/* Filtres numériques et de dates */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Âge min"
                type="number"
                value={filters.ageMin || ''}
                onChange={(e) => handleFilterChange('ageMin', parseInt(e.target.value) || undefined)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Âge max"
                type="number"
                value={filters.ageMax || ''}
                onChange={(e) => handleFilterChange('ageMax', parseInt(e.target.value) || undefined)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Créé après"
                value={filters.dateCreatedFrom || null}
                onChange={(date) => handleFilterChange('dateCreatedFrom', date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Créé avant"
                value={filters.dateCreatedTo || null}
                onChange={(date) => handleFilterChange('dateCreatedTo', date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            
            {/* Filtres de vulnérabilité et de programmes */}
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                label="Score de vulnérabilité min"
                type="number"
                value={filters.vulnerabilityScoreMin || ''}
                onChange={(e) => handleFilterChange('vulnerabilityScoreMin', parseFloat(e.target.value) || undefined)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                label="Score de vulnérabilité max"
                type="number"
                value={filters.vulnerabilityScoreMax || ''}
                onChange={(e) => handleFilterChange('vulnerabilityScoreMax', parseFloat(e.target.value) || undefined)}
              />
            </Grid>
            
            {/* Autocomplete pour les programmes sociaux */}
            <Grid item xs={12} sm={12} md={12}>
              <Autocomplete
                multiple
                limitTags={3}
                options={[]} // À charger depuis l'API
                value={filters.socialPrograms || []}
                onChange={(_, newValue) => handleFilterChange('socialPrograms', newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Programmes Sociaux"
                    placeholder="Sélectionnez des programmes"
                    fullWidth
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
              />
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
};