import express from 'express';
import 'dotenv/config';
import hrRoutes from './routes/hr.js';
import employeeRoutes from './routes/employee.js';

const app = express();
app.use(express.json());

const port = process.env.PORT;

app.use('/hr', hrRoutes);
app.use('/employee', employeeRoutes);

app.listen(port, () => {
    console.log(`server is running on port ${port}...`);
})
