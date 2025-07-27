import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { 
    Users, 
    BookOpen, 
    GraduationCap, 
    TrendingUp, 
    Activity,
    BarChart3,
    PieChart,
    Calendar,
    Award,
    Clock,
    CheckCircle,
    AlertCircle,
    Mail,
    MessageSquare,
    Eye,
    Star,
    ArrowUpRight
} from 'lucide-react';

export default function Dashboard({ stats, recentUsers, recentMessages, popularCourses, activityData }) {
    const metricCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            change: '+12%',
            changeType: 'positive',
            icon: Users,
            color: 'bg-purple-500',
            description: 'Registered users'
        },
        {
            title: 'Available Courses',
            value: stats.totalCourses,
            change: '+3',
            changeType: 'positive',
            icon: BookOpen,
            color: 'bg-green-500',
            description: 'Active courses'
        },
        {
            title: 'Active Enrollments',
            value: stats.activeEnrollments,
            change: '+8%',
            changeType: 'positive',
            icon: GraduationCap,
            color: 'bg-blue-500',
            description: 'Current enrollments'
        },
        {
            title: 'New Messages',
            value: stats.newMessages,
            change: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : 'All read',
            changeType: stats.unreadMessages > 0 ? 'negative' : 'positive',
            icon: Mail,
            color: 'bg-orange-500',
            description: 'Messages'
        }
    ];

    const quickActions = [
        { title: 'Add New Course', icon: BookOpen, href: '/admin/courses/create', color: 'bg-purple-500' },
        { title: 'View All Users', icon: Users, href: '/admin/users', color: 'bg-purple-600' },
        { title: 'View Messages', icon: Mail, href: '/admin/messages', color: 'bg-purple-700' },
        { title: 'Analytics Report', icon: BarChart3, href: '/admin/analytics', color: 'bg-purple-800' },
        { title: 'System Settings', icon: Activity, href: '/admin/settings', color: 'bg-gray-600' }
    ];

    return (
        <DashboardLayout title="Dashboard">
            <Head title="Admin Dashboard" />
            
            <div className="w-full max-w-none pt-20">
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {metricCards.map((card, index) => (
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
                                    <p className="text-xs text-gray-500 mt-1">{card.description}</p>
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

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="xl:col-span-1"
                    >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 grid-cols-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                {quickActions.map((action, index) => (
                                    <motion.a
                                        key={action.title}
                                        href={action.href}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                                    >
                                        <div className={`${action.color} p-2 rounded-lg mr-3`}>
                                            <action.icon className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{action.title}</span>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent Messages */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="xl:col-span-2 grid-cols-2"
                    >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 grid-cols-2 p-6 w-full">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Recent Messages (Unread & In Progress)</h3>
                                <a href="/admin/messages" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    View All
                                </a>
                            </div>
                            <div className="space-y-3">
                                {recentMessages.length > 0 ? (
                                    recentMessages.map((message, index) => (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            <Link href={`/admin/messages/${message.id}`} className="block">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">{message.name}</p>
                                                        <p className="text-xs text-gray-600 mt-1">{message.message}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{message.created_at}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                            message.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                                            message.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {message.status.replace('_', ' ')}
                                                        </span>
                                                        {message.is_recent && (
                                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                        )}
                                                        <Eye className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 text-sm">No unread or in-progress messages</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Activity Data Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Overview</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last 7 Days
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last 30 Days
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status Breakdown
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Users className="w-5 h-5 text-blue-500 mr-2" />
                                            <span className="text-sm font-medium text-gray-900">Users</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {activityData.users.new_users_7_days}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {activityData.users.new_users_30_days}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {activityData.users.total_users}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {activityData.users.active_users} active
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <MessageSquare className="w-5 h-5 text-green-500 mr-2" />
                                            <span className="text-sm font-medium text-gray-900">Messages</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {activityData.messages.new_messages_7_days}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {activityData.messages.new_messages_30_days}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {activityData.messages.total_messages}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex space-x-1">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {activityData.messages.unread_messages} unread
                                            </span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                {activityData.messages.in_progress_messages} in progress
                                            </span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {activityData.messages.resolved_messages} resolved
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <GraduationCap className="w-5 h-5 text-purple-500 mr-2" />
                                            <span className="text-sm font-medium text-gray-900">Enrollments</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {activityData.enrollments.new_enrollments_7_days}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {activityData.enrollments.new_enrollments_30_days}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {activityData.enrollments.total_enrollments}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex space-x-1">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {activityData.enrollments.active_enrollments} active
                                            </span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {activityData.enrollments.completed_enrollments} completed
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <BookOpen className="w-5 h-5 text-orange-500 mr-2" />
                                            <span className="text-sm font-medium text-gray-900">Courses</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {activityData.courses.completed_courses_7_days}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {activityData.courses.completed_courses_30_days}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {activityData.courses.total_courses}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {activityData.courses.active_courses} active
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                

                {/* Popular Courses */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Most Popular Courses</h3>
                        <a href="/admin/courses" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                            View All Courses
                            <ArrowUpRight className="w-4 h-4 ml-1" />
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                        <span className="text-xs text-gray-500">#{index + 1}</span>
                                    </div>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        {course.enrolled_count} enrolled
                                    </span>
                                </div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">{course.title}</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Completion Rate</span>
                                        <span className="font-medium">{course.completion_rate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div 
                                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                            style={{ width: `${course.completion_rate}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Completed</span>
                                        <span>{course.completed_count}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
