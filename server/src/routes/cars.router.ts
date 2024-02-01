import express, { Request, Response } from 'express';


const router = express.Router();

router.get('/', (req, res) => res.send('get cars'));

router.get('/:id', (req, res) => res.send('get current car'));

router.post('/', (req, res) => res.send('create car'));

router.patch('/:id', (req, res) => res.send('update car'));

router.delete('/:id', (req, res) => res.send('delete car'));

export default router;