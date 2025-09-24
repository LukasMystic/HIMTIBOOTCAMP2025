const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Import the serverless-safe database connection utility
const dbConnect = require('./lib/dbConnect'); 

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE & CONFIG SETUP ---
app.use(cors());
app.use(express.json());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'himti-ai-bootcamp',
        format: async (req, file) => 'png',
        public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            // Reject the file but don't throw an error here, let the route handler deal with it
            cb(null, false);
        }
    }
});

// --- DATABASE SCHEMAS & MODELS ---
const participantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nim: { type: Number, required: true, unique: true },
    binusianEmail: { type: String, required: true, unique: true },
    privateEmail: { type: String, required: true},
    phone: { type: String, required: true },
    major: { type: String, required: true },
    imageUrl: { type: String },
    registrationDate: { type: Date, default: Date.now },
});

const settingSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true }
});

// To prevent OverwriteModelError on Vercel's hot reloads
const Participant = mongoose.models.Participant || mongoose.model('Participant', participantSchema);
const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);


// --- HELPER & AUTH FUNCTIONS ---
const getAdminUsers = () => {
    const credentials = process.env.ADMIN_CREDENTIALS || '{}';
    try {
        const adminObject = JSON.parse(credentials);
        return Object.entries(adminObject).map(([email, password]) => ({ email, password }));
    } catch (error) {
        console.error("CRITICAL: Error parsing ADMIN_CREDENTIALS JSON from .env file.", error);
        return [];
    }
};

const adminAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: 'Unauthorized: No token provided.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden: Token is not valid.' });
        req.user = user;
        next();
    });
};

// --- API ROUTES ---
app.get('/', (req, res) => {
    res.send('HIMTI AI Bootcamp API is running!');
});

app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    const adminUsers = getAdminUsers();
    const user = adminUsers.find(u => u.email === email);
    if (!user || password !== user.password) {
        return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken: accessToken });
});

app.post('/api/register', upload.single('image'), async (req, res, next) => {
    try {
        await dbConnect(); // Ensure DB connection
        const registrationSetting = await Setting.findOne({ key: 'registrationStatus' });
        if (!registrationSetting || !registrationSetting.value) {
            if (!registrationSetting) {
                await new Setting({ key: 'registrationStatus', value: false }).save();
            }
            return res.status(403).json({ message: 'Registration is currently closed.' });
        }

        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'Image upload is required. Only .png, .jpg, .jpeg formats are allowed.' });
        }

        const { fullName, nim, binusianEmail, privateEmail, phone, major } = req.body;
        const newParticipant = new Participant({
            name: fullName, nim: Number(nim), binusianEmail, privateEmail, phone, major,
            imageUrl: req.file.path
        });
        const savedParticipant = await newParticipant.save();
        res.status(201).json({ message: 'Registration successful!', participant: savedParticipant });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ message: `Error: This ${field} is already registered.` });
        }
        // Pass other errors to the final error handler
        next(error);
    }
});

app.get('/api/settings/registration', async (req, res, next) => {
  try {
    await dbConnect(); // Ensure DB connection
    const setting = await Setting.findOne({ key: 'registrationStatus' });
    res.status(200).json({ isOpen: setting ? setting.value : false });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/participants', adminAuth, async (req, res, next) => {
  try {
    await dbConnect(); // Ensure DB connection
    const participants = await Participant.find({}).sort({ registrationDate: -1 });
    res.status(200).json(participants);
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/participants', adminAuth, upload.single('image'), async (req, res, next) => {
    try {
        await dbConnect(); // Ensure DB connection

        if (!req.file) {
             return res.status(400).json({ message: 'Image upload is required.' });
        }

        const { name, nim, binusianEmail, privateEmail, phone, major } = req.body;
        const newParticipant = new Participant({
            name, nim: Number(nim), binusianEmail, privateEmail, phone, major,
            imageUrl: req.file.path
        });
        const savedParticipant = await newParticipant.save();
        res.status(201).json({ message: 'Participant created successfully!', participant: savedParticipant });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ message: `Error: This ${field} is already registered.` });
        }
        next(error);
    }
});

app.post('/api/admin/settings/toggle-registration', adminAuth, async (req, res, next) => {
    try {
        await dbConnect(); // Ensure DB connection
        let setting = await Setting.findOne({ key: 'registrationStatus' });
        if (!setting) {
            setting = await new Setting({ key: 'registrationStatus', value: true }).save();
        } else {
            setting.value = !setting.value;
            await setting.save();
        }
        res.status(200).json({
            message: `Registration is now ${setting.value ? 'OPEN' : 'CLOSED'}.`,
            isOpen: setting.value
        });
    } catch (error) {
        next(error);
    }
});

app.put('/api/admin/participants/:id', adminAuth, upload.single('image'), async (req, res, next) => {
    try {
        await dbConnect(); // Ensure DB connection
        const updateData = { ...req.body };
        if (req.file) {
            updateData.imageUrl = req.file.path;
        }
        // CORRECTED THIS LINE: Removed extra dot from req.params..id
        const updatedParticipant = await Participant.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedParticipant) return res.status(404).json({ message: 'Participant not found.' });
        res.status(200).json({ message: 'Participant updated successfully.', participant: updatedParticipant });
    } catch (error) {
        next(error);
    }
});

app.delete('/api/admin/participants/:id', adminAuth, async (req, res, next) => {
    try {
        await dbConnect(); // Ensure DB connection
        const deletedParticipant = await Participant.findByIdAndDelete(req.params.id);
        if (!deletedParticipant) return res.status(404).json({ message: 'Participant not found.' });
        res.status(200).json({ message: 'Participant deleted successfully.' });
    } catch (error) {
        next(error);
    }
});

app.get('/api/admin/participants/export', adminAuth, async (req, res, next) => {
    try {
        await dbConnect(); // Ensure DB connection
        const participants = await Participant.find({});
        if (participants.length === 0) return res.status(404).send('No participants to export.');
        
        const fields = ['_id', 'name', 'nim', 'binusianEmail', 'privateEmail', 'phone', 'major', 'imageUrl', 'registrationDate'];
        let csv = fields.join(',') + '\n';
        participants.forEach(p => {
            const row = fields.map(field => `"${p[field] ? p[field].toString().replace(/"/g, '""') : ''}"`).join(',');
            csv += row + '\n';
        });
        res.header('Content-Type', 'text/csv');
        res.attachment('registrations.csv');
        res.send(csv);
    } catch (error) {
        next(error);
    }
});

// --- FINAL ERROR HANDLER (REWRITTEN) ---
app.use((err, req, res, next) => {
  // Log the actual error to the console
  console.error("An error occurred:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `File upload error: ${err.message}` });
  } 
  
  // Specific error for wrong file type from our filter logic
  if (err.message === 'Only .png, .jpg, .jpeg format allowed!') {
      return res.status(400).json({ message: err.message });
  }

  // Handle other potential errors gracefully
  if (res.headersSent) {
    return next(err);
  }

  // Generic fallback
  return res.status(500).json({ message: 'An unexpected error occurred on the server.' });
});


// --- SERVER START ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export the app for Vercel's serverless environment
module.exports = app;

