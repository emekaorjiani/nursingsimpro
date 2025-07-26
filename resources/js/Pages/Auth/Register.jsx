import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Register({ returnUrl }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
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
            <Head title="Register" />

            <div className="bg-white rounded-2xl shadow-2xl p-8">
                {/* Logo */}
                <div className="text-center mb-8 flex items-center justify-center">
                    <ApplicationLogo textColor="text-gray-800" />
                </div>

                {/* Welcome Text */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
                    <p className="text-gray-600">Join NursingSim Pro to start learning</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <InputLabel htmlFor="name" value="Full Name" className="text-gray-700 font-medium" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-2 block w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                            placeholder="Enter your full name"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

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
                            onChange={(e) => setData('email', e.target.value)}
                            required
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
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
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

                    {/* Confirm Password Field */}
                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-gray-700 font-medium" />
                        <div className="relative mt-2">
                            <TextInput
                                id="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="block w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 pr-10"
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    {/* Register Button */}
                    <PrimaryButton 
                        className="w-full justify-center bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 rounded-lg py-3 text-white font-medium" 
                        disabled={processing}
                    >
                        {processing ? 'Creating account...' : 'Register'}
                    </PrimaryButton>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link
                                href={returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/login'}
                                className="font-medium text-purple-600 hover:text-purple-700 underline"
                            >
                                Log In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
