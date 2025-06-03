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
import { submitInternshipApplication } from '../services/api';
import type { InternshipApplication } from '../types/index';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  university: Yup.string().required('University is required'),
  major: Yup.string().required('Major is required'),
  graduationYear: Yup.string().required('Graduation year is required'),
  resume: Yup.mixed().required('Resume is required'),
  coverLetter: Yup.string().required('Cover letter is required'),
});

const InternshipApplicationForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formik = useFormik<InternshipApplication>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      university: '',
      major: '',
      graduationYear: '',
      resume: null,
      coverLetter: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const response = await submitInternshipApplication(values);
        if (response.success) {
          setSuccess(true);
          formik.resetForm();
        } else {
          setError(response.error || 'Failed to submit application');
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
        Internship Application
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Application submitted successfully!
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'grid', gap: 2, pb: 4 }}>
          <TextField
            fullWidth
            id="firstName"
            name="firstName"
            label="First Name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />

          <TextField
            fullWidth
            id="lastName"
            name="lastName"
            label="Last Name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />

          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="Phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />

          <TextField
            fullWidth
            id="university"
            name="university"
            label="University"
            value={formik.values.university}
            onChange={formik.handleChange}
            error={formik.touched.university && Boolean(formik.errors.university)}
            helperText={formik.touched.university && formik.errors.university}
          />

          <TextField
            fullWidth
            id="major"
            name="major"
            label="Major"
            value={formik.values.major}
            onChange={formik.handleChange}
            error={formik.touched.major && Boolean(formik.errors.major)}
            helperText={formik.touched.major && formik.errors.major}
          />

          <TextField
            fullWidth
            id="graduationYear"
            name="graduationYear"
            label="Graduation Year"
            value={formik.values.graduationYear}
            onChange={formik.handleChange}
            error={formik.touched.graduationYear && Boolean(formik.errors.graduationYear)}
            helperText={formik.touched.graduationYear && formik.errors.graduationYear}
          />

          <input
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            id="resume"
            type="file"
            onChange={(event) => {
              formik.setFieldValue('resume', event.currentTarget.files?.[0] || null);
            }}
          />
          <label htmlFor="resume">
            <Button variant="outlined" component="span">
              Upload Resume
            </Button>
          </label>
          {formik.touched.resume && formik.errors.resume && (
            <Typography color="error" variant="caption">
              {formik.errors.resume}
            </Typography>
          )}

          <TextField
            fullWidth
            id="coverLetter"
            name="coverLetter"
            label="Cover Letter"
            multiline
            rows={4}
            value={formik.values.coverLetter}
            onChange={formik.handleChange}
            error={formik.touched.coverLetter && Boolean(formik.errors.coverLetter)}
            helperText={formik.touched.coverLetter && formik.errors.coverLetter}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Application'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default InternshipApplicationForm; 
