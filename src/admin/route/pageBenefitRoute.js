import Router from 'express';
import {
    getBenefitsController,
    createBenefitController,
    updateBenefitController,
    deleteBenefitController
} from '../controller/pageBenefitsController.js';
import { requireAdmin } from '../../middlewares/authJWT.js';

const r = Router();

r.get('/admin/benefits', getBenefitsController);
r.post('/admin/benefits', requireAdmin, createBenefitController);
r.put('/admin/benefits/:id', requireAdmin, updateBenefitController);
r.delete('/admin/benefits/:id', requireAdmin, deleteBenefitController);

export default r;