import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Stack,
  Avatar
} from '@mui/material';
import {
  Home as HomeIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Square as SquareIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { PropertyData, Project } from '../types';

interface PropertyPreviewProps {
  propertyData: PropertyData;
  projects: Project[];
}

const PropertyPreview: React.FC<PropertyPreviewProps> = ({
  propertyData,
  projects
}) => {
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Select a project';
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatSize = (size: string) => {
    const numSize = parseFloat(size);
    if (isNaN(numSize)) return '0 sq. ft.';
    return `${numSize.toLocaleString()} sq. ft.`;
  };

  const formatDate = (date: any) => {
    if (!date) return 'Select a date';
    return date.format('DD MMMM YYYY');
  };

  const isEmpty = !propertyData.title && !propertyData.size && !propertyData.price && !propertyData.projectId && !propertyData.handoverDate;

  if (isEmpty) {
    return (
      <Card elevation={1} sx={{ 
        border: '2px dashed #e0e0e0',
        bgcolor: '#fafafa',
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CardContent>
          <Box textAlign="center" sx={{ color: 'text.secondary' }}>
            <HomeIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom>
              Property Preview
            </Typography>
            <Typography variant="body2">
              Fill out the form to see a preview of your property listing
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={2} sx={{ minHeight: 400 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {propertyData.title || 'Property Title'}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {getProjectName(propertyData.projectId)}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Key Details */}
          <Stack spacing={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                <MoneyIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Price
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatPrice(propertyData.price)}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                <SquareIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Size
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatSize(propertyData.size)}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'success.main', width: 40, height: 40 }}>
                <CalendarIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Handover Date
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatDate(propertyData.handoverDate)}
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Divider />

          {/* Status Indicators */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Status
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                label="New Listing"
                color="primary"
                size="small"
                variant="outlined"
              />
              {propertyData.handoverDate && propertyData.handoverDate.isAfter(new Date()) && (
                <Chip
                  label="Future Handover"
                  color="info"
                  size="small"
                  variant="outlined"
                />
              )}
              {parseFloat(propertyData.price) > 1000000 && (
                <Chip
                  label="Luxury"
                  color="warning"
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>

          {/* Price per sq ft */}
          {propertyData.price && propertyData.size && (
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Price per sq. ft.
              </Typography>
              <Typography variant="h6" color="primary">
                {formatPrice((parseFloat(propertyData.price) / parseFloat(propertyData.size)).toString())}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PropertyPreview;