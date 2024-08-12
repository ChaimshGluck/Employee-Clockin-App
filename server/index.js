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

/*
1. hr registers a new employee - post /hr/register
2. hr updates employee info - patch /hr/employee:id
3. hr deletes employee from system - delete /hr/employee:id
4. hr views all employees records - get /hr/employees

5. employee logs into their account - get /employee/login
6. employee clocks in - post /employee/clockin
7. employee clocks out - patch /employee/clockout
8. employee views their records - get /employee/records
*/
