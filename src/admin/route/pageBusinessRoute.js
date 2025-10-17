import Router from 'express';
import {
    getBusinessController,
    createBusinessController,
    updateBusinessController,
    deleteBusinessController
    } from '../controller/pageBusinessController.js';
import { requireAdmin } from '../../middlewares/authJWT.js';

const r = Router();

r.get('/admin/business', requireAdmin, getBusinessController);
r.post('/admin/business', requireAdmin, createBusinessController);
r.patch('/admin/business/:id', requireAdmin, updateBusinessController);
r.delete('/admin/business/:id', requireAdmin, deleteBusinessController);

export default r;