import { Head, useForm, usePage, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { BookOpen, Save, ArrowLeft, Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';

export default function EditCourse({ course }) {
    const { old } = usePage().props; // Access old input data from validation errors
    
    const { data, setData, put, processing, errors } = useForm({
        title: old?.title || course.title || '',
        description: old?.description || course.description || '',
        slug: old?.slug || course.slug || '',
        difficulty: old?.difficulty || course.difficulty || 'beginner',
        duration_weeks: old?.duration_weeks || course.duration_weeks || 1,
        time_commitment_hours: old?.time_commitment_hours || course.time_commitment_hours || 1,
        language: old?.language || course.language || 'English',
        learning_objectives: old?.learning_objectives || course.learning_objectives || '',
        prerequisites: old?.prerequisites || course.prerequisites || '',
        is_published: old?.is_published !== undefined ? old.is_published : course.is_published || false,
        is_featured: old?.is_featured !== undefined ? old.is_featured : course.is_featured || false,
        thumbnail: null,
    });
    
    const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
    const [previewImage, setPreviewImage] = useState(
        course.thumbnail ? `/storage/${course.thumbnail}` : null
    );
    const fileInputRef = useRef(null);

    const generateSlug = () => {
        setIsGeneratingSlug(true);
        const slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
        setData('slug', slug);
        setIsGeneratingSlug(false);
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('thumbnail', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeThumbnail = () => {
        setData('thumbnail', null);
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // If we have a file upload, use explicit FormData handling
        if (data.thumbnail) {
            const formData = new FormData();
            
            // Add all form fields to FormData
            formData.append('title', data.title || '');
            formData.append('description', data.description || '');
            formData.append('slug', data.slug || '');
            formData.append('difficulty', data.difficulty || '');
            formData.append('duration_weeks', data.duration_weeks || '');
            formData.append('time_commitment_hours', data.time_commitment_hours || '');
            formData.append('language', data.language || '');
            formData.append('learning_objectives', data.learning_objectives || '');
            formData.append('prerequisites', data.prerequisites || '');
            formData.append('is_published', data.is_published ? '1' : '0');
            formData.append('is_featured', data.is_featured ? '1' : '0');
            formData.append('thumbnail', data.thumbnail);
            
            // Use Inertia's router for file uploads (handles CSRF automatically)
            router.put(route('admin.courses.update', course.slug), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    // Keep the existing thumbnail preview if no new one was uploaded
                    if (!data.thumbnail) {
                        setPreviewImage(course.thumbnail ? `/storage/${course.thumbnail}` : null);
                    }
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                    // Prevent form reset on validation failure
                    // The old input data will be automatically populated by Laravel
                },
            });
        } else {
            // No file upload - use regular Inertia put with form data
            const formData = {
                title: data.title,
                description: data.description,
                slug: data.slug,
                difficulty: data.difficulty,
                duration_weeks: data.duration_weeks,
                time_commitment_hours: data.time_commitment_hours,
                language: data.language,
                learning_objectives: data.learning_objectives,
                prerequisites: data.prerequisites,
                is_published: data.is_published,
                is_featured: data.is_featured,
            };
            
            put(route('admin.courses.update', course.slug), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    // Keep the existing thumbnail preview if no new one was uploaded
                    if (!data.thumbnail) {
                        setPreviewImage(course.thumbnail ? `/storage/${course.thumbnail}` : null);
                    }
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                    // Prevent form reset on validation failure
                    // The old input data will be automatically populated by Laravel
                },
            });
        }
    };

    return (
        <DashboardLayout title={`Edit Course - ${course.title}`}>
            <Head title={`Edit Course - ${course.title}`} />
            
            <div className="space-y-6 w-full max-w-none pt-20">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Edit Course</h2>
                        <p className="text-gray-600">Update course information and settings</p>
                    </div>
                    <motion.a
                        href={route('admin.courses.detail', course.slug)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Course
                    </motion.a>
                </div>

                {/* Course Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Course Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Enter course title"
                                    />
                                    {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Slug <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="course-slug"
                                        />
                                        <button
                                            type="button"
                                            onClick={generateSlug}
                                            disabled={isGeneratingSlug || !data.title}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                                        >
                                            {isGeneratingSlug ? 'Generating...' : 'Generate'}
                                        </button>
                                    </div>
                                    {errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug}</p>}
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter course description"
                                />
                                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                            </div>
                        </div>

                        {/* Course Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Difficulty <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.difficulty}
                                        onChange={(e) => setData('difficulty', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                    {errors.difficulty && <p className="text-red-600 text-sm mt-1">{errors.difficulty}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Duration (Weeks) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.duration_weeks}
                                        onChange={(e) => setData('duration_weeks', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.duration_weeks && <p className="text-red-600 text-sm mt-1">{errors.duration_weeks}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Time Commitment (Hours) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.time_commitment_hours}
                                        onChange={(e) => setData('time_commitment_hours', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.time_commitment_hours && <p className="text-red-600 text-sm mt-1">{errors.time_commitment_hours}</p>}
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Language <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.language}
                                    onChange={(e) => setData('language', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="e.g., English, Spanish, French"
                                />
                                {errors.language && <p className="text-red-600 text-sm mt-1">{errors.language}</p>}
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Learning Objectives
                                    </label>
                                    <textarea
                                        value={data.learning_objectives}
                                        onChange={(e) => setData('learning_objectives', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="What will students learn from this course?"
                                    />
                                    {errors.learning_objectives && <p className="text-red-600 text-sm mt-1">{errors.learning_objectives}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Prerequisites
                                    </label>
                                    <textarea
                                        value={data.prerequisites}
                                        onChange={(e) => setData('prerequisites', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="What should students know before taking this course?"
                                    />
                                    {errors.prerequisites && <p className="text-red-600 text-sm mt-1">{errors.prerequisites}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Upload */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Thumbnail</h3>
                            <div className="space-y-4">
                                {previewImage && (
                                    <div className="relative inline-block">
                                        <img
                                            src={previewImage}
                                            alt="Course thumbnail preview"
                                            className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeThumbnail}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                <div className="relative">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="text-center">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600 mb-1">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 2MB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {errors.thumbnail && <p className="text-red-600 text-sm mt-1">{errors.thumbnail}</p>}
                            </div>
                        </div>

                        {/* Course Settings */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Settings</h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_published"
                                        checked={data.is_published}
                                        onChange={(e) => setData('is_published', e.target.checked)}
                                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                    />
                                    <label htmlFor="is_published" className="ml-2 text-sm text-gray-700">
                                        Publish this course
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                    />
                                    <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700">
                                        Feature this course on the homepage
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <motion.a
                                href={route('admin.courses.detail', course.slug)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </motion.a>
                            <motion.button
                                type="submit"
                                disabled={processing}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Updating...' : 'Update Course'}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
} 