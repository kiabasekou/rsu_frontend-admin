import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add } from '@mui/icons-material';
import { identityAPI } from '../../services/api';
import { PersonIdentity } from '../../types';

const columns: GridColDef[] = [
  { field: 'full_name', headerName: 'Nom Complet', width: 200 },
  { field: 'national_id', headerName: 'CNI', width: 150 },
  { field: 'phone_number', headerName: 'Téléphone', width: 150 },
  { field: 'city', headerName: 'Ville', width: 130 },
  { field: 'province', headerName: 'Province', width: 130 },
  { 
    field: 'is_validated', 
    headerName: 'Validé', 
    width: 100,
    type: 'boolean'
  },
  { 
    field: 'created_at', 
    headerName: 'Créé le', 
    width: 150,
    type: 'date',
    valueGetter: (value) => new Date(value) 
  },
];

export const IdentityPage: React.FC = () => {
  const [persons, setPersons] = useState<PersonIdentity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPersons();
  }, []);

  const loadPersons = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await identityAPI.getPersons();
      setPersons(response.data.results);
    } catch (err) {
      setError('Erreur lors du chargement des identités');
      console.error('Error loading persons:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Gestion des Identités
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {/* TODO: Ouvrir modal création */}}
        >
          Nouvelle Identité
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
            rows={persons}
            columns={columns}
            initialState={{
                pagination: {
                paginationModel: { page: 0, pageSize: 10 },
                },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            loading={loading}
        />
      </Paper>
    </Box>
  );
};