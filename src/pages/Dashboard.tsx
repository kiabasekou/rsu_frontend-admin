import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import {
  People,
  AccountBalance,
  TrendingUp,
  Assessment,
} from '@mui/icons-material';

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="h2">
            {value}
          </Typography>
        </Box>
        <Box sx={{ color, fontSize: 40 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord RSU
      </Typography>
      
      <Stack spacing={3}>
        <Stack direction="row" spacing={2}>
          <StatCard
            title="Identités Totales"
            value="2,847"
            icon={<People />}
            color="#1976d2"
          />
          <StatCard
            title="Programmes Actifs"
            value="12"
            icon={<AccountBalance />}
            color="#2e7d32"
          />
          <StatCard
            title="Bénéficiaires"
            value="1,234"
            icon={<TrendingUp />}
            color="#ed6c02"
          />
          <StatCard
            title="Taux Éligibilité"
            value="78%"
            icon={<Assessment />}
            color="#9c27b0"
          />
        </Stack>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            🚀 Bienvenue dans le Registre Social Unique
          </Typography>
          <Typography>
            Interface d'administration moderne pour la gestion des programmes sociaux du Gabon.
            Développé selon les standards top 1% pour le projet Gabon Digital.
          </Typography>
        </Paper>
      </Stack>
    </Box>
  );
};