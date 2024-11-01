import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import './Signup.css';
import SignUpImg from '../../assets/images/signup.jpg';
import Instance from '../../AxiosConfig';
import { showErrorMessage, showSuccessMessage } from '../../globalFunction';

const SignupPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));


    const checkToken = async () => {
        try {
            const response = await Instance.get('/auth/validateToken', {
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`
                }
            });
            if (response?.data?.role === 'USER') {
                navigate('/user/dashboard');
            } else if (response?.data?.role === 'ADMIN') {
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        checkToken();
    }, []);

    const handleSubmitForm = async () => {
        try {
            if (formData.password !== formData.confirmPassword) {
                showErrorMessage('Passwords do not match');
                return;
            }
            setIsLoading(true);
            const response = await Instance.post('/auth/signup', formData);
            if (response.status === 201) {
                showSuccessMessage('Registration successful');
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            showErrorMessage(error?.response?.data?.message || 'Registration failed');
        } finally {
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
            <section className="vh-100">
                <div className="container-fluid h-custom">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-9 col-lg-6 col-xl-5">
                            <img
                                src={SignUpImg}
                                className="img-fluid"
                                alt="Sample"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </div>
                        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                            <h2 className="fw-bold mb-2 text-uppercase">Sign Up</h2>
                            <Form form={form} layout="vertical" onFinish={handleSubmitForm}>
                                <Form.Item name="firstName" rules={[{ required: true, message: 'Please enter your first name!' }]}>
                                    <Input
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </Form.Item>

                                <Form.Item name="lastName" rules={[{ required: true, message: 'Please enter your last name!' }]}>
                                    <Input
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </Form.Item>

                                <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email!' }]}>
                                    <Input
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </Form.Item>

                                <Form.Item name="mobileNumber" rules={[{ required: true, message: 'Please enter your mobile number!' }]}>
                                    <div>
                                        <PhoneInput
                                            defaultCountry="in"
                                            value={formData.mobileNumber}
                                            inputStyle={{ width: '100%' }}
                                            onChange={(phone) => setFormData({ ...formData, mobileNumber: phone })}
                                        />
                                    </div>
                                </Form.Item>

                                <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password!' }]}>
                                    <div className="password-container">
                                        <Input
                                            placeholder="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <EyeOff /> : <Eye />}
                                        </span>
                                    </div>
                                </Form.Item>

                                <Form.Item name="confirmPassword" rules={[{ required: true, message: 'Please confirm your password!' }]}>
                                    <div className="password-container">
                                        <Input
                                            placeholder="Confirm Password"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        />
                                        <span
                                            className="password-toggle-icon"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff /> : <Eye />}
                                        </span>
                                    </div>
                                </Form.Item>

                                <Button type="submit" htmlType="submit" className="signup-btn">
                                    Sign Up
                                </Button>

                                <p className="small fw-bold mt-2 pt-1 mb-0">
                                    Already have an account? <Link to="/" className="link-primary">Login</Link>
                                </p>
                            </Form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SignupPage;
