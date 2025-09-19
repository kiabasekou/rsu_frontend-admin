import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add } from '@mui/icons-material';
import { programsAPI } from '../../services/api';
import { SocialProgram } from '../../types';

const columns: GridColDef[] = [
  { field: 'code', headerName: 'Code', width: 120 },
  { field: 'name', headerName: 'Nom du Programme', width: 250 },
  { field: 'program_type', headerName: 'Type', width: 150 },
  {
    field: 'total_budget',
    headerName: 'Budget Total',
    width: 150,
    type: 'number',
    valueFormatter: (params: { value?: number }) =>
      `${params.value?.toLocaleString()} FCFA`,
  },
  {
    field: 'current_beneficiaries',
    headerName: 'Bénéficiaires',
    width: 130,
    type: 'number',
  },
  {
    field: 'status',
    headerName: 'Statut',
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={params.value === 'ACTIVE' ? 'success' : 'default'}
        size="small"
      />
    ),
  },
];

export const ProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<SocialProgram[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<SocialProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    if (statusFilter === 'ALL') {
      setFilteredPrograms(programs);
    } else {
      setFilteredPrograms(programs.filter(p => p.status === statusFilter));
    }
  }, [statusFilter, programs]);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await programsAPI.getPrograms();
      setPrograms(response.data.results);
    } catch (err) {
      setError('Erreur lors du chargement des programmes');
      console.error('Error loading programs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Programmes Sociaux
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            // TODO: Ouvrir modal création
          }}
        >
          Nouveau Programme
        </Button>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1">
          Total : {filteredPrograms.length} programme(s)
        </Typography>
        <TextField
          select
          label="Filtrer par statut"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
          sx={{ width: 200 }}
        >
          <MenuItem value="ALL">Tous</MenuItem>
          <MenuItem value="ACTIVE">Actifs</MenuItem>
          <MenuItem value="INACTIVE">Inactifs</MenuItem>
        </TextField>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 600, width: '100%', position: 'relative' }}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={filteredPrograms}
            columns={columns}
            getRowId={(row) => row.code}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
          />
        )}
      </Paper>
    </Box>
  );
};
