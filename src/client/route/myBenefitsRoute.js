import {
    handleGetMyBenefits,
    postMyBenefitsController
} from '../controller/myBenefitsController.js';

import { Router } from 'express';
import { requireAuth, requireOwnership } from '../../middlewares/authJWT.js';

const r = Router();

// Obtener beneficios de un usuario - requiere autenticación y que sea el mismo usuario
r.get('/my-benefits/:idUser', requireAuth, requireOwnership, handleGetMyBenefits);

// Canjear un beneficio - requiere autenticación
r.post('/my-benefits', requireAuth, postMyBenefitsController);

export default r;