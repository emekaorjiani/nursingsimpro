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
    Menu,
    X,
    Linkedin,
    Twitter,
    Facebook,
    Instagram
} from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

export default function MyCourses({ enrolledCourses, user }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
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
            {/* Navigation */}
            <motion.nav 
                className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-5">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <motion.div 
                            className="flex items-center text-2xl font-bold text-blue-600 cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Link href="/" className="flex items-center">
                                <Heart className="mr-2 text-3xl" />
                                <span>NursingSim Pro</span>
                            </Link>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link href="/#about" className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                    ABOUT
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link href="/#images" className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                POPULAR COURSES
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link href="/courses" className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                ALL COURSES
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link href="/#contact" className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                    CONTACT
                                </Link>
                            </motion.div>
                        </div>

                        {/* User Menu */}
                        <div className="hidden md:flex items-center space-x-4">
                            {user ? (
                                <>
                                    <Link href="/my-courses" className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                        My Courses
                                    </Link>
                                    {user.is_admin ? (
                                        <Link href="/dashboard" className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                            Dashboard
                                        </Link>
                                    ) : null}
                                    <Link href="/logout" method="post" as="button" className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                        Logout
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                        Login
                                    </Link>
                                    <Link href="/register" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                            >
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden bg-white border-t border-gray-200"
                        >
                            <div className="px-5 py-4 space-y-4">
                                <Link href="/#about" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                    ABOUT
                                </Link>
                                <Link href="/#images" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                    POPULAR COURSES
                                </Link>
                                <Link href="/courses" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                ALL COURSES
                                </Link>
                                <Link href="/#contact" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                    CONTACT
                                </Link>
                                
                                {user ? (
                                    <>
                                        <Link href="/my-courses" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                            My Courses
                                        </Link>
                                        {user.is_admin ? (
                                            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                                Dashboard
                                            </Link>
                                        ) : null}
                                        <Link href="/logout" method="post" as="button" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                            Logout
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                            Login
                                        </Link>
                                        <Link href="/register" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-5 text-center">
                    <motion.h1 
                        className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        My Learning Journey
                    </motion.h1>
                    <motion.p 
                        className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Track your progress and continue your nursing simulation education with your enrolled courses.
                    </motion.p>
                </div>
            </div>

            {/* Stats Section */}
            {enrolledCourses && enrolledCourses.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-5">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center">
                                <div className="text-4xl font-bold mb-2 text-gray-900">
                                    {enrolledCourses.length}
                                </div>
                                <div className="text-gray-600">Enrolled Courses</div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center">
                                <div className="text-4xl font-bold mb-2 text-gray-900">
                                    {enrolledCourses.filter(c => c.status === 'completed').length}
                                </div>
                                <div className="text-gray-600">Completed Courses</div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center">
                                <div className="text-4xl font-bold mb-2 text-gray-900">
                                    {Math.round(enrolledCourses.reduce((acc, c) => acc + c.progress_percentage, 0) / enrolledCourses.length)}%
                                </div>
                                <div className="text-gray-600">Average Progress</div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Courses Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-5">
                    {!enrolledCourses || enrolledCourses.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center py-16"
                        >
                            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
                                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">No Courses Enrolled Yet</h2>
                                <p className="text-gray-600 mb-8">
                                    Start your nursing simulation journey by enrolling in our comprehensive courses.
                                </p>
                                <Link
                                    href="/courses"
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                                >
                                    <Play className="w-5 h-5 mr-2" />
                                    Browse Courses
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                        >
                            {enrolledCourses.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    variants={itemVariants}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                >
                                    {/* Course Image */}
                                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                                        {course.thumbnail ? (
                                            <img 
                                                src={`/storage/${course.thumbnail}`} 
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <BookOpen className="w-16 h-16 text-white opacity-80" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                                                {getStatusIcon(course.status)}
                                                <span className="ml-1 capitalize">{course.status.replace('_', ' ')}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Course Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                                        
                                        {/* Progress Section */}
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="text-gray-600">Progress</span>
                                                <span className="text-blue-600 font-medium">{course.progress_percentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${course.progress_percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Course Stats */}
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                <span>{course.time_spent || '0m'}</span>
                                            </div>
                                            {course.estimated_completion > 0 && (
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    <span>~{Math.ceil(course.estimated_completion / 60)}h remaining</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Next Lesson Info */}
                                        {course.next_lesson && course.status !== 'completed' && (
                                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                                <div className="text-sm text-blue-800">
                                                    <span className="font-medium">Next lesson:</span> {course.next_lesson.title}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-between">
                                            <Link
                                                href={`/courses/${course.slug}`}
                                                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                                            >
                                                View Details
                                                <ArrowRight className="w-4 h-4 ml-1" />
                                            </Link>
                                            
                                            {course.status !== 'completed' ? (
                                                <Link
                                                    href={course.next_lesson 
                                                        ? `/courses/${course.slug}/lessons/${course.next_lesson.slug}`
                                                        : `/courses/${course.slug}`
                                                    }
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                                >
                                                    <Play className="w-4 h-4 mr-1" />
                                                    {course.next_lesson ? 'Continue Learning' : 'Start Learning'}
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={`/courses/${course.slug}/lessons/${course.lessons?.[0]?.slug || course.slug}`}
                                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                                >
                                                    <BookOpen className="w-4 h-4 mr-1" />
                                                    Revise Course
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-5">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <motion.div 
                                className="flex items-center text-2xl font-bold text-blue-400 mb-4"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Link href="/" className="flex items-center">
                                    <Heart className="mr-2 text-3xl" />
                                    <span>NursingSim Pro</span>
                                </Link>
                            </motion.div>
                            <p className="text-gray-400 mb-6 max-w-md">
                                Empowering nursing professionals with cutting-edge simulation training and comprehensive learning experiences.
                            </p>
                            <div className="flex space-x-4">
                                <motion.a href="#" whileHover={{ scale: 1.1 }} className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                                    <Linkedin className="w-5 h-5" />
                                </motion.a>
                                <motion.a href="#" whileHover={{ scale: 1.1 }} className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                                    <Twitter className="w-5 h-5" />
                                </motion.a>
                                <motion.a href="#" whileHover={{ scale: 1.1 }} className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                                    <Facebook className="w-5 h-5" />
                                </motion.a>
                                <motion.a href="#" whileHover={{ scale: 1.1 }} className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                                    <Instagram className="w-5 h-5" />
                                </motion.a>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><Link href="/#about" className="text-gray-400 hover:text-white transition-colors duration-200">About Us</Link></li>
                                <li><Link href="/courses" className="text-gray-400 hover:text-white transition-colors duration-200">Courses</Link></li>
                                <li><Link href="/#contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</Link></li>
                                <li><Link href="/my-courses" className="text-gray-400 hover:text-white transition-colors duration-200">My Courses</Link></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Help Center</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">FAQ</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 NursingSim Pro. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
} 