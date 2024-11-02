const express = require('express');
const {signupCompany, loginCompany, getCompany, createVacancy, putCompany} = require('../controllers/companyController');

const router = express.Router();

router.post('/signup', signupCompany);
router.post('/login', loginCompany);
router.post('/vacancy', createVacancy);
router.get('/companies', getCompany);
router.put('/putCompany', putCompany);
router.get('/companies/:companyId', getCompany);

module.exports = router;
