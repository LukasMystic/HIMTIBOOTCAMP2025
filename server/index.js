const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg, .jpeg format allowed!'));
        }
    }
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
    initializeSettings();
})
.catch(err => console.error('Error connecting to MongoDB:', err));

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

const Participant = mongoose.model('Participant', participantSchema);
const Setting = mongoose.model('Setting', settingSchema);

const initializeSettings = async () => {
    try {
        const registrationSetting = await Setting.findOne({ key: 'registrationStatus' });
        if (!registrationSetting) {
            await new Setting({ key: 'registrationStatus', value: true }).save();
            console.log('Registration status initialized to "open".');
        }
    } catch (error) {
        console.error('Error initializing settings:', error);
    }
};

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
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials.' });
    }
    if (password === user.password) {
        const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ accessToken: accessToken });
    } else {
        res.status(400).json({ message: 'Invalid credentials.' });
    }
});

app.post('/api/register', upload.single('image'), async (req, res) => {
    try {
        const registrationSetting = await Setting.findOne({ key: 'registrationStatus' });
        if (!registrationSetting || !registrationSetting.value) {
            return res.status(403).json({ message: 'Registration is currently closed.' });
        }

        const { fullName, nim, binusianEmail, privateEmail, phone, major } = req.body;
        if (!fullName || !nim || !binusianEmail || !privateEmail || !phone || !major) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const newParticipant = new Participant({
            name: fullName,
            nim: Number(nim),
            binusianEmail,
            privateEmail,
            phone,
            major,
            imageUrl: req.file ? req.file.path : null
        });
        const savedParticipant = await newParticipant.save();
        res.status(201).json({ message: 'Registration successful!', participant: savedParticipant });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ message: `Error: This ${field} is already registered.` });
        }
        console.error("Registration error:", error);
        res.status(500).json({ message: 'An error occurred during registration.' });
    }
});

app.get('/api/settings/registration', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'registrationStatus' });
    res.status(200).json({ isOpen: setting ? setting.value : false });
  } catch (error) {
    console.error("[ERROR] Failed to fetch registration setting:", error);
    res.status(500).json({ message: 'Error fetching registration status.', error });
  }
});

app.get('/api/admin/participants', adminAuth, async (req, res) => {
  try {
    const participants = await Participant.find({}).sort({ registrationDate: -1 });
    res.status(200).json(participants);
  } catch (error) {
    console.error("[ERROR] Failed to fetch participants:", error);
    res.status(500).json({ message: 'Error fetching participants.', error });
  }
});

app.post('/api/admin/participants', adminAuth, upload.single('image'), async (req, res) => {
    try {
        const { name, nim, binusianEmail, privateEmail, phone, major } = req.body;
        if (!name || !nim || !binusianEmail || !privateEmail || !phone || !major) {
            return res.status(400).json({ message: 'All fields are required for creation.' });
        }
        const newParticipant = new Participant({
            name,
            nim: Number(nim),
            binusianEmail,
            privateEmail,
            phone,
            major,
            imageUrl: req.file ? req.file.path : null
        });
        const savedParticipant = await newParticipant.save();
        res.status(201).json({ message: 'Participant created successfully!', participant: savedParticipant });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ message: `Error: This ${field} is already registered.` });
        }
        console.error("Admin participant creation error:", error);
        res.status(500).json({ message: 'An error occurred during participant creation.' });
    }
});

app.post('/api/admin/settings/toggle-registration', adminAuth, async (req, res) => {
    try {
        const setting = await Setting.findOne({ key: 'registrationStatus' });
        if (!setting) return res.status(404).json({ message: 'Registration status setting not found.' });
        
        setting.value = !setting.value;
        await setting.save();
        
        res.status(200).json({
            message: `Registration is now ${setting.value ? 'OPEN' : 'CLOSED'}.`,
            isOpen: setting.value
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating registration status.', error });
    }
});

app.put('/api/admin/participants/:id', adminAuth, upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.imageUrl = req.file.path;
        }

        const updatedParticipant = await Participant.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedParticipant) return res.status(404).json({ message: 'Participant not found.' });
        res.status(200).json({ message: 'Participant updated successfully.', participant: updatedParticipant });
    } catch (error) {
        res.status(500).json({ message: 'Error updating participant.', error });
    }
});

app.delete('/api/admin/participants/:id', adminAuth, async (req, res) => {
    try {
        const deletedParticipant = await Participant.findByIdAndDelete(req.params.id);
        if (!deletedParticipant) return res.status(404).json({ message: 'Participant not found.' });
        res.status(200).json({ message: 'Participant deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting participant.', error });
    }
});

app.get('/api/admin/participants/export', adminAuth, async (req, res) => {
    try {
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
        res.status(500).json({ message: 'Error exporting data.', error });
    }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    if (err.message === 'Only .png, .jpg, .jpeg format allowed!') {
        return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'An unexpected error occurred on the server.' });
  }
  next();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
