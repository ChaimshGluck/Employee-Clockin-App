import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import hrRoutes from './routes/hr.js';
import employeeRoutes from './routes/employee.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true, 
}));


app.use('/hr', hrRoutes);
app.use('/employee', employeeRoutes);

app.listen(port, () => {
    console.log(`server is running on port ${port}...`);
})
