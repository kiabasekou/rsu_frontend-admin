import React from 'react';
import {
  Box,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
  GridValueGetterParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import {
  Edit,
  Delete,
  Visibility,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import { PersonIdentity } from '../../types/forms';

interface IdentityDataGridProps {
  data: PersonIdentity[];
  loading: boolean;
  onEdit: (person: PersonIdentity) => void;
  onDelete: (person: PersonIdentity) => void;
  onView?: (person: PersonIdentity) => void;
}

export const IdentityDataGrid: React.FC<IdentityDataGridProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
}) => {
  const columns: GridColDef<PersonIdentity>[] = [
    {
      field: 'photo',
      headerName: 'Photo',
      width: 80,
      renderCell: (params) => (
        <Avatar
          src={params.value || undefined}
          sx={{ width: 40, height: 40 }}
        >
          {params.row.firstName?.[0]}{params.row.lastName?.[0]}
        </Avatar>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: 'fullName',
      headerName: 'Nom Complet',
      width: 200,
      valueGetter: (params: GridValueGetterParams<PersonIdentity>) => 
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'nationalId',
      headerName: 'CNI',
      width: 130,
      renderCell: (params) => (
        <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'nip',
      headerName: 'NIP',
      width: 150,
      renderCell: (params) => (
        params.value ? (
          <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
            {params.value}
          </Box>
        ) : (
          <Chip label="Non attribué" size="small" color="warning" />
        )
      ),
    },
    {
      field: 'phoneNumber',
      headerName: 'Téléphone',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Phone fontSize="small" color="action" />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 180,
      renderCell: (params) => (
        params.value ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Email fontSize="small" color="action" />
            {params.value}
          </Box>
        ) : (
          <Chip label="Aucun" size="small" variant="outlined" />
        )
      ),
    },
    {
      field: 'location',
      headerName: 'Localisation',
      width: 200,
      valueGetter: (params: GridValueGetterParams<PersonIdentity>) => 
        `${params.row.city || ''}, ${params.row.province || ''}`,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOn fontSize="small" color="action" />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'vulnerabilityScore',
      headerName: 'Score Vulnérabilité',
      width: 150,
      renderCell: (params) => {
        const score = params.value;
        if (score === null || score === undefined) {
          return <Chip label="Non calculé" size="small" variant="outlined" />;
        }
        
        const getColor = (score: number) => {
          if (score >= 80) return 'error';
          if (score >= 60) return 'warning';
          if (score >= 40) return 'info';
          return 'success';
        };
        
        return (
          <Chip
            label={`${score}%`}
            size="small"
            color={getColor(score) as any}
            variant={score >= 60 ? 'filled' : 'outlined'}
          />
        );
      },
    },
    {
      field: 'isValidated',
      headerName: 'Statut',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Validé' : 'En attente'}
          size="small"
          color={params.value ? 'success' : 'warning'}
          variant={params.value ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Créé le',
      width: 120,
      type: 'date',
      valueGetter: (params: GridValueGetterParams<PersonIdentity>) => 
        params.value ? new Date(params.value) : null,
      valueFormatter: (params: GridValueFormatterParams) => 
        params.value ? new Date(params.value).toLocaleDateString('fr-FR') : '',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params: GridRowParams<PersonIdentity>) => [
        <GridActionsCellItem
          icon={
            <Tooltip title="Voir">
              <Visibility />
            </Tooltip>
          }
          label="Voir"
          onClick={() => onView?.(params.row)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Modifier">
              <Edit />
            </Tooltip>
          }
          label="Modifier"
          onClick={() => onEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Supprimer">
              <Delete />
            </Tooltip>
          }
          label="Supprimer"
          onClick={() => onDelete(params.row)}
          color="error"
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
          sorting: {
            sortModel: [{ field: 'createdAt', sort: 'desc' }],
          },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        density="standard"
        getRowHeight={() => 'auto'}
        sx={{
          '& .MuiDataGrid-cell': {
            py: 1,
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      />
    </Box>
  );
};