const Loan = require("../Models/loanModel");
const User = require("../Models/userModel");

class LoanController {
    async createLoan(req, res) {
        try {
            const { userId, amount, term } = req.body;
            if (!userId || !amount || !term) {
                return res.status(411).json({ message: "All fields are required" });
            }
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const installments = [];
            for (let i = 1; i <= term; i++) {
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + i * 7);
                installments.push({
                    amount: amount / term,
                    dueDate,
                    status: "PENDING"
                });
            }

            const loan = await Loan.create({
                userId,
                amount,
                term,
                status: "PENDING",
                installments
            });
            return res.status(201).json({ message: "Loan created successfully", loan });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async changeLoanStatus(req, res) {
        try {
            const { loanId, status } = req.body;
            if (!loanId || !status) {
                return res.status(411).json({ message: "All fields are required" });
            }
            const loan = await Loan.findById(loanId);
            if (!loan) {
                return res.status(404).json({ message: "Loan not found" });
            }
            loan.status = status;
            await loan.save();
            return res.status(200).json({ message: "Loan status updated successfully" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getAllLoans(req, res) {
        try {
            const loans = await Loan.find().populate("userId");
            return res.status(200).json({ message: "Loans fetched successfully", loans });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getLoansByUser(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(411).json({ message: "All fields are required" });
            }
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const loans = await Loan.find({ userId });
            return res.status(200).json({ message: "Loans fetched successfully", loans });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getLoanById(req, res) {
        try {
            const { loanId } = req.params;
            if (!loanId) {
                return res.status(411).json({ message: "All fields are required" });
            }
            const loan = await Loan.findById(loanId);
            if (!loan) {
                return res.status(404).json({ message: "Loan not found" });
            }
            return res.status(200).json({ message: "Loan fetched successfully", loan });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async payInstallment(req, res) {
        try {
            const { loanId, installmentId } = req.body;
            if (!loanId || !installmentId) {
                return res.status(411).json({ message: "All fields are required" });
            }
            const loan = await Loan.findById(loanId);
            if (!loan) {
                return res.status(404).json({ message: "Loan not found" });
            }
            const installment = loan.installments.find(installment => installment._id.toString() === installmentId);
            if (!installment) {
                return res.status(404).json({ message: "Installment not found" });
            }
            installment.status = "PAID";
            await loan.save();
            return res.status(200).json({ message: "Installment paid successfully" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }  
    }
}

module.exports = new LoanController();