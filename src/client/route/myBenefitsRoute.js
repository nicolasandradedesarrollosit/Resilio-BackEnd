import {
    handleGetMyBenefits
} from '../controller/myBenefitsController.js';

import { Router } from 'express';

const r = Router();

r.get('my-benefits/:idUser', handleGetMyBenefits);

export default r;