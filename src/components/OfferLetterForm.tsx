import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { generateOfferLetter } from '../services/api';
import { OfferLetter } from '../types';

const validationSchema = Yup.object({
  candidateName: Yup.string().required('Candidate name is required'),
  position: Yup.string().required('Position is required'),
  startDate: Yup.string().required('Start date is required'),
  salary: Yup.string().required('Salary is required'),
  department: Yup.string().required('Department is required'),
  reportingManager: Yup.string().required('Reporting manager is required'),
  terms: Yup.string().required('Terms are required'),
});

const OfferLetterForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formik = useFormik<OfferLetter>({
    initialValues: {
      candidateName: '',
      position: '',
      startDate: '',
      salary: '',
      department: '',
      reportingManager: '',
      terms: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const response = await generateOfferLetter(values);
        if (response.success) {
          setSuccess(true);
          formik.resetForm();
        } else {
          setError(response.error || 'Failed to generate offer letter');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Generate Offer Letter
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Offer letter generated successfully!
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField
            fullWidth
            id="candidateName"
            name="candidateName"
            label="Candidate Name"
            value={formik.values.candidateName}
            onChange={formik.handleChange}
            error={formik.touched.candidateName && Boolean(formik.errors.candidateName)}
            helperText={formik.touched.candidateName && formik.errors.candidateName}
          />

          <TextField
            fullWidth
            id="position"
            name="position"
            label="Position"
            value={formik.values.position}
            onChange={formik.handleChange}
            error={formik.touched.position && Boolean(formik.errors.position)}
            helperText={formik.touched.position && formik.errors.position}
          />

          <TextField
            fullWidth
            id="startDate"
            name="startDate"
            label="Start Date"
            type="date"
            value={formik.values.startDate}
            onChange={formik.handleChange}
            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
            helperText={formik.touched.startDate && formik.errors.startDate}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            id="salary"
            name="salary"
            label="Salary"
            value={formik.values.salary}
            onChange={formik.handleChange}
            error={formik.touched.salary && Boolean(formik.errors.salary)}
            helperText={formik.touched.salary && formik.errors.salary}
          />

          <TextField
            fullWidth
            id="department"
            name="department"
            label="Department"
            value={formik.values.department}
            onChange={formik.handleChange}
            error={formik.touched.department && Boolean(formik.errors.department)}
            helperText={formik.touched.department && formik.errors.department}
          />

          <TextField
            fullWidth
            id="reportingManager"
            name="reportingManager"
            label="Reporting Manager"
            value={formik.values.reportingManager}
            onChange={formik.handleChange}
            error={formik.touched.reportingManager && Boolean(formik.errors.reportingManager)}
            helperText={formik.touched.reportingManager && formik.errors.reportingManager}
          />

          <TextField
            fullWidth
            id="terms"
            name="terms"
            label="Terms and Conditions"
            multiline
            rows={4}
            value={formik.values.terms}
            onChange={formik.handleChange}
            error={formik.touched.terms && Boolean(formik.errors.terms)}
            helperText={formik.touched.terms && formik.errors.terms}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate Offer Letter'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default OfferLetterForm; 