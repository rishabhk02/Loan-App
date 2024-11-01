import React, { useEffect, useState } from 'react';
import { Table, Spin, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setLoans, approveDenyLoan } from '../../features/loanSlice';
import Instance from '../../AxiosConfig';
import { showErrorMessage, showSuccessMessage } from '../../globalFunction';
import { Menu, UserCircle, FileText, ChevronDown, ChevronRight, LogOutIcon, CheckCheckIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [activeMenu, setActiveMenu] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const loans = useSelector((state) => state.loan.loans);
    const loansRequests = loans?.filter((loan) => loan.status !== 'APPROVED');
    const approvedLoans = loans?.filter((loan) => loan.status === 'APPROVED');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await Instance.get('/auth/getAllUsers', {
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`,
                },
            });
            if (response.status === 200) {
                setUsers(response?.data?.users);
            }
        } catch (error) {
            console.error(error);
            showErrorMessage(error?.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllLoans = async () => {
        try {
            setIsLoading(true);
            const response = await Instance.get('/loan/get-all-loans', {
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`,
                },
            });
            if (response.status === 200) {
                dispatch(setLoans(response?.data?.loans));
            }
        } catch (error) {
            console.error(error);
            showErrorMessage(error?.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchAllLoans();
    }, []);

    const userColumn = [{
        title: 'ID',
        render: (text, record, index) => (
            <div>{index + 1}</div>
        ),
    }, {
        title: 'First Name',
        render: (text, record) => (
            <div>{record?.firstName}</div>
        )
    }, {
        title: 'Last Name',
        render: (text, record) => (
            <div>{record?.lastName}</div>
        )
    }, {
        title: 'Email',
        render: (text, record) => (
            <div>{record?.email}</div>
        )
    }, {
        title: 'Mobile Number',
        render: (text, record) => (
            <div>{record?.mobileNumber}</div>
        )
    }, {
        title: 'Status',
        render: (text, record) => (
            <div style={{ fontSize: '14px' }} className={`badge ${record?.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>{record?.status === 'ACTIVE' ? 'Active' : 'Inactive'}</div>
        )
    }];

    const loanRequestColumn = [{
        title: 'ID',
        render: (text, record, index) => (
            <div>{index + 1}</div>
        ),
    }, {
        title: 'User',
        render: (text, record) => (
            <div>{`${record?.userId?.firstName} ${record?.userId?.lastName}`}</div>
        )
    }, {
        title: 'Amount',
        render: (text, record) => (
            <div>{record?.amount}</div>
        )
    }, {
        title: 'Term',
        render: (text, record) => (
            <div>{record?.term}</div>
        )
    }, {
        title: 'Action',
        render: (text, record) => (
            <div className="d-flex gap-2">
                <Button className="btn btn-sm btn-success" onClick={() => changeLoanStatus(record?._id, 'APPROVED')}>Approve</Button>
                <Button className="btn btn-sm btn-danger" onClick={() => changeLoanStatus(record?._id, 'REJECTED')}>Reject</Button>
            </div>
        )
    }];

    const approvedLoanColumn = [{
        title: 'ID',
        render: (text, record, index) => (
            <div>{index + 1}</div>
        ),
    }, {
        title: 'User',
        render: (text, record) => (
            <div>{`${record?.userId?.firstName} ${record?.userId?.lastName}`}</div>
        )
    }, {
        title: 'Amount',
        render: (text, record) => (
            <div>{record?.amount}</div>
        )
    }, {
        title: 'Status',
        render: (text, record) => (
            <div className={`badge ${record?.status === 'APPROVED' ? 'bg-success' : 'bg-danger'}`}>{record?.status}</div>
        )
    },
    {
        title: 'Due Installment',
        render: (text, record) => (
            <div>{getDueInstallment(record)}</div>
        )
    },
    {
        title: 'Paid Installments',
        render: (text, record) => (
            <div>{getPaidInstallment(record)}</div>
        )
    }];

    const getDueInstallment = (loan) => {
        let cnt = 0;
        loan?.installments?.forEach((installment) => {
            if (installment?.status === 'PENDING') {
                cnt++;
            }
        })
        return cnt;
    };

    const getPaidInstallment = (loan) => {
        let cnt = 0;
        loan?.installments?.forEach((installment) => {
            if (installment?.status === 'PAID') {
                cnt++;
            }
        })
        return cnt;
    };

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
    };

    const changeLoanStatus = async (loanId, status) => {
        try {
            setIsLoading(true);
            const response = await Instance.put(`/loan/change-loan-status/`, { loanId, status },{
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`,
                },
            });
            if (response.status === 200) {
                dispatch(approveDenyLoan({ loanId, status }));
                showSuccessMessage('Loan status changed successfully');
            }
        } catch (error) {
            console.error(error);
            showErrorMessage('Failed to change loan status');
        } finally{
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                }}>
                    <Spin size="large" />
                </div>
            )}
            <div className="d-flex vh-100 bg-light">
                <div className={`bg-dark text-white ${isSidebarOpen ? 'col-2' : 'col-1'} transition-all`}>
                    <div className="p-3 d-flex align-items-center justify-content-between">
                        {isSidebarOpen && <h1 className="h4">Admin Panel</h1>}
                        <button onClick={toggleSidebar} className="btn btn-dark btn-sm">
                            <Menu size={24} />
                        </button>
                    </div>

                    <nav className="mt-4">
                        <div className="p-2">
                            <div
                                className="d-flex align-items-center p-2 text-white bg-secondary rounded mb-2 cursor-pointer"
                                onClick={() => handleMenuClick('users')}
                                style={{ cursor: 'pointer' }}
                            >
                                <UserCircle size={24} />
                                {isSidebarOpen && (
                                    <>
                                        <span className="ms-2">Users</span>
                                        {activeMenu === 'users' ? <ChevronDown className="ms-auto" /> : <ChevronRight className="ms-auto" />}
                                    </>
                                )}
                            </div>

                            <div
                                className="d-flex align-items-center p-2 text-white bg-secondary rounded cursor-pointer mb-2"
                                onClick={() => handleMenuClick('loansRequests')}
                                style={{ cursor: 'pointer' }}
                            >
                                <FileText size={24} />
                                {isSidebarOpen && (
                                    <>
                                        <span className="ms-2">Loans Requests</span>
                                        {activeMenu === 'loans' ? <ChevronDown className="ms-auto" /> : <ChevronRight className="ms-auto" />}
                                    </>
                                )}
                            </div>

                            <div
                                className="d-flex align-items-center p-2 text-white bg-secondary rounded cursor-pointer mb-2"
                                onClick={() => handleMenuClick('approvedLoans')}
                                style={{ cursor: 'pointer' }}
                            >
                                <CheckCheckIcon size={24} />
                                {isSidebarOpen && (
                                    <>
                                        <span className="ms-2">Approved Loans</span>
                                        {activeMenu === 'loans' ? <ChevronDown className="ms-auto" /> : <ChevronRight className="ms-auto" />}
                                    </>
                                )}
                            </div>

                            <div
                                className="d-flex align-items-center p-2 text-white bg-secondary rounded cursor-pointer"
                                onClick={() => {
                                    localStorage.removeItem('loggedInUser');
                                    navigate('/');
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <LogOutIcon size={24} />
                                {isSidebarOpen && (
                                    <>
                                        <span className="ms-2">Logout</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </nav>
                </div>

                <div className="flex-grow-1 overflow-hidden">
                    <header className="bg-white shadow p-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h2 className="h5">
                                {activeMenu ? activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1) : 'Dashboard'}
                            </h2>
                            <div className="d-flex align-items-center">
                                <span className="text-muted me-3">{`${loggedInUser.firstName} ${loggedInUser.lastName}`}</span>
                                <UserCircle size={32} className="text-muted" />
                            </div>
                        </div>
                    </header>

                    <main className="p-4 overflow-auto" style={{ height: 'calc(100vh - 80px)' }}>
                        {activeMenu === 'users' && (
                            <div className="table-responsive bg-white rounded shadow p-3">
                                <Table
                                    className='table table-hover'
                                    dataSource={users}
                                    columns={userColumn}
                                    rowKey={(record) => record._id}
                                    pagination={false}
                                    loading={isLoading}
                                />
                            </div>
                        )}

                        {activeMenu === 'loansRequests' && (
                            <div className="table-responsive bg-white rounded shadow p-3">
                                <Table
                                    className='table table-hover'
                                    dataSource={loansRequests}
                                    columns={loanRequestColumn}
                                    rowKey={(record) => record._id}
                                    pagination={false}
                                    loading={isLoading}
                                />
                            </div>
                        )}

                        {activeMenu === 'approvedLoans' && (
                            <div className="table-responsive bg-white rounded shadow p-3">
                                <Table
                                    className='table table-hover'
                                    dataSource={approvedLoans}
                                    columns={approvedLoanColumn}
                                    rowKey={(record) => record._id}
                                    pagination={false}
                                    loading={isLoading}
                                />
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
