import { Head } from '@inertiajs/react';
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
    AlertCircle
} from 'lucide-react';

export default function Dashboard({ stats, recentUsers, recentCourses, courseProgress }) {
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
            color: 'bg-purple-500',
            description: 'Current enrollments'
        },
        {
            title: 'Completion Rate',
            value: `${stats.completionRate}%`,
            change: '+5%',
            changeType: 'positive',
            icon: TrendingUp,
            color: 'bg-orange-500',
            description: 'Course completion'
        }
    ];

    const quickActions = [
        { title: 'Add New Course', icon: BookOpen, href: '/admin/courses/create', color: 'bg-purple-500' },
        { title: 'View All Users', icon: Users, href: '/admin/users', color: 'bg-purple-600' },
        { title: 'Analytics Report', icon: BarChart3, href: '/admin/analytics', color: 'bg-purple-700' },
        { title: 'System Settings', icon: Activity, href: '/admin/settings', color: 'bg-purple-800' }
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

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="xl:col-span-1"
                    >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="xl:col-span-3"
                    >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {recentUsers.map((user, index) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                                <Users className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500">New user registered</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500">{user.created_at}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Course Progress Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Progress Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {courseProgress.map((course, index) => (
                            <div key={course.id} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-medium text-gray-900">{course.title}</h4>
                                    <span className="text-xs text-gray-500">{course.enrolled_count} enrolled</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div 
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${course.completion_rate}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>{course.completion_rate}% completed</span>
                                    <span>{course.active_users} active</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
