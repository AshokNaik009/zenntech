import React, { useState } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  InputAdornment,
  Stack,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PropertyData, Project } from '../types';
import { safeTrim, isEmpty, isValidNumber } from '../utils/validation';
import dayjs from 'dayjs';

interface PropertyFormProps {
  propertyData: PropertyData;
  setPropertyData: React.Dispatch<React.SetStateAction<PropertyData>>;
  projects: Project[];
  onSubmit: (data: PropertyData) => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  propertyData,
  setPropertyData,
  projects,
  onSubmit
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof PropertyData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target?.value ?? event ?? '';
    setPropertyData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setPropertyData(prev => ({
      ...prev,
      handoverDate: date
    }));
    
    if (errors.handoverDate) {
      setErrors(prev => ({
        ...prev,
        handoverDate: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (isEmpty(propertyData.title)) {
      newErrors.title = 'Title is required';
    } else if (safeTrim(propertyData.title).length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    // Size validation
    if (isEmpty(propertyData.size)) {
      newErrors.size = 'Size is required';
    } else if (!isValidNumber(propertyData.size)) {
      newErrors.size = 'Size must be a positive number';
    }

    // Price validation
    if (isEmpty(propertyData.price)) {
      newErrors.price = 'Price is required';
    } else if (!isValidNumber(propertyData.price)) {
      newErrors.price = 'Price must be a positive number';
    }

    // Project validation
    if (!propertyData.projectId) {
      newErrors.projectId = 'Project selection is required';
    }

    // Date validation
    if (!propertyData.handoverDate) {
      newErrors.handoverDate = 'Handover date is required';
    } else if (propertyData.handoverDate.isBefore(dayjs(), 'day')) {
      newErrors.handoverDate = 'Handover date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(propertyData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      !isEmpty(propertyData.title) &&
      safeTrim(propertyData.title).length >= 3 &&
      !isEmpty(propertyData.size) &&
      isValidNumber(propertyData.size) &&
      !isEmpty(propertyData.price) &&
      isValidNumber(propertyData.price) &&
      propertyData.projectId &&
      propertyData.handoverDate &&
      propertyData.handoverDate.isAfter(dayjs(), 'day')
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField
            label="Property Title"
            value={propertyData.title}
            onChange={handleInputChange('title')}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            required
            placeholder="e.g., Luxury Beachfront Villa"
          />

          <FormControl fullWidth required error={!!errors.projectId}>
            <InputLabel>Project</InputLabel>
            <Select
              value={propertyData.projectId}
              onChange={handleInputChange('projectId')}
              label="Project"
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
            {errors.projectId && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.projectId}
              </Alert>
            )}
          </FormControl>

          <TextField
            label="Size"
            value={propertyData.size}
            onChange={handleInputChange('size')}
            error={!!errors.size}
            helperText={errors.size}
            fullWidth
            required
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">sq. ft.</InputAdornment>,
            }}
            placeholder="e.g., 1500"
          />

          <TextField
            label="Price"
            value={propertyData.price}
            onChange={handleInputChange('price')}
            error={!!errors.price}
            helperText={errors.price}
            fullWidth
            required
            type="number"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            placeholder="e.g., 500000"
          />

          <DatePicker
            label="Handover Date"
            value={propertyData.handoverDate}
            onChange={handleDateChange}
            minDate={dayjs().add(1, 'day')}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                error: !!errors.handoverDate,
                helperText: errors.handoverDate
              }
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!isFormValid() || isSubmitting}
            sx={{ mt: 3, py: 1.5 }}
          >
            {isSubmitting ? 'Saving...' : 'Save Property'}
          </Button>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default PropertyForm;