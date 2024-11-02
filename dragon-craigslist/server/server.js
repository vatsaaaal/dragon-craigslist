import express from 'express';
import { Verifier } from 'academic-email-verifier';

const app = express();
const PORT = 3001;

// Middleware to handle CORS for local development
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Route to check if an email is an academic email
app.get('/api/check-academic-email', async (req, res) => {
  const email = req.query.email;

  try {
    // Verify if the email is academic
    const isAcademic = await Verifier.isAcademic(email);

    // Get the institution name if it's an academic email
    let institutionName = null;
    if (isAcademic) {
      institutionName = await Verifier.getInstitutionName(email);
    }

    res.json({ isAcademic, institutionName });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
