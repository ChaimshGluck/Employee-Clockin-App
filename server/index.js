import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import hrRoutes from './routes/hr.js';
import employeeRoutes from './routes/employee.js';

const app = express();
const port = process.env.PORT;
const frontendUrl = process.env.FE_URL;
const frontendDomainUrl = process.env.FE_DOMAIN_URL;

app.use(cors({
    origin: [frontendUrl, frontendDomainUrl],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use('/hr', hrRoutes);
app.use('/employee', employeeRoutes);

app.listen(port, () => {
    console.log(`server is running on port ${port}...`);
})
