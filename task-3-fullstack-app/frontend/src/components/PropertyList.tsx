import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { apiService } from '../services/apiService';

interface Property {
  id: number;
  title: string;
  size: number;
  price: number;
  handover_date: string;
  project_id: string;
  projects?: {
    name: string;
  };
}

const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getProperties();
      setProperties(response.data);
    } catch (err: any) {
      setError('Failed to load properties');
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button onClick={loadProperties} size="small" sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  if (properties.length === 0) {
    return (
      <Card elevation={1} sx={{ 
        border: '2px dashed #e0e0e0',
        bgcolor: '#fafafa',
        textAlign: 'center',
        py: 4
      }}>
        <CardContent>
          <HomeIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5, color: 'text.secondary' }} />
          <Typography variant="h6" gutterBottom color="text.secondary">
            No Properties Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first property using the form above
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" color="primary">
          Existing Properties ({properties.length})
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadProperties}
          variant="outlined"
          size="small"
        >
          Refresh
        </Button>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, 
        gap: 2 
      }}>
        {properties.map((property) => (
          <Box key={property.id}>
            <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {property.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {property.projects?.name || property.project_id}
                </Typography>

                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
                    {formatPrice(property.price)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {property.size.toLocaleString()} sq. ft.
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={`Handover: ${formatDate(property.handover_date)}`}
                    size="small"
                    variant="outlined"
                    color="info"
                  />
                </Box>

                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    ${Math.round(property.price / property.size).toLocaleString()} per sq. ft.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PropertyList;