import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PropertyForm from './components/PropertyForm';
import PropertyPreview from './components/PropertyPreview';
import PropertyList from './components/PropertyList';
import { PropertyData, Project } from './types';
import { apiService } from './services/apiService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const [propertyData, setPropertyData] = useState<PropertyData>({
    title: '',
    size: '',
    price: '',
    handoverDate: null,
    projectId: ''
  });
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProjects();
      setProjects(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load projects. Please check your connection and try again.');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertySubmit = async (data: PropertyData) => {
    try {
      setError(null);
      setSuccess(null);
      
      const response = await apiService.createProperty(data);
      setSuccess('Property created successfully!');
      
      // Reset form after successful submission
      setPropertyData({
        title: '',
        size: '',
        price: '',
        handoverDate: null,
        projectId: ''
      });
      
      // Trigger PropertyList refresh
      setRefreshKey(prev => prev + 1);
      
      console.log('Property created:', response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create property';
      setError(errorMessage);
      console.error('Error creating property:', err);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          Property Management Tool
        </Typography>
        
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
          Add new property listings to your projects
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
          gap: 4 
        }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Property Details
            </Typography>
            <PropertyForm
              propertyData={propertyData}
              setPropertyData={setPropertyData}
              projects={projects}
              onSubmit={handlePropertySubmit}
            />
          </Paper>
          
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Live Preview
            </Typography>
            <PropertyPreview
              propertyData={propertyData}
              projects={projects}
            />
          </Paper>
        </Box>

        {/* Existing Properties List */}
        <Box sx={{ mt: 6 }}>
          <PropertyList key={refreshKey} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
