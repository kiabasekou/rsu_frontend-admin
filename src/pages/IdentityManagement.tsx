import React, { useState, useCallback } from 'react';
import { Box, Fab } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { identityAPI } from '../services/api';
import { PersonIdentity, PersonFormData, SearchFilters } from '../types/forms';
import { AdvancedSearch } from '../components/search/AdvancedSearch';
import { IdentityDataGrid } from '../components/grids/IdentityDataGrid';
import { PersonFormModal } from '../components/modals/PersonFormModal';

export const IdentityManagement: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PersonIdentity | null>(null);
  
  const queryClient = useQueryClient();

  const handleSearch = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters);
  }, []);

  const handlePersonSubmit = useCallback(async (data: PersonFormData) => {
    try {
      if (selectedPerson) {
        await identityAPI.updatePerson(selectedPerson.id.toString(), data);
      } else {
        await identityAPI.createPerson(data);
      }
      
      setFormOpen(false);
      setSelectedPerson(null);
      await queryClient.invalidateQueries({ queryKey: ['persons'] });
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      throw error;
    }
  }, [selectedPerson, queryClient]);

  const { data: personsResponse, isLoading } = useQuery({
    queryKey: ['persons', searchFilters],
    queryFn: () => identityAPI.getPersons(searchFilters),
  });

  return (
    <Box sx={{ p: 3 }}>
      <AdvancedSearch
        onSearch={handleSearch}
        onSaveSearch={() => {}}
        savedSearches={[]}
        isLoading={isLoading}
      />

      <IdentityDataGrid
        data={personsResponse?.data?.results || []}
        loading={isLoading}
        onEdit={(person) => {
          setSelectedPerson(person);
          setFormOpen(true);
        }}
        onDelete={(person) => {
          console.log('Supprimer:', person);
        }}
      />

      <PersonFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedPerson(null);
        }}
        onSubmit={handlePersonSubmit}
        initialData={selectedPerson || undefined}
        mode={selectedPerson ? 'edit' : 'create'}
      />

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setFormOpen(true)}
      >
        <Add />
      </Fab>
    </Box>
  );
};