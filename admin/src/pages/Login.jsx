import React, { useContext, useState } from 'react';
import { AtSymbolIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios'
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [state, setState] = useState('Admin');
    const { setAtoken, backendUrl } = useContext(AdminContext)
    const { setDToken } = useContext(DoctorContext)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        let isValid = true;
        const newErrors = { email: '', password: '' };

        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            if (state === 'Admin') {
                const { data } = await axios.post(backendUrl + '/api/admin/login', formData);
                if (data.success) {
                    localStorage.setItem('aToken', data.token);
                    setAtoken(data.token)
                    toast.success('Login Successfully')
                } else {
                    toast.error('Invalid Credentials')
                }

            } else {
                const { data } = await axios.post(backendUrl + '/api/doctor/login', formData)
                if (data.success) {
                    localStorage.setItem('dToken', data.token);
                    setDToken(data.token)
                    toast.success('Doctor Login Successfully')
                    console.log(data.token)
                } else {
                    toast.error('Invalid Credentials')
                }
            }
        } catch (error) {
            console.log(error);
            const errMsg = error.response?.data?.message || error.message;
            toast.error(errMsg);
        }
        console.log('Logging in with:', formData);
    };

    const toggleRole = () => {
        setState((prev) => (prev === 'Admin' ? 'Doctor' : 'Admin'));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg"
            >
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
                    <span className="text-blue-600">{state}</span> Login
                </h2>

                <div className="mb-5">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="you@example.com"
                            className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <AtSymbolIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-2.5 rounded-xl shadow-md transition duration-200"
                >
                    Login
                </button>

                <div className="mt-6 text-center text-sm text-gray-600">
                    {state === 'Admin' ? 'Are you a Doctor?' : 'Are you an Admin?'}{' '}
                    <button
                        type="button"
                        onClick={toggleRole}
                        className="text-blue-600 hover:underline font-medium ml-1"
                    >
                        Click here
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;


