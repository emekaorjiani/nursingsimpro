import { Link, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Play, Clock, CheckCircle, ArrowLeft, BookOpen, Calendar, Target, Award } from 'lucide-react';
import MainLayout from '../../Layouts/MainLayout';

export default function CourseShow({ course, userProgress, user }) {
    const { post, processing } = useForm();
    
    const isEnrolled = userProgress && userProgress.status !== 'not_enrolled';
    
    const handleEnroll = () => {
        if (!user) {
            // Redirect to login page with return URL as query parameter
            router.visit(`/login?returnUrl=${encodeURIComponent(`/courses/${course.slug}`)}`);
            return;
        }
        post(`/courses/${course.slug}/enroll`);
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    return (
        <MainLayout title={`${course.title} - NursingSim Pro`}>
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link 
                            href="/courses" 
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors duration-200"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Courses
                        </Link>
                        
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                    {course.title}
                                </h1>
                                <p className="text-xl text-gray-600 mb-8">
                                    {course.description}
                                </p>
                                
                                <div className="flex items-center space-x-6 mb-8">
                                    <div className="flex items-center">
                                        <Clock className="w-5 h-5 text-gray-500 mr-2" />
                                        <span className="text-gray-600">{course.duration}</span>
                                    </div>


                                </div>
                                
                                {isEnrolled && (
                                    <div className="mb-8">
                                        <div className="flex items-center space-x-4">
                                            <span className="text-sm font-medium text-gray-700">Course Progress</span>
                                            <span className="text-sm text-blue-600 font-medium">{userProgress.progress_percentage}%</span>
                                            <span className="text-sm text-gray-500">
                                                ({userProgress.completed_lessons?.length || 0} of {course.lessons.length} lessons)
                                            </span>
                                            {userProgress.progress_percentage >= 100 && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Completed
                                                </span>
                                            )}
                                        </div>
                                        {userProgress.progress_percentage >= 100 && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                Course completed! You can now freely navigate through all lessons for review.
                                            </p>
                                        )}
                                    </div>
                                )}
                                
                                <div className="flex space-x-4">
                                    {!isEnrolled ? (
                                        <button
                                            onClick={handleEnroll}
                                            disabled={processing}
                                            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
                                        >
                                            <Play className="w-5 h-5 mr-2" />
                                            {user ? 'Enroll Now' : 'Sign in to Enroll'}
                                        </button>
                                    ) : userProgress && userProgress.progress_percentage >= 100 ? (
                                        <Link
                                            href={`/courses/${course.slug}/lessons/${course.lessons[0].slug}`}
                                            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                                        >
                                            <BookOpen className="w-5 h-5 mr-2" />
                                            Revise Course
                                        </Link>
                                    ) : (
                                        <Link
                                            href={`/courses/${course.slug}/lessons/${course.lessons[0].slug}`}
                                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                                        >
                                            <Play className="w-5 h-5 mr-2" />
                                            Continue Learning
                                        </Link>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex justify-center">
                                <div className="w-80 h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                                    <BookOpen className="w-32 h-32 text-white" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Course Lessons Section - Two Column Layout */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-5">
                    <motion.h2 
                        className="text-3xl font-bold text-gray-900 mb-12 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Course Lessons
                    </motion.h2>
                    
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Left Column - Course Curriculum */}
                        <div className="lg:col-span-2">
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">Curriculum</h3>
                                
                                <div className="space-y-4">
                                    {course.lessons.map((lesson, index) => (
                                        <motion.div
                                            key={lesson.id}
                                            className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.6, delay: index * 0.1 }}
                                        >
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                                    {index + 1}
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="text-lg font-medium text-gray-900 mb-1">
                                                            {lesson.title}
                                                        </h4>
                                                        <p className="text-gray-600 text-sm mb-2">
                                                            {lesson.summary || lesson.description}
                                                        </p>
                                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                            <span className="flex items-center">
                                                                <Clock className="w-3 h-3 mr-1" />
                                                                {formatDuration(lesson.duration_minutes)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-2">
                                                        {lesson.is_completed && (
                                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                                        )}
                                                        {isEnrolled ? (
                                                            <Link
                                                                href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                                                                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                                                            >
                                                                {userProgress && userProgress.progress_percentage >= 100 ? 'View' : (lesson.is_completed ? 'Review' : 'Start')}
                                                                <Play className="w-3 h-3 ml-1" />
                                                            </Link>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">Enroll to access</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Column - Course Information */}
                        <div className="lg:col-span-1">
                            <div className="space-y-6">
                                {/* Course Stats */}
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Duration</span>
                                            <span className="font-medium">{course.duration}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Time Commitment</span>
                                            <span className="font-medium">{course.time_commitment_hours} hours/week</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Difficulty</span>
                                            <span className="font-medium capitalize">{course.difficulty}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Language</span>
                                            <span className="font-medium">{course.language}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Total Lessons</span>
                                            <span className="font-medium">{course.lessons.length}</span>
                                        </div>
                                        
                                        {isEnrolled && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Your Progress</span>
                                                <span className="font-bold text-blue-600">{userProgress.progress_percentage}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Learning Objectives */}
                                {course.learning_objectives && (
                                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <Target className="w-5 h-5 mr-2 text-blue-600" />
                                            Learning Objectives
                                        </h3>
                                        <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                            {course.learning_objectives}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Prerequisites */}
                                {course.prerequisites && (
                                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <Award className="w-5 h-5 mr-2 text-green-600" />
                                            Prerequisites
                                        </h3>
                                        <div className="text-gray-600 text-sm leading-relaxed">
                                            {course.prerequisites}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Course Summary */}
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Summary</h3>
                                    <div className="text-gray-600 text-sm leading-relaxed">
                                        <p className="mb-3">
                                            This comprehensive course provides essential knowledge and practical skills 
                                            for advanced patient assessment in nursing practice.
                                        </p>
                                        <p>
                                            Through interactive lessons, real-world scenarios, and hands-on exercises, 
                                            you'll develop the expertise needed to conduct thorough patient assessments 
                                            and make informed clinical decisions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
} 