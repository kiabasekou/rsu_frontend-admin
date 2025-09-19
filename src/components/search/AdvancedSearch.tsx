import React, { useState, useCallback, useMemo } from 'react';
import {
  Card, CardContent, TextField, Grid, Button, Chip,
  FormControl, InputLabel, Select, MenuItem,
  Autocomplete, Box, Collapse, IconButton,
  Typography, Divider
} from '@mui/material';
import {
  Search, FilterList, Clear, ExpandMore, ExpandLess,
  Save, FolderOpen
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';

export interface SearchFilters {
  query?: string;
  nationalId?: string;
  phoneNumber?: string;
  province?: string;
  city?: string;
  ageMin?: number;
  ageMax?: number;
  gender?: string;
  hasPhoto?: boolean;
  isValidated?: boolean;
  socialPrograms?: string[];
  vulnerabilityMin?: number;
  vulnerabilityMax?: number;
  dateCreatedFrom?: Date | null;
  dateCreatedTo?: Date | null;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onSaveSearch: (name: string, filters: SearchFilters) => void;
  savedSearches: Array<{ id: string; name: string; filters: SearchFilters }>;
  isLoading?: boolean;
  allSocialPrograms: string[];
}

const getFilterLabel = (key: keyof SearchFilters, value: any): string => {
  if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
    return '';
  }
  switch (key) {
    case 'query':
      return `Recherche: "${value}"`;
    case 'ageMin':
      return `Âge min: ${value}`;
    case 'ageMax':
      return `Âge max: ${value}`;
    case 'dateCreatedFrom':
      return `Créé après: ${(value as Date).toLocaleDateString()}`;
    case 'dateCreatedTo':
      return `Créé avant: ${(value as Date).toLocaleDateString()}`;
    case 'socialPrograms':
      return `Programmes: ${(value as string[]).join(', ')}`;
    case 'vulnerabilityMin':
      return `Vulnérabilité min: ${value}`;
    case 'vulnerabilityMax':
      return `Vulnérabilité max: ${value}`;
    default:
      return `${key}: ${value}`;
  }
};

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch, onSaveSearch, savedSearches, isLoading = false, allSocialPrograms
}) => {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const gabonProvinces = [
    'Estuaire', 'Haut-Ogooué', 'Moyen-Ogooué', 'Ngounié',
    'Nyanga', 'Ogooué-Ivindo', 'Ogooué-Lolo', 'Ogooué-Maritime', 'Woleu-Ntem'
  ];
  
  const activeFilters = useMemo(() => {
    const active = Object.entries(filters)
      .filter(([key, v]) => {
        if (key === 'query' || key === 'phoneNumber' || key === 'nationalId' || key === 'city') {
          return typeof v === 'string' && v.trim() !== '';
        }
        if (Array.isArray(v)) {
          return v.length > 0;
        }
        return v !== undefined && v !== null;
      })
      .map(([k, _]) => k as keyof SearchFilters);
    return active.filter(key => getFilterLabel(key, filters[key]) !== '');
  }, [filters]);
  
  const handleFilterChange = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [key]: value };
      
      const isValueEmpty = (
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0) ||
        value === null ||
        value === undefined
      );

      if (isValueEmpty) {
        delete newFilters[key];
      }
      return newFilters;
    });
  }, []);

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onSearch({});
  };

  const handleSaveSearch = () => {
    const name = prompt('Nom de la recherche :');
    if (name && activeFilters.length > 0) {
      onSaveSearch(name, filters);
    }
  };

  const handleLoadSavedSearch = (savedFilters: SearchFilters) => {
    setFilters(savedFilters);
    onSearch(savedFilters);
  };

  const removeFilter = (key: keyof SearchFilters) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      delete newFilters[key];
      onSearch(newFilters);
      return newFilters;
    });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* Barre de recherche principale */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom, CNI, téléphone..."
              value={filters.query || ''}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
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
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: expanded ? 'primary.50' : 'transparent',
                  color: expanded ? 'primary.main' : 'inherit'
                }}
              >
                <FilterList />
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
              
              <IconButton onClick={handleClearFilters} disabled={activeFilters.length === 0}>
                <Clear />
              </IconButton>
              
              <IconButton onClick={handleSaveSearch} disabled={activeFilters.length === 0}>
                <Save />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Filtres actifs */}
        {activeFilters.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {activeFilters.map(filterKey => (
              <Chip
                key={filterKey}
                label={getFilterLabel(filterKey, filters[filterKey])}
                onDelete={() => removeFilter(filterKey)}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        )}

        {/* Recherches sauvegardées */}
        {savedSearches.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Recherches sauvegardées :
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {savedSearches.map(saved => (
                <Chip
                  key={saved.id}
                  label={saved.name}
                  onClick={() => handleLoadSavedSearch(saved.filters)}
                  icon={<FolderOpen />}
                  variant="outlined"
                  clickable
                />
              ))}
            </Box>
          </Box>
        )}

        <Collapse in={expanded}>
          <Box sx={{ mt: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Filtres Avancés
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {/* Filtres par champs */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="CNI"
                  value={filters.nationalId ?? ''}
                  onChange={(e) => handleFilterChange('nationalId', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  value={filters.phoneNumber ?? ''}
                  onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Genre</InputLabel>
                  <Select
                    value={filters.gender || ''}
                    label="Genre"
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                  >
                    <MenuItem value=""><em>Tous</em></MenuItem>
                    <MenuItem value="M">Masculin</MenuItem>
                    <MenuItem value="F">Féminin</MenuItem>
                    <MenuItem value="Autre">Autre</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Province</InputLabel>
                  <Select
                    value={filters.province || ''}
                    label="Province"
                    onChange={(e) => handleFilterChange('province', e.target.value)}
                  >
                    <MenuItem value=""><em>Toutes</em></MenuItem>
                    {gabonProvinces.map(p => (
                      <MenuItem key={p} value={p}>{p}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Ville"
                  value={filters.city ?? ''}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                />
              </Grid>
              
              {/* Filtres numériques et de dates */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Âge min"
                  type="number"
                  value={filters.ageMin ?? ''}
                  onChange={(e) => handleFilterChange('ageMin', e.target.value ? Number(e.target.value) : undefined)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Âge max"
                  type="number"
                  value={filters.ageMax ?? ''}
                  onChange={(e) => handleFilterChange('ageMax', e.target.value ? Number(e.target.value) : undefined)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Créé après"
                  value={filters.dateCreatedFrom || null}
                  onChange={(newValue) => handleFilterChange('dateCreatedFrom', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Créé avant"
                  value={filters.dateCreatedTo || null}
                  onChange={(newValue) => handleFilterChange('dateCreatedTo', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              
              {/* Filtres de vulnérabilité et de programmes */}
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  label="Score de vulnérabilité min"
                  type="number"
                  value={filters.vulnerabilityMin ?? ''}
                  onChange={(e) => handleFilterChange('vulnerabilityMin', e.target.value ? Number(e.target.value) : undefined)}
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  label="Score de vulnérabilité max"
                  type="number"
                  value={filters.vulnerabilityMax ?? ''}
                  onChange={(e) => handleFilterChange('vulnerabilityMax', e.target.value ? Number(e.target.value) : undefined)}
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
              
              {/* Autocomplete pour les programmes sociaux */}
              <Grid item xs={12} sm={12} md={12}>
                <Autocomplete
                  multiple
                  limitTags={3}
                  options={allSocialPrograms}
                  value={filters.socialPrograms || []}
                  onChange={(_, newValue) => handleFilterChange('socialPrograms', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Programmes Sociaux"
                      placeholder="Sélectionnez des programmes"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};