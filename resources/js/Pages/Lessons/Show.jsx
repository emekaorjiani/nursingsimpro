import { motion } from 'framer-motion';
import { 
    ChevronLeft, 
    ChevronRight, 
    CheckCircle, 
    Play,
    Clock,
    BookOpen,
    ArrowLeft,
    ExternalLink
} from 'lucide-react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function LessonShow({ course, lesson, navigation, userProgress, user }) {
    const { post, processing } = useForm();
    const { flash } = usePage().props;
    const [isCompleted, setIsCompleted] = useState(lesson.is_completed || false);
    const [progressData, setProgressData] = useState(userProgress);

    // Update progress data if flash data is available
    useEffect(() => {
        if (flash && flash.data) {
            setProgressData(flash.data);
        }
    }, [flash]);

    // Real-time progress tracking
    useEffect(() => {
        // Update progress when lesson is viewed
        const updateProgress = async () => {
            try {
                const response = await fetch(`/courses/${course.slug}/lessons/${lesson.slug}/progress`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                });
                
                if (response.ok) {
                    // Progress updated successfully
                    console.log('Progress updated');
                }
            } catch (error) {
                console.error('Error updating progress:', error);
            }
        };

        // Update progress after 5 seconds of viewing
        const timer = setTimeout(updateProgress, 5000);
        
        return () => clearTimeout(timer);
    }, [course.slug, lesson.slug]);

    const handleComplete = () => {
        console.log('Completing lesson:', lesson.id);
        post(`/courses/${course.slug}/lessons/${lesson.slug}/complete`, {
            onSuccess: (response) => {
                console.log('Lesson completion response:', response);
                setIsCompleted(true);
                // Update progress data with the flash data
                if (response && response.props && response.props.flash && response.props.flash.data) {
                    console.log('Updating progress with flash data:', response.props.flash.data);
                    setProgressData(response.props.flash.data);
                } else {
                    console.log('No flash data found in response');
                }
            },
            onError: (errors) => {
                console.error('Error completing lesson:', errors);
            },
        });
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-5 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href={`/courses/${course.slug}`}
                                className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Course
                            </Link>
                            <div className="text-sm text-gray-500">
                                Lesson {navigation.current_index} of {navigation.total_lessons}
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">
                                {formatDuration(lesson.duration_minutes)}
                            </div>
                            {progressData && (
                                <div className="text-sm text-gray-500">
                                    Progress: {progressData.progress_percentage}%
                                </div>
                            )}
                            <button
                                onClick={handleComplete}
                                disabled={processing || isCompleted}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                            >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                {isCompleted ? 'Completed' : 'Mark Complete'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-5 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Progress Section */}
                    {progressData && (
                        <div className="mb-6">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-700">Course Progress</span>
                                <span className="text-sm text-blue-600 font-medium">{progressData.progress_percentage}%</span>
                                <span className="text-sm text-gray-500">
                                    Time spent: {progressData.time_spent}
                                </span>
                                {progressData.estimated_completion > 0 && (
                                    <span className="text-sm text-gray-500">
                                        Est. completion: {Math.ceil(progressData.estimated_completion / 60)}h
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Lesson Header */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-4">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{lesson.title}</h1>
                            {isCompleted && (
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            )}
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{formatDuration(lesson.duration_minutes)}</span>
                            </div>
                            <div className="flex items-center">
                                <BookOpen className="w-4 h-4 mr-1" />
                                <span>Lesson {navigation.current_index}</span>
                            </div>
                        </div>
                    </div>

                    {/* Video Section - First */}
                    {lesson.video_url && (
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                {lesson.video_url.startsWith('http') ? (
                                    // External video (YouTube, Vimeo, etc.)
                                    <iframe
                                        src={lesson.video_url}
                                        title={lesson.title}
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    // Uploaded video file
                                    <video
                                        src={`/storage/${lesson.video_url}`}
                                        controls
                                        className="w-full h-full"
                                        preload="metadata"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Summary Section - Second */}
                    {lesson.summary && (
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Summary</h3>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed">{lesson.summary}</p>
                            </div>
                        </div>
                    )}

                    {/* Lesson Content */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Lesson Content</h3>
                        <div className="prose prose-lg max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                        </div>
                    </div>

                    {/* Resources Section - Third */}
                    {lesson.resources && lesson.resources.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Resources</h3>
                            <div className="space-y-3">
                                {lesson.resources.map((resource, index) => (
                                    <a
                                        key={index}
                                        href={`/storage/${resource.path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <ExternalLink className="w-4 h-4 text-blue-600 mr-3" />
                                        <div className="flex-1">
                                            <span className="text-gray-800 font-medium">{resource.name}</span>
                                            <p className="text-sm text-gray-500">
                                                {resource.type} • {formatFileSize(resource.size)}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        {navigation.previous_lesson ? (
                            <Link
                                href={`/courses/${course.slug}/lessons/${navigation.previous_lesson.slug}`}
                                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous Lesson
                            </Link>
                        ) : (
                            <div></div>
                        )}

                        {navigation.next_lesson ? (
                            progressData && progressData.progress_percentage >= 100 ? (
                                <Link
                                    href={`/courses/${course.slug}/lessons/${navigation.next_lesson.slug}`}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Next Lesson
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Link>
                            ) : (
                                <button
                                    onClick={() => {
                                        post(`/courses/${course.slug}/lessons/${lesson.slug}/navigate-forward`, {
                                            headers: {
                                                'Accept': 'application/json',
                                                'X-Requested-With': 'XMLHttpRequest',
                                            },
                                            onSuccess: (response) => {
                                                // Update progress data immediately on current page
                                                if (response && response.progress_data) {
                                                    setProgressData(response.progress_data);
                                                    
                                                    // Navigate to next lesson after a brief delay to show the updated progress
                                                    setTimeout(() => {
                                                        if (response.next_lesson_url) {
                                                            window.location.href = response.next_lesson_url;
                                                        } else if (response.course_completed && response.course_url) {
                                                            window.location.href = response.course_url;
                                                        }
                                                    }, 500);
                                                }
                                            },
                                        });
                                    }}
                                    disabled={processing}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                                >
                                    Next Lesson
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </button>
                            )
                        ) : !navigation.next_lesson ? (
                            progressData && progressData.progress_percentage >= 100 ? (
                                <Link
                                    href={`/courses/${course.slug}`}
                                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Back to Course
                                </Link>
                            ) : (
                                <button
                                    onClick={() => {
                                        post(`/courses/${course.slug}/lessons/${lesson.slug}/complete-course`, {
                                            headers: {
                                                'Accept': 'application/json',
                                                'X-Requested-With': 'XMLHttpRequest',
                                            },
                                            onSuccess: (response) => {
                                                // Update progress data immediately on current page
                                                if (response && response.progress_data) {
                                                    setProgressData(response.progress_data);
                                                    
                                                    // Navigate to course page after a brief delay to show the updated progress
                                                    setTimeout(() => {
                                                        if (response.course_url) {
                                                            window.location.href = response.course_url;
                                                        }
                                                    }, 500);
                                                }
                                            },
                                        });
                                    }}
                                    disabled={processing}
                                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Course Complete
                                </button>
                            )
                        ) : (
                            <div></div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 