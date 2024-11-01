import { createSlice } from "@reduxjs/toolkit";

const loanSlice = createSlice({
    name: "loan",
    initialState: {
        loans: [],
    },
    reducers: {
        setLoans: (state, action) => {
            state.loans = action.payload;
        },
        addNewLoan: (state, action) => {
            state.loans.push(action.payload);
        },
        payInstallment: (state, action) => {
            let idx = state.loans.findIndex((loan) => loan._id === action.payload.loanId);
            if (idx !== -1) {
                let idx2 = state.loans[idx]?.installments?.findIndex((installment) => installment._id === action.payload.installmentId);
                if (idx2 !== -1) {
                    state.loans[idx].installments[idx2].status = "PAID";
                }
            }
        },
        approveDenyLoan: (state, action) => {
            let idx = state.loans.findIndex((loan) => loan._id === action.payload.loanId);
            if (idx !== -1) {
                state.loans[idx].status = action.payload.status;
            }
        }
    },
});

export const { setLoans, addNewLoan, payInstallment, approveDenyLoan } = loanSlice.actions;
export default loanSlice.reducer;