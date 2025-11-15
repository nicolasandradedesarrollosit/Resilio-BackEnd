import {
    handleGetMyBenefits,
    postMyBenefitsController
} from '../controller/myBenefitsController.js';

import { Router } from 'express';

const r = Router();

r.get('my-benefits/:idUser', handleGetMyBenefits);
r.post('my-benefits', postMyBenefitsController);

export default r;