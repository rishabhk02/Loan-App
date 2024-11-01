const express = require('express');
const router = express.Router();
const LoanController = require('../Controllers/loanController');
const { authMiddleware, adminMiddleware } = require('../Middlewares/authMiddlewares');

router.post('/apply-loan', authMiddleware, LoanController.createLoan);

router.put('/change-loan-status', authMiddleware, adminMiddleware, LoanController.changeLoanStatus);

router.get('/get-all-loans', authMiddleware, adminMiddleware, LoanController.getAllLoans);

router.get('/get-loans-by-user/:userId', authMiddleware, LoanController.getLoansByUser);

router.get('/get-loan-by-id/:loanId', authMiddleware, LoanController.getLoanById);

router.put('/pay-installment', authMiddleware, LoanController.payInstallment);

module.exports = router;