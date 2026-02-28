const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Import routes (make sure these files exist in backend/routes/)
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Use routes
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/reviews', reviewRoutes);
app.use('/feedback', feedbackRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});