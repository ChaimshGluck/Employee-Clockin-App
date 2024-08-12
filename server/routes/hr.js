import express from 'express';
import db from '../db.js'
const router = express.Router();
export default router;

router.get('/', (req, res) => {
    res.json("Hello World!");
})

router.post('/register', (req, res) => {
    db.one(`insert into public.employees (first_name) values ('Chaim')`)
})

router.patch('/employee:id', (req, res) => {

})

router.delete('/employee:id', (req, res) => {

})

router.get('/employees', (req, res) => {

})