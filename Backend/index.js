require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');
const loanRoutes = require('./Routes/loanRoutes');

app.use(cors());
app.use(express.json());

async function connectDb(){
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error);
    }
}

connectDb();

app.use('/auth', authRoutes);
app.use('/loan', loanRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});





