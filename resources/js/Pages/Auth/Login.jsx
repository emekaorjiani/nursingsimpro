import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword, message, returnUrl }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
            onSuccess: () => {
                // Redirect to return URL if provided
                if (returnUrl) {
                    window.location.href = returnUrl;
                }
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="bg-white rounded-2xl shadow-2xl p-8">
                {/* Logo */}
                <div className="text-center mb-8 flex items-center justify-center">
                    <ApplicationLogo textColor="text-gray-800" />
                </div>

                {/* Welcome Text */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-600">Sign in to your account to continue</p>
                </div>

                {status && (
                    <div className="mb-6 p-4 text-sm font-medium text-green-600 bg-green-50 rounded-lg">
                        {status}
                    </div>
                )}

                {message && (
                    <div className="mb-6 p-4 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
                        {message}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <InputLabel htmlFor="email" value="Your Email" className="text-gray-700 font-medium" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-2 block w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                            placeholder="Enter your email"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Password Field */}
                    <div>
                        <InputLabel htmlFor="password" value="Password" className="text-gray-700 font-medium" />
                        <div className="relative mt-2">
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="block w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 pr-10"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Remember Me and Forgot Password */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ms-2 text-sm text-gray-600">
                                Remember me
                            </span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-gray-500 hover:text-gray-700 underline"
                            >
                                Forgot your password?
                            </Link>
                        )}
                    </div>

                    {/* Login Button */}
                    <PrimaryButton 
                        className="w-full justify-center bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 rounded-lg py-3 text-white font-medium" 
                        disabled={processing}
                    >
                        {processing ? 'Signing in...' : 'Log In'}
                    </PrimaryButton>

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                href={returnUrl ? `/register?returnUrl=${encodeURIComponent(returnUrl)}` : '/register'}
                                className="font-medium text-purple-600 hover:text-purple-700 underline"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
