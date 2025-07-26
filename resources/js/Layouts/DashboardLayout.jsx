import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    Users, 
    BookOpen, 
    BarChart3, 
    Settings, 
    LogOut,
    Menu,
    X,
    Heart
} from 'lucide-react';
import { useState } from 'react';

export default function DashboardLayout({ children, title }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Courses', href: '/admin/courses', icon: BookOpen },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Fixed Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-1/5 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                style={{ height: '100vh' }}
            >
                <div className="flex flex-col h-full overflow-hidden">
                    {/* Logo Section */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
                        <Link href="/" className="flex items-center text-xl font-bold text-purple-600">
                            <Heart className="mr-2 text-2xl" />
                            <span>NursingSim Pro</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-6 overflow-y-auto">
                        <div className="space-y-1">
                            {navigation.map((item) => {
                                const isActive = window.location.pathname === item.href;
                                return (
                                    <motion.div
                                        key={item.name}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Link
                                            href={item.href}
                                            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                                isActive
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                                            }`}
                                        >
                                            <item.icon
                                                className={`mr-3 h-5 w-5 ${
                                                    isActive ? 'text-purple-500' : 'text-gray-400 group-hover:text-purple-500'
                                                }`}
                                            />
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-gray-200 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                                    <p className="text-xs text-gray-500">Administrator</p>
                                </div>
                            </div>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
                            >
                                <LogOut className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className="lg:ml-[20%] min-w-0 w-full lg:w-[80%]">
                {/* Fixed Top bar */}
                <div className="fixed top-0 right-0 z-10 bg-white shadow-sm border-b border-gray-200 lg:w-[80%]">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <h1 className="ml-4 lg:ml-0 text-xl font-semibold text-gray-900">{title}</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">Admin Panel</span>
                        </div>
                    </div>
                </div>

                {/* Scrollable Page content */}
                <main className="pt-28 p-4 sm:p-6 lg:p-8 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
} 