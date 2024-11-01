import React, { useState, useEffect } from 'react';
import { Form, Input, Spin } from 'antd';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Login.css';
import Instance from '../../AxiosConfig';
import { useNavigate } from 'react-router-dom';
import { showErrorMessage, showSuccessMessage } from '../../globalFunction';

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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
      navigate('/');
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const handleSubmitForm = async () => {
    try {
      setIsLoading(true);
      const response = await Instance.post('/auth/login', formData);
      if (response.status === 200) {
        showSuccessMessage('Login successful');
        localStorage.setItem('loggedInUser', JSON.stringify(response.data.user));
        if (response.data.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (response.data.user.role === 'USER') {
          navigate('/user/dashboard');
        }
      }
    } catch (error) {
      console.error(error);
      showErrorMessage(error?.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
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
      <section className="vh-100">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid"
                alt="Sample"
              />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <Form form={form} layout="vertical" onFinish={handleSubmitForm}>
                <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email!' }]}>
                  <Input
                    placeholder="Enter your email address"
                    className="form-control form-control-lg"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Form.Item>

                <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password!' }]}>
                  <div className="password-container">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-control form-control-lg"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <span
                      className="password-toggle-icon"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </span>
                  </div>
                </Form.Item>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="form-check mb-0">
                    <input className="form-check-input me-2" type="checkbox" id="form2Example3" />
                    <label className="form-check-label" htmlFor="form2Example3">
                      Remember me
                    </label>
                  </div>
                  <Link to="#" className="text-body">
                    Forgot password?
                  </Link>
                </div>

                <div className="text-center text-lg-start mt-4 pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  >
                    Login
                  </button>
                  <p className="small fw-bold mt-2 pt-1 mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="link-danger">
                      Register
                    </Link>
                  </p>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
