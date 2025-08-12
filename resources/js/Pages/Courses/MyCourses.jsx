import { motion } from 'framer-motion';
import { 
    BookOpen, 
    Clock, 
    Play, 
    CheckCircle, 
    ArrowRight,
    Calendar,
    TrendingUp,
    Award,
    Heart,
    Linkedin,
    Twitter,
    Facebook,
    Instagram
} from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/Components/Navbar';

export default function MyCourses({ enrolledCourses, user }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'not_started': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <Award className="w-4 h-4" />;
            case 'in_progress': return <TrendingUp className="w-4 h-4" />;
            case 'not_started': return <Play className="w-4 h-4" />;
            default: return <Play className="w-4 h-4" />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Main Content */}
            <div className="pt-24">
                <div className="max-w-7xl mx-auto px-5 py-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Learning Journey</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Track your progress, continue learning, and achieve your nursing education goals
                        </p>
                    </motion.div>

                    {/* Course Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {enrolledCourses.map((course) => (
                            <motion.div
                                key={course.id}
                                variants={itemVariants}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                {/* Course Image */}
                                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                                    {course.thumbnail ? (
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <BookOpen className="w-16 h-16 text-white/80" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.progress?.status || 'not_started')}`}>
                                            {getStatusIcon(course.progress?.status || 'not_started')}
                                            <span className="ml-1">
                                                {course.progress?.status === 'completed' ? 'Completed' : 
                                                 course.progress?.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                {/* Course Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {course.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {course.description}
                                    </p>

                                    {/* Progress Bar */}
                                    {course.progress && (
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                <span>Progress</span>
                                                <span>{Math.round(course.progress.progress_percentage || 0)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${course.progress.progress_percentage || 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Course Stats */}
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            <span>{course.lessons_count || 0} lessons</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            <span>{formatDate(course.created_at)}</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Link
                                        href={`/courses/${course.id}`}
                                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        {course.progress?.status === 'completed' ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Review Course
                                            </>
                                        ) : course.progress?.status === 'in_progress' ? (
                                            <>
                                                <Play className="w-4 h-4 mr-2" />
                                                Continue Learning
                                            </>
                                        ) : (
                                            <>
                                                <ArrowRight className="w-4 h-4 mr-2" />
                                                Start Learning
                                            </>
                                        )}
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Empty State */}
                    {enrolledCourses.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-16"
                        >
                            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses enrolled yet</h3>
                            <p className="text-gray-600 mb-6">Start your learning journey by enrolling in our nursing simulation courses</p>
                            <Link
                                href="/courses"
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                            >
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Browse Courses
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12 mt-20">
                <div className="max-w-7xl mx-auto px-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <Link href="/" className="flex items-center text-2xl font-bold mb-4 hover:text-blue-400 transition-colors duration-300">
                                <Heart className="mr-2 text-blue-600" />
                                <span>NursingSim Pro</span>
                            </Link>
                            <p className="text-gray-300">Transforming nursing education through advanced simulation technology and expert training.</p>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><Link href="/" className="text-gray-300 hover:text-blue-600 transition-colors duration-300">HOME</Link></li>
                                <li><Link href="/#about" className="text-gray-300 hover:text-blue-600 transition-colors duration-300">ABOUT</Link></li>
                                <li><Link href="/#images" className="text-gray-300 hover:text-blue-600 transition-colors duration-300">IMAGES</Link></li>
                                <li><Link href="/#contact" className="text-gray-300 hover:text-blue-600 transition-colors duration-300">Contact</Link></li>
                            </ul>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <h4 className="text-lg font-semibold mb-4">Training Modules</h4>
                            <ul className="space-y-2">
                                <li className="text-gray-300">Patient Transfer</li>
                                <li className="text-gray-300">Childbirth</li>
                                <li className="text-gray-300">Intubation</li>
                                <li className="text-gray-300">Orthopedic Care</li>
                            </ul>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <h4 className="text-lg font-semibold mb-4">Connect</h4>
                            <div className="flex space-x-4">
                                <motion.a 
                                    href="#" 
                                    className="social-link"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Linkedin className="w-5 h-5" />
                                </motion.a>
                                <motion.a 
                                    href="#" 
                                    className="social-link"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Twitter className="w-5 h-5" />
                                </motion.a>
                                <motion.a 
                                    href="#" 
                                    className="social-link"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Facebook className="w-5 h-5" />
                                </motion.a>
                                <motion.a 
                                    href="#" 
                                    className="social-link"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Instagram className="w-5 h-5" />
                                </motion.a>
                            </div>
                        </motion.div>
                    </div>
                    <motion.div 
                        className="text-center pt-8 border-t border-gray-700 text-gray-400"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <p>&copy; 2025 NursingSim Pro. All rights reserved. Empowering healthcare education worldwide.</p>
                    </motion.div>
                </div>
            </footer>
        </div>
    );
} 