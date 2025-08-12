import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Play, Clock, BookOpen } from 'lucide-react';
import MainLayout from '../../Layouts/MainLayout';

export default function CoursesIndex({ featuredCourses, allCourses }) {
    return (
        <MainLayout title="All Courses - NursingSim Pro">
            <Head title="All Courses" />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-5 text-center">
                    <motion.h1 
                        className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Explore Our Nursing Courses
                    </motion.h1>
                    <motion.p 
                        className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Master essential nursing skills through our comprehensive simulation-based courses designed for healthcare professionals.
                    </motion.p>
                </div>
            </div>

            {/* Featured Courses */}
            {featuredCourses && featuredCourses.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-5">
                        <motion.h2 
                            className="text-3xl font-bold text-gray-900 mb-12 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Featured Courses
                        </motion.h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredCourses.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                                        {course.thumbnail ? (
                                            <img
                                                src={`/storage/${course.thumbnail}`}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <BookOpen className="w-16 h-16 text-white" />
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{course.title}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                <span>{course.duration}</span>
                                            </div>

                                        </div>
                                        <Link
                                            href={`/courses/${course.slug}`}
                                            className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            View Course
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Courses */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-5">
                    <motion.h2 
                        className="text-3xl font-bold text-gray-900 mb-12 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        All Courses
                    </motion.h2>
                        {allCourses.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {allCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="h-48 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center relative overflow-hidden">
                                    {course.thumbnail ? (
                                        <img
                                            src={`/storage/${course.thumbnail}`}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <BookOpen className="w-16 h-16 text-white" />
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{course.title}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            <span>{course.duration}</span>
                                        </div>

                                    </div>
                                    <Link
                                        href={`/courses/${course.slug}`}
                                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                                    >
                                        <Play className="w-4 h-4 mr-2" />
                                        View Course
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                        ) : (
                            <div className="text-center text-gray-600 w-full text-xl italic h-28">
                                - No courses available -
                            </div>
                        )}
                </div>
            </section>
        </MainLayout>
    );
} 