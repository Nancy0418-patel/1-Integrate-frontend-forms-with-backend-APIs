import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Define fonts for pdfmake
// Ensure you have these .ttf files in the server/fonts directory
const fonts = {
  Roboto: {
    normal: path.join(__dirname, '..', 'fonts', 'Roboto-Regular.ttf'),
    bold: path.join(__dirname, '..', 'fonts', 'Roboto-Medium.ttf'),
    italics: path.join(__dirname, '..', 'fonts', 'Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, '..', 'fonts', 'Roboto-MediumItalic.ttf'),
  },
  // You might need to add other fonts if used in the template image
};

const printer = new PdfPrinter(fonts);

// API Routes
app.post('/api/internship-application', upload.single('resume'), (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      university,
      major,
      graduationYear,
      coverLetter,
    } = req.body;

    // Here you would typically save the data to a database
    // For now, we'll just return a success response
    res.json({
      success: true,
      data: {
        firstName,
        lastName,
        email,
        phone,
        university,
        major,
        graduationYear,
        coverLetter,
        resume: req.file ? req.file.filename : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process internship application',
    });
  }
});

app.post('/api/offer-letter', (req, res) => {
  try {
    const {
      candidateName,
      position,
      startDate,
      salary,
      department,
      reportingManager,
      terms,
    } = req.body;

    // NOTE: The frontend form does not currently collect all the details shown in the MICRO IT template (e.g., college, specific batch dates, stipend). Using placeholder text or adapting existing form data.
    const internName = candidateName || '[Candidate Name]';
    const internPosition = position || '[Position]'; // This will be used in the main paragraph
    const internCollege = '[Candidate College]'; // Placeholder - add input to frontend form to capture this
    const batchDates = '10 May to 10 June 2025'; // Placeholder - adapt or add input
    const stipendAmount = '₹15000'; // Placeholder - adapt or add input
    const softwareDeveloperText = 'Software Developer'; // Text from template, not from form

    const documentDefinition: TDocumentDefinitions = {
      pageSize: 'LETTER', // Set page size to LETTER (corrected)
      content: [
        // Header - Replicated layout from the image
        {
          columns: [
            // Left Column: Graphical Logo, Text Logo, and Title Stack
            {
              stack: [
                // Row 1: Graphical Logo and Text Logo
                {
                  columns: [
                    { image: path.join(__dirname, 'microit-logo.png'), width: 100, alignment: 'left', margin: [0, 0, 0, 0] }, // Graphical Logo
                    { image: path.join(__dirname, 'microit-text-logo.png'), width: 300, alignment: 'left' }, // Increased width
                  ],
                  columnGap: 20, // Increased gap
                  margin: [0, 0, 0, 5], // Margin below the logos
                },
                // Removed Row 2: Internship Offer Letter Title to avoid duplication
                // { text: 'INTERNSHIP OFFER LETTER', style: 'offerTitle', alignment: 'left' }, // Title
              ],
              width: '*', // Take up as much space as possible
            },
            // Right Column: Badge Image
            {
              image: path.join(__dirname, 'microit-type-logo.png'), // Path to badge image (assuming this filename)
              width: 100, // Adjust width as needed
              alignment: 'right',
            },
          ],
          columnGap: 0, // Reduced gap between columns
          margin: [0, 0, 0, 30], // Increased margin after the entire header
        },

        // Candidate Details Section
        { text: internName, style: 'candidateName' },
        { text: `${softwareDeveloperText} Intern`, style: 'candidateDetails' }, // Using fixed text from template
        { text: `College: ${internCollege}`, style: 'candidateDetails' },

        // Salutation
        { text: '\nDear Intern,', style: 'body', margin: [0, 20, 0, 10] }, // Changed salutation to match template

        // Offer Details Paragraph
        {
          text:
            `We are pleased to offer you a 1-month internship at MICRO IT as a ${softwareDeveloperText} in Full-Stack Development. This internship is unpaid, but based on excellence, a post-internship opportunity with Stipend up to ₹${stipendAmount} can be given by Micro IT. Your internship batch starts on ${batchDates} and you complete your projects as soon as you complete and before 15 June 2025.`,
          style: 'body',
          margin: [0, 0, 0, 15], // Adjusted margin
        },

        // Points to Remember
        { text: 'Points to remember', style: 'subheader', margin: [0, 10, 0, 5] },
        {
          ul: [
            'You have to develop any two projects from the given projects list in your own interested programming languages.',
            'You can also submit your projects before 15 June.',
            'You can join the Micro IT by post internship opportunities after completion of this internship.',
          ],
          style: 'body',
          margin: [0, 0, 0, 20], // Adjusted margin
        },

        // Closing
        { text: 'Looking forward to working with you!', style: 'body', margin: [0, 10, 0, 20] },

        // Sign-off
        { text: 'With Best Wishes,', style: 'body' },
        { text: 'Mr. Vijay Kumar', style: 'body' },
        { text: 'Founder, Micro IT', style: 'body' },
        // Placeholder for Signature Image (You would uncomment and provide the path if you have the image)
        // { image: path.join(__dirname, 'path/to/signature.png'), width: 100, margin: [0, 10, 0, 10] },

      ],
      styles: {
        companyName: {
          fontSize: 18,
          bold: true,
        },
        offerTitle: {
          fontSize: 16,
          bold: true,
          decoration: 'underline',
          color: '#1a2b4d', // Dark blue color from the image
        },
        candidateName: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 5],
        },
        candidateDetails: {
          fontSize: 12,
          margin: [0, 0, 0, 3],
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        body: {
          fontSize: 12,
          margin: [0, 0, 0, 5],
        },
      },
      // Footer - Using a single image for the footer and spanning full width
      footer: (currentPage, pageCount) => {
        return {
          image: path.join(__dirname, 'microit-footer.png'), // Path to the full footer image
          width: 612, // Set the width to match the full LETTER page width (612 points)
          alignment: 'center',
          margin: [0, 0, 0, 0], // Remove any explicit margin from the image in the footer
        };
      },
      // Page margins
      pageMargins: [40, 40, 40, 60], // Left, Top, Right, Bottom
    };

    const pdfDoc = printer.createPdfKitDocument(documentDefinition);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="OfferLetter_${candidateName}.pdf"`);

    pdfDoc.pipe(res);
    pdfDoc.end();

  } catch (error) {
    console.error('Error generating offer letter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate offer letter',
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 