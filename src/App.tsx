import { useState } from 'react'
import { Container, Box, Button, Typography } from '@mui/material'
import InternshipApplicationForm from './components/InternshipApplicationForm'
import OfferLetterForm from './components/OfferLetterForm'
import './App.css'

function App() {
  const [activeForm, setActiveForm] = useState<'internship' | 'offer'>('internship')

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          HR Management System
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
          <Button
            variant={activeForm === 'internship' ? 'contained' : 'outlined'}
            onClick={() => setActiveForm('internship')}
          >
            Internship Application
          </Button>
          <Button
            variant={activeForm === 'offer' ? 'contained' : 'outlined'}
            onClick={() => setActiveForm('offer')}
          >
            Generate Offer Letter
          </Button>
        </Box>

        {activeForm === 'internship' ? (
          <InternshipApplicationForm />
        ) : (
          <OfferLetterForm />
        )}
      </Box>
    </Container>
  )
}

export default App
