/*import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Button, Menu, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, LinearProgress,
  Alert, Typography, Chip
} from '@mui/material';
import {
  FileDownload, FileUpload, Description,
  GetApp, Publish
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { usePermissions } from '../../hooks/usePermissions';

interface ImportExportActionsProps {
  data: any[];
  filename: string;
  onImport?: (data: any[]) => Promise<{
    created: number;
    updated: number;
    errors: string[];
  }>;
  columns?: Array<{ field: string; headerName: string }>;
}

export const ImportExportActions: React.FC<ImportExportActionsProps> = ({
  data, filename, onImport, columns
}) => {
  const { canExportData } = usePermissions();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [importDialog, setImportDialog] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    loading: boolean;
    success?: boolean;
    error?: string;
    results?: { created: number; updated: number; errors: string[] };
  }>({ loading: false });
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      if (columns) ws['!cols'] = columns.map(() => ({ wch: 20 }));
      XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
      setAnchorEl(null);
    } catch (error) {
      console.error('Erreur export Excel:', error);
    }
  };

  const handleExportCSV = () => {
    try {
      const csvContent = convertToCSV(data);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setAnchorEl(null);
    } catch (error) {
      console.error('Erreur export CSV:', error);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await fetch('/api/exports/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, filename, columns })
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.pdf`;
        link.click();
      }
      setAnchorEl(null);
    } catch (error) {
      console.error('Erreur export PDF:', error);
    }
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    try {
      const importedData = await parseFile(file);
      setPreviewData(importedData.slice(0, 5));
    } catch (error) {
      setImportStatus({
        loading: false,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur import'
      });
    }
  };

  const confirmImport = async () => {
    if (!selectedFile || !onImport) return;
    setImportStatus({ loading: true });
    try {
      const importedData = await parseFile(selectedFile);
      const results = await onImport(importedData);
      setImportStatus({ loading: false, success: true, results });
      setPreviewData([]);
      setSelectedFile(null);
    } catch (error) {
      setImportStatus({
        loading: false,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur import'
      });
    }
  };

  const parseFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Erreur lecture fichier'));
      reader.readAsArrayBuffer(file);
    });
  };

  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row =>
      headers.map(header => `"${String(row[header] || '').replace(/"/g, '""')}"`).join(',')
    );
    return [csvHeaders, ...csvRows].join('\n');
  };

  if (!canExportData) return null;

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<FileDownload />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          disabled={data.length === 0}
        >
          Exporter
        </Button>
        {onImport && (
          <Button
            variant="outlined"
            startIcon={<FileUpload />}
            onClick={() => setImportDialog(true)}
          >
            Importer
          </Button>
        )}
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleExportExcel}>
          <Description sx={{ mr: 1 }} />
          Excel (.xlsx)
        </MenuItem>
        <MenuItem onClick={handleExportCSV}>
          <GetApp sx={{ mr: 1 }} />
          CSV
        </MenuItem>
        <MenuItem onClick={handleExportPDF}>
          <Description sx={{ mr: 1 }} />
          PDF
        </MenuItem>
      </Menu>

      <Dialog open={importDialog} onClose={() => setImportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Importer des données</DialogTitle>
        <DialogContent>
          {importStatus.loading ? (
            <Box sx={{ py: 3 }}>
              <LinearProgress sx={{ mb: 2 }} />
              <Typography variant="body2" align="center">Import en cours...</Typography>
            </Box>
          ) : importStatus.success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>Import réussi !</Typography>
              {importStatus.results && (
                <Box sx={{ mt: 1 }}>
                  <Chip label={`${importStatus.results.created} créés`} color="success" size="small" sx={{ mr: 1 }} />
                  <Chip label={`${importStatus.results.updated} modifiés`} color="info" size="small" sx={{ mr: 1 }} />
                  {importStatus.results.errors.length > 0 && (
                    <Chip label={`${importStatus.results.errors.length} erreurs`} color="error" size="small" />
                  )}
                </Box>
              )}
            </Alert>
          ) : importStatus.error ? (
            <Alert severity="error" sx={{ mb: 2 }}>{importStatus.error}</Alert>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body1" gutterBottom>
                Sélectionnez un fichier Excel (.xlsx) à importer
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Le fichier doit contenir les colonnes appropriées
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportFile}
                style={{ display: 'none' }}
              />
              <Button variant="contained" startIcon={<Publish />} onClick={() => fileInputRef.current?.click()}>
                Choisir un fichier
              </Button>
            </Box>
          )}

                    {previewData.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Prévisualisation :
              </Typography>
              <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {Object.keys(previewData[0]).map((key) => (
                      <th
                        key={key}
                        style={{
                          borderBottom: '1px solid #ccc',
                          padding: '6px',
                          textAlign: 'left',
                          backgroundColor: '#f5f5f5'
                        }}
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td
                          key={i}
                          style={{
                            padding: '6px',
                            borderBottom: '1px solid #eee',
                            fontSize: '0.875rem'
                          }}
                        >
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button variant="contained" onClick={confirmImport}>
                  Valider l’import
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setImportDialog(false);
              setImportStatus({ loading: false });
              setPreviewData([]);
              setSelectedFile(null);
            }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
*/
export {};