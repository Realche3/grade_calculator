const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.static('public'));

// Calculate final grade
app.post('/calculate-grade', (req, res) => {
  const { components } = req.body;

  if (!components || components.length === 0) {
    return res.status(400).json({ error: 'No components provided.' });
  }

  let totalWeight = 0;
  let weightedSum = 0;

  components.forEach(component => {
    const { grade, weight } = component;
    weightedSum += grade * (weight / 100);
    totalWeight += weight;
  });

  if (totalWeight !== 100) {
    return res.status(400).json({ error: 'Total weight must be 100%.' });
  }

  const finalGrade = weightedSum;
  res.json({ finalGrade });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});