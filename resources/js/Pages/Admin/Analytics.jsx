import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { TrendingUp, Users, BookOpen, Award, Calendar } from 'lucide-react';

export default function AdminAnalytics({ monthlyRegistrations, enrollmentTrends }) {
    const analyticsCards = [
        {
            title: 'Total Revenue',
            value: '$12,450',
            change: '+12.5%',
            changeType: 'positive',
            icon: TrendingUp,
            color: 'bg-green-500'
        },
        {
            title: 'Active Users',
            value: '1,234',
            change: '+8.2%',
            changeType: 'positive',
            icon: Users,
            color: 'bg-blue-500'
        },
        {
            title: 'Course Completions',
            value: '456',
            change: '+15.3%',
            changeType: 'positive',
            icon: Award,
            color: 'bg-purple-500'
        },
        {
            title: 'New Enrollments',
            value: '89',
            change: '+5.7%',
            changeType: 'positive',
            icon: BookOpen,
            color: 'bg-orange-500'
        }
    ];

    return (
        <DashboardLayout title="Analytics">
            <Head title="Analytics" />
            
            <div className="space-y-6 w-full max-w-none pt-20">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                    <p className="text-gray-600">Track your platform's performance and user engagement</p>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {analyticsCards.map((card, index) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                                </div>
                                <div className={`${card.color} p-3 rounded-lg`}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                <span className={`text-sm font-medium ${
                                    card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {card.change}
                                </span>
                                <span className="text-sm text-gray-500 ml-2">from last month</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Registrations Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Registrations</h3>
                        <div className="h-64 flex items-end justify-between space-x-2">
                            {monthlyRegistrations.map((data, index) => (
                                <div key={data.month} className="flex-1 flex flex-col items-center">
                                    <div 
                                        className="w-full bg-blue-500 rounded-t"
                                        style={{ height: `${(data.count / Math.max(...monthlyRegistrations.map(d => d.count))) * 200}px` }}
                                    ></div>
                                    <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Enrollment Trends Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Trends</h3>
                        <div className="h-64 flex items-end justify-between space-x-2">
                            {enrollmentTrends.map((data, index) => (
                                <div key={data.month} className="flex-1 flex flex-col items-center">
                                    <div 
                                        className="w-full bg-green-500 rounded-t"
                                        style={{ height: `${(data.count / Math.max(...enrollmentTrends.map(d => d.count))) * 200}px` }}
                                    ></div>
                                    <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                    <Users className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">New user registered</p>
                                    <p className="text-xs text-gray-500">John Doe joined the platform</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">2 hours ago</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <Award className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Course completed</p>
                                    <p className="text-xs text-gray-500">Advanced Nursing completed by Jane Smith</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">4 hours ago</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                                    <BookOpen className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">New course added</p>
                                    <p className="text-xs text-gray-500">Emergency Care course published</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">1 day ago</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
} 