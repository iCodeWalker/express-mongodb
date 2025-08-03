import express from 'express';
import {
  getOverview,
  getTour,
  getLoginForm,
} from '../controllers/viewController.js';

const router = express.Router();

router.get('/', getOverview);

router.get('/tour/:slug', getTour);

router.get('/login', getLoginForm);

export default router;
