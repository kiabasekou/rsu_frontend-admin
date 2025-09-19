import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { PersonForm } from '../components/forms/PersonForm';
import { AdvancedSearch } from '../components/search/AdvancedSearch';
import { ImportExportActions } from '../components/data/ImportExportActions';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { usePermissions } from '../hooks/usePermissions';
import { PersonFormData, SearchFilters } from '../types/forms';
import { format } from 'date-fns';

interface PersonData {
  id: string;
  fullName: string;
  nationalId: string;
  phoneNumber: string;
  city: string;
  province: string;
  vulnerabilityScore: number;
  isValidated: boolean;
}

// Données fictives pour les programmes sociaux
const DUMMY_SOCIAL_PROGRAMS = [
  'Programme A', 'Programme B', 'Programme C', 'Programme D', 'Programme E'
];

export const IdentityManagement: React.FC = () => {
  const { canCreateIdentity } = usePermissions();
  const [persons, setPersons] = useState<PersonData[]>([]);
  const [filteredPersons, setFilteredPersons] = useState<PersonData[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);

  const columns: GridColDef[] = [
    { field: 'fullName', headerName: 'Nom complet', width: 200 },
    { field: 'nationalId', headerName: 'CNI', width: 150 },
    { field: 'phoneNumber', headerName: 'Téléphone', width: 150 },
    { field: 'city', headerName: 'Ville', width: 120 },
    { field: 'province', headerName: 'Province', width: 120 },
    { field: 'vulnerabilityScore', headerName: 'Score', width: 100, type: 'number' },
    { field: 'isValidated', headerName: 'Validé', width: 100, type: 'boolean' }
  ];

  // Ajout de useCallback pour la fonction de recherche afin d'éviter les recréations inutiles
  const handleSearch = useCallback(async (filters: SearchFilters) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') return;

        if (Array.isArray(value)) {
          // Gère les tableaux de chaînes de caractères
          value.forEach(item => queryParams.append(key, String(item)));
        } else if (value instanceof Date) {
          // Gère les objets Date en les formatant en chaîne de caractères
          queryParams.append(key, format(value, 'yyyy-MM-dd'));
        } else {
          queryParams.append(key, String(value));
        }
      });
      
      const response = await fetch(`/api/persons?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFilteredPersons(data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setFilteredPersons([]); // Réinitialise en cas d'erreur
    } finally {
      setLoading(false);
    }
  }, []);

  // Utilise useEffect pour charger les données initiales au montage du composant
  useEffect(() => {
    handleSearch({});
  }, [handleSearch]);

  const handlePersonSubmit = async (data: PersonFormData) => {
    const url = selectedPerson ? `/api/persons/${selectedPerson.id}` : '/api/persons';
    const method = selectedPerson ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    // Après soumission, on referme le formulaire et on rafraîchit la liste avec les filtres actuels.
    setFormOpen(false);
    handleSearch({});
  };

  return (
    <ProtectedRoute requiredPermission="identity.read">
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h4">Gestion des Identités</Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <ImportExportActions
              data={filteredPersons}
              filename="identites"
              columns={columns.map(col => ({ field: col.field, headerName: col.headerName || col.field }))}
            />
            
            {canCreateIdentity && (
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => {
                  setSelectedPerson(null);
                  setFormOpen(true);
                }}
              >
                Nouvelle Identité
              </Button>
            )}
          </Box>
        </Box>

        <AdvancedSearch
          onSearch={handleSearch}
          onSaveSearch={() => {}}
          savedSearches={[]}
          isLoading={loading}
          allSocialPrograms={DUMMY_SOCIAL_PROGRAMS}
        />

        <DataGrid
          rows={filteredPersons}
          columns={columns}
          loading={loading}
          checkboxSelection
          disableRowSelectionOnClick={false}
          autoHeight
          onRowDoubleClick={(params: GridRowParams) => {
            setSelectedPerson(params.row as PersonData);
            setFormOpen(true);
          }}
        />

        <PersonForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handlePersonSubmit}
          initialData={selectedPerson || undefined}
          mode={selectedPerson ? 'edit' : 'create'}
        />
      </Box>
    </ProtectedRoute>
  );
};