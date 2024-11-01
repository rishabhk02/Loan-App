import React, { useEffect, useState } from 'react';
import { Form, Button, Modal, Spin, Table, InputNumber } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import { showSuccessMessage, showErrorMessage, formateDate } from '../../globalFunction';
import { useDispatch, useSelector } from 'react-redux';
import Instance from '../../AxiosConfig';
import { useNavigate } from 'react-router-dom';
import { setLoans, addNewLoan, payInstallment } from '../../features/loanSlice';
import { Menu, UserCircle, FileText, ChevronDown, ChevronRight, LogOutIcon } from 'lucide-react';

const UserDashboard = () => {
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [activeMenu, setActiveMenu] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const loans = useSelector((state) => state.loan.loans);
    const [installmentToPay, setInstallmentToPay] = useState(null);
    const [installmentAmount, setInstallmentAmount] = useState(null);
    const [showInstallmentModal, setShowInstallmentModal] = useState(false);
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const loanRequests = loans?.filter((loan) => loan.status !== 'APPROVED');
    const approvedLoans = loans?.filter((loan) => loan.status === 'APPROVED');
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const handleExpand = (record) => {
        const isExpanded = expandedRowKeys.includes(record._id);
        setExpandedRowKeys(isExpanded ? [] : [record._id]);
    };

    const fetchLoanDetails = async () => {
        try {
            setIsLoading(true);
            const response = await Instance.get(`/loan/get-loans-by-user/${loggedInUser._id}`, {
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`
                }
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
    }

    useEffect(() => {
        fetchLoanDetails();
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
    };

    const loanRequestColumns = [
        {
            title: 'ID',
            render: (text, record, index) => (
                <div>{index + 1}</div>
            )
        },
        {
            title: 'Amount',
            render: (text, record) => (
                <div>{record?.amount}</div>
            )
        },
        {
            title: 'Status',
            render: (text, record) => (
                <div style={{ fontSize: '16px' }}>
                    {record?.status === 'PENDING' && <span className="badge bg-warning">Pending</span>}
                    {record?.status === 'APPROVED' && <span className="badge bg-success">Approved</span>}
                    {record?.status === 'REJECTED' && <span className="badge bg-danger">Rejected</span>}
                </div>
            )
        },
        {
            title: 'Request Date',
            render: (text, record) => (
                <div>{formateDate(record.createdAt)}</div>
            )
        }
    ];

    const activeLoanColumns = [
        {
            title: 'ID',
            render: (text, record, index) => (
                <div>{index + 1}</div>
            )
        },
        {
            title: 'Amount',
            render: (text, record) => (
                <div>{record?.amount}</div>
            )
        },
        {
            title: 'Approved Date',
            render: (text, record) => (
                <div>{formateDate(record.updatedAt)}</div>
            )
        },
        {
            title: 'Status',
            render: (text, record) => (
                <div style={{ fontSize: '16px' }}>
                    {record?.status === 'APPROVED' && <span className="badge bg-success">Approved</span>}
                    {record?.status === 'REJECTED' && <span className="badge bg-danger">Rejected</span>}
                </div>
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
        },
        {
            title: 'Action',
            render: (text, record) => (
                <Button className="btn btn-primary btn-sm" variant='light' onClick={() => handleExpand(record)}>View Installment</Button>
            )
        }
    ];

    const installmentColumns = [
        {
            title: 'Installment Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (dueDate) => <div>{formateDate(dueDate)}</div>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span className={status === 'PAID' ? 'badge bg-success' : 'badge bg-warning'} style={{ fontSize: '13px' }}>
                    {status === 'PAID' ? 'Paid' : 'Pending'}
                </span>
            ),
        },
        {
            title: 'Action',
            render: (text, record) => (
                <Button
                    type="primary"
                    disabled={record.status === 'PAID'}
                    onClick={() => {
                        setShowInstallmentModal(true);
                        setInstallmentToPay(record);
                    }}
                >
                    Pay
                </Button>
            ),
        },
    ];

    const expandedRowRender = (record) => (
        <Table
            columns={installmentColumns}
            dataSource={record.installments}
            pagination={false}
            rowKey={(record) => record._id}
        />
    );

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

    const handleApplyLoan = async () => {
        try {
            setIsLoading(true);
            let reqData = { ...formData, userId: loggedInUser._id };
            const response = await Instance.post('/loan/apply-loan', reqData, {
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`
                }
            });
            if (response.status === 201) {
                showSuccessMessage('Loan applied successfully');
                dispatch(addNewLoan(response?.data?.loan));
                handleModalClose();
            }
        } catch (error) {
            console.error(error);
            showErrorMessage('Failed to apply for loan');
        } finally {
            setIsLoading(false);
        }
    }

    const handlePayInstallment = async () => {
        try {
            if (installmentToPay?.amount > installmentAmount) {
                showErrorMessage('Insufficient amount to pay');
                return;
            }
            const response = await Instance.put('/loan/pay-installment', {
                loanId: expandedRowKeys[0],
                installmentId: installmentToPay._id
            }, {
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`
                }
            });
            if (response.status === 200) {
                dispatch(payInstallment({ loanId: expandedRowKeys[0], installmentId: installmentToPay._id }));
                showSuccessMessage(response?.data?.message);
                handleInstallmentModalClose();
            }
        } catch (error) {
            console.error(error);
            showErrorMessage(error?.response?.data?.message || 'Something went wrong');
        }
    }

    const handleModalClose = () => {
        setShowModal(false);
        form.resetFields();
        setFormData({});
    }

    const handleInstallmentModalClose = () => {
        setShowInstallmentModal(false);
        form2.resetFields();
        setInstallmentToPay(null);
        setInstallmentAmount(null);
    }

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
                        {isSidebarOpen && <h1 className="h4">{`${loggedInUser?.firstName} ${loggedInUser?.lastName}`}</h1>}
                        <Button onClick={toggleSidebar} className="btn btn-dark btn-sm" variant='light'>
                            <Menu size={24} />
                        </Button>
                    </div>

                    <nav className="mt-4">
                        <div className="p-2">
                            <div
                                className="d-flex align-items-center p-2 text-white bg-secondary rounded mb-2 cursor-pointer"
                                onClick={() => handleMenuClick('activeLoans')}
                                style={{ cursor: 'pointer' }}
                            >
                                <UserCircle size={24} />
                                {isSidebarOpen && (
                                    <>
                                        <span className="ms-2">Active Loans</span>
                                        {activeMenu === 'activeLoans' ? <ChevronDown className="ms-auto" /> : <ChevronRight className="ms-auto" />}
                                    </>
                                )}
                            </div>
                            <div
                                className="d-flex align-items-center p-2 text-white bg-secondary rounded cursor-pointer mb-2"
                                onClick={() => handleMenuClick('loanRequests')}
                                style={{ cursor: 'pointer' }}
                            >
                                <FileText size={24} />
                                {isSidebarOpen && (
                                    <>
                                        <span className="ms-2">Loans Requests</span>
                                        {activeMenu === 'loanRequests' ? <ChevronDown className="ms-auto" /> : <ChevronRight className="ms-auto" />}
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
                                <LogOutIcon size={24}/>
                                {isSidebarOpen && (
                                    <>
                                        <span className="ms-2">Logout</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-fill p-4">
                    <header className="bg-white shadow-sm p-3 mb-4 rounded d-flex align-items-center justify-content-between">
                        <h2>{activeMenu === 'loanRequests' ? 'My Loan Requests' : activeMenu === 'activeLoans' ? 'Active Loans' : 'Dashboard'}</h2>
                        <Button variant="primary" className="mb-3 ml-auto btn-primary bg-primary text-white" onClick={() => setShowModal(true)}>Apply For Loan</Button>
                    </header>

                    <main>
                        {activeMenu === 'loanRequests' && (
                            <div>
                                <Table dataSource={loanRequests} columns={loanRequestColumns} rowKey="id" pagination={false} />
                            </div>
                        )}

                        {activeMenu === 'activeLoans' && (
                            <div>
                                <Table
                                    dataSource={approvedLoans}
                                    columns={activeLoanColumns}
                                    rowKey={(record) => record._id}
                                    expandable={{
                                        expandedRowRender,
                                        expandIcon: () => null,
                                        expandedRowKeys: expandedRowKeys,
                                        onExpand: (expanded, record) => handleExpand(record),
                                    }}
                                />
                            </div>
                        )}
                    </main>
                </div>
            </div>
            <Modal
                title="Apply for Loan"
                open={showModal}
                onCancel={handleModalClose}
                footer={null}
                centered
            >
                <Form
                    layout="vertical"
                    onFinish={handleApplyLoan}
                >
                    <Form.Item
                        name="amount"
                        label="Loan Amount"
                        rules={[{ required: true, message: 'Please enter loan amount' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="Enter loan amount"
                            value={formData?.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e })}
                        />
                    </Form.Item>

                    <Form.Item
                        name="term"
                        label="Term"
                        rules={[{ required: true, message: 'Please enter loan term' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={1}
                            placeholder="Enter term in months"
                            value={formData?.term}
                            onChange={(e) => setFormData({ ...formData, term: e })}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Apply
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Pay Installment"
                open={showInstallmentModal}
                onCancel={handleInstallmentModalClose}
                footer={null}
                centered
            >
                <Form
                    layout="vertical"
                    form={form2}
                    onFinish={handlePayInstallment}
                >
                    <Form.Item
                        name="installmentAmount"
                        label="Installment Amount"
                        rules={[{ required: true, message: 'Please enter installment amount' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="Enter installment amount"
                            value={installmentAmount}
                            onChange={(e) => setInstallmentAmount(e)}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Pay
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserDashboard;
