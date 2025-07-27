import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { 
    BookOpen, 
    Edit, 
    Plus, 
    Trash2, 
    Eye, 
    Clock, 
    Users, 
    FileText,
    ArrowLeft,
    Save,
    Settings,
    Play,
    CheckCircle,
    AlertCircle,
    X
} from 'lucide-react';
import { useState } from 'react';

export default function AdminCourseDetail({ course, lessons }) {
    const [editingLesson, setEditingLesson] = useState(null);
    const [showAddLesson, setShowAddLesson] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors } = useForm({
        title: course.title || '',
        description: course.description || '',
        slug: course.slug || '',
        difficulty: course.difficulty || 'beginner',
        duration_weeks: course.duration_weeks || 1,
        time_commitment_hours: course.time_commitment_hours || 1,
        language: course.language || 'English',
        learning_objectives: course.learning_objectives || '',
        prerequisites: course.prerequisites || '',
        is_published: course.is_published || false,
        is_featured: course.is_featured || false,
    });

    const lessonForm = useForm({
        course_id: course.id,
        title: '',
        slug: '',
        summary: '',
        content: '',
        duration_minutes: 30,
        order: 1,
        is_published: false,
        video_url: '',
        video_file: null,
        materials: [],
    });

    const [videoPreview, setVideoPreview] = useState(null);
    const [materialsPreview, setMaterialsPreview] = useState([]);

    const handleUpdateCourse = (e) => {
        e.preventDefault();
        put(route('admin.courses.update', course.id));
    };

    const handleAddLesson = (e) => {
        e.preventDefault();
        lessonForm.post(route('admin.lessons.store'), {
            onSuccess: () => {
                setShowAddLesson(false);
                lessonForm.reset();
            },
        });
    };

    const handleUpdateLesson = (e) => {
        e.preventDefault();
        lessonForm.put(route('admin.lessons.update', editingLesson.id), {
            onSuccess: () => {
                setEditingLesson(null);
                lessonForm.reset();
                setVideoPreview(null);
                setMaterialsPreview([]);
            },
        });
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            lessonForm.setData('video_file', file);
            
            // Create preview for video
            const videoUrl = URL.createObjectURL(file);
            setVideoPreview(videoUrl);
        }
    };

    const handleMaterialsChange = (e) => {
        const files = Array.from(e.target.files);
        lessonForm.setData('materials', files);
        
        // Create previews for materials
        const previews = files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file)
        }));
        setMaterialsPreview(previews);
    };

    const removeMaterial = (index) => {
        const newMaterials = lessonForm.data.materials.filter((_, i) => i !== index);
        lessonForm.setData('materials', newMaterials);
        
        const newPreviews = materialsPreview.filter((_, i) => i !== index);
        setMaterialsPreview(newPreviews);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDeleteLesson = (lessonId) => {
        destroy(route('admin.lessons.destroy', lessonId), {
            onSuccess: () => {
                setShowDeleteConfirm(null);
            },
        });
    };

    const startEditLesson = (lesson) => {
        setEditingLesson(lesson);
        lessonForm.setData({
            title: lesson.title,
            slug: lesson.slug,
            summary: lesson.summary,
            content: lesson.content,
            duration_minutes: lesson.duration_minutes,
            order: lesson.order,
            is_published: lesson.is_published,
            video_url: lesson.video_url || '',
            video_file: null,
            materials: [],
        });

        // Set previews for existing video and materials
        if (lesson.video_url && !lesson.video_url.startsWith('http')) {
            setVideoPreview(`/storage/${lesson.video_url}`);
        }
        
        if (lesson.resources && lesson.resources.length > 0) {
            const previews = lesson.resources.map(resource => ({
                name: resource.name,
                size: resource.size,
                type: resource.type,
                url: `/storage/${resource.path}`,
                existing: true
            }));
            setMaterialsPreview(previews);
        }
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    return (
        <DashboardLayout title={`${course.title} - Course Management`}>
            <Head title={`${course.title} - Course Management`} />
            
            <div className="space-y-6 w-full max-w-none pt-20">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <motion.a
                            href={route('admin.courses')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Courses
                        </motion.a>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
                            <p className="text-gray-600">Course Management Dashboard</p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <motion.a
                            href={`/courses/${course.slug}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            View Public Page
                        </motion.a>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Lessons Management */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Course Stats */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Overview</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{lessons.length}</div>
                                    <div className="text-sm text-gray-600">Total Lessons</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {lessons.filter(l => l.is_published).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Published</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {lessons.filter(l => !l.is_published).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Draft</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {course.enrollments_count || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Enrollments</div>
                                </div>
                            </div>
                        </div>

                        {/* Lessons Management */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Lessons Management</h3>
                                <motion.button
                                    onClick={() => setShowAddLesson(true)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Lesson
                                </motion.button>
                            </div>

                            {/* Add/Edit Lesson Form */}
                            {(showAddLesson || editingLesson) && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                    <h4 className="text-md font-semibold text-gray-900 mb-4">
                                        {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
                                    </h4>
                                    <form onSubmit={editingLesson ? handleUpdateLesson : handleAddLesson} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Title <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={lessonForm.data.title}
                                                    onChange={(e) => lessonForm.setData('title', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                                {lessonForm.errors.title && <p className="text-red-600 text-sm mt-1">{lessonForm.errors.title}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Slug <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={lessonForm.data.slug}
                                                    onChange={(e) => lessonForm.setData('slug', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                                {lessonForm.errors.slug && <p className="text-red-600 text-sm mt-1">{lessonForm.errors.slug}</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                                            <textarea
                                                value={lessonForm.data.summary}
                                                onChange={(e) => lessonForm.setData('summary', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                            {lessonForm.errors.summary && <p className="text-red-600 text-sm mt-1">{lessonForm.errors.summary}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Content <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                value={lessonForm.data.content}
                                                onChange={(e) => lessonForm.setData('content', e.target.value)}
                                                rows={6}
                                                placeholder="Enter the lesson content here..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                            {lessonForm.errors.content && <p className="text-red-600 text-sm mt-1">{lessonForm.errors.content}</p>}
                                        </div>

                                        {/* Video Upload */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Video</label>
                                            <div className="space-y-3">
                                                {/* Video URL Input */}
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Video URL (YouTube, Vimeo, etc.)</label>
                                                    <input
                                                        type="url"
                                                        value={lessonForm.data.video_url}
                                                        onChange={(e) => lessonForm.setData('video_url', e.target.value)}
                                                        placeholder="https://youtube.com/watch?v=..."
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    />
                                                    {lessonForm.errors.video_url && <p className="text-red-600 text-sm mt-1">{lessonForm.errors.video_url}</p>}
                                                </div>

                                                {/* Video File Upload */}
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Or Upload Video File</label>
                                                    <div className="relative">
                                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                                                            <input
                                                                type="file"
                                                                accept="video/*"
                                                                onChange={handleVideoChange}
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            />
                                                            <div className="text-center">
                                                                <Play className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                                <p className="text-sm text-gray-600 mb-1">
                                                                    Click to upload or drag and drop
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    MP4, MOV, AVI up to 500MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {lessonForm.errors.video_file && <p className="text-red-600 text-sm mt-1">{lessonForm.errors.video_file}</p>}
                                                </div>

                                                {/* Video Preview */}
                                                {videoPreview && (
                                                    <div className="relative">
                                                        <video
                                                            src={videoPreview}
                                                            controls
                                                            className="w-full h-48 object-cover rounded-lg border border-gray-300"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                lessonForm.setData('video_file', null);
                                                                setVideoPreview(null);
                                                            }}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Lesson Materials Upload */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Materials</label>
                                            <div className="space-y-3">
                                                <div className="relative">
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar"
                                                            onChange={handleMaterialsChange}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                        <div className="text-center">
                                                            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                            <p className="text-sm text-gray-600 mb-1">
                                                                Click to upload or drag and drop
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                PDF, DOC, PPT, XLS, TXT, ZIP up to 50MB each
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {lessonForm.errors.materials && <p className="text-red-600 text-sm mt-1">{lessonForm.errors.materials}</p>}

                                                {/* Materials Preview */}
                                                {materialsPreview.length > 0 && (
                                                    <div className="space-y-2">
                                                        <h5 className="text-sm font-medium text-gray-700">Selected Materials:</h5>
                                                        {materialsPreview.map((material, index) => (
                                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                <div className="flex items-center space-x-3">
                                                                    <FileText className="w-4 h-4 text-gray-500" />
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-900">{material.name}</p>
                                                                        <p className="text-xs text-gray-500">{formatFileSize(material.size)}</p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeMaterial(index)}
                                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                                                <input
                                                    type="number"
                                                    value={lessonForm.data.duration_minutes}
                                                    onChange={(e) => lessonForm.setData('duration_minutes', e.target.value)}
                                                    min="1"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                                <input
                                                    type="number"
                                                    value={lessonForm.data.order}
                                                    onChange={(e) => lessonForm.setData('order', e.target.value)}
                                                    min="1"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="is_published"
                                                    checked={lessonForm.data.is_published}
                                                    onChange={(e) => lessonForm.setData('is_published', e.target.checked)}
                                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                                                    Publish lesson
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex space-x-3">
                                            <motion.button
                                                type="submit"
                                                disabled={lessonForm.processing}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                {lessonForm.processing ? 'Saving...' : (editingLesson ? 'Update Lesson' : 'Add Lesson')}
                                            </motion.button>
                                            <motion.button
                                                type="button"
                                                onClick={() => {
                                                    setShowAddLesson(false);
                                                    setEditingLesson(null);
                                                    lessonForm.reset();
                                                }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                            >
                                                Cancel
                                            </motion.button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* Lessons List */}
                            <div className="space-y-3">
                                {lessons.map((lesson, index) => (
                                    <motion.div
                                        key={lesson.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                                                {lesson.order}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-medium text-gray-900">{lesson.title}</h4>
                                                <p className="text-sm text-gray-600">{lesson.summary}</p>
                                                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                                    <span className="flex items-center">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {formatDuration(lesson.duration_minutes)}
                                                    </span>
                                                    <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        lesson.is_published 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {lesson.is_published ? 'Published' : 'Draft'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <motion.button
                                                onClick={() => startEditLesson(lesson)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => setShowDeleteConfirm(lesson.id)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Course Settings */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Course Thumbnail */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Thumbnail</h3>
                            {course.thumbnail ? (
                                <div className="relative">
                                    <img
                                        src={`/storage/${course.thumbnail}`}
                                        alt={course.title}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-16 h-16 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <motion.a
                                    href={route('admin.courses.edit', course.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center w-full p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                    <Edit className="w-4 h-4 mr-3" />
                                    Edit Course Details
                                </motion.a>
                                <motion.a
                                    href={`/courses/${course.slug}`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Eye className="w-4 h-4 mr-3" />
                                    View Public Page
                                </motion.a>
                            </div>
                        </div>

                        {/* Course Status */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Published</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        course.is_published 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {course.is_published ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Featured</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        course.is_featured 
                                            ? 'bg-purple-100 text-purple-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {course.is_featured ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Difficulty</span>
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                        {course.difficulty}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <div className="flex items-center mb-4">
                                <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">Delete Lesson</h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this lesson? This action cannot be undone.
                            </p>
                            <div className="flex space-x-3">
                                <motion.button
                                    onClick={() => handleDeleteLesson(showDeleteConfirm)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </motion.button>
                                <motion.button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </motion.button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
} 