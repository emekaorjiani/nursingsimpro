import { Head, useForm, usePage, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { BookOpen, Save, ArrowLeft, Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';

export default function CreateCourse() {
    const { old } = usePage().props; // Access old input data from validation errors
    
    const { data, setData, post, processing, errors } = useForm({
        title: old?.title || '',
        description: old?.description || '',
        slug: old?.slug || '',
        difficulty: old?.difficulty || 'beginner',
        duration_weeks: old?.duration_weeks || 1,
        time_commitment_hours: old?.time_commitment_hours || 1,
        language: old?.language || 'English',
        learning_objectives: old?.learning_objectives || '',
        prerequisites: old?.prerequisites || '',
        is_published: old?.is_published !== undefined ? old.is_published : false,
        is_featured: old?.is_featured !== undefined ? old.is_featured : false,
        thumbnail: null,
    });

    const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
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
            router.post(route('admin.courses.store'), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Course created successfully!');
                    setPreviewImage(null);
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                },
            });
        } else {
            // No file upload - use regular Inertia post with form data
            post(route('admin.courses.store'), {
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
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setPreviewImage(null);
                },
                onError: () => {
                    // Prevent form reset on validation failure
                    // The old input data will be automatically populated by Laravel
                },
            });
        }
    };

    return (
        <DashboardLayout title="Create Course">
            <Head title="Create Course" />
            
            <div className="space-y-6 w-full max-w-none pt-20">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
                        <p className="text-gray-600">Add a new course to the platform</p>
                    </div>
                    <motion.a
                        href={route('admin.courses')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Courses
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Course Title *
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Course Slug *
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="course-slug"
                                        />
                                        <button
                                            type="button"
                                            onClick={generateSlug}
                                            disabled={isGeneratingSlug || !data.title}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isGeneratingSlug ? 'Generating...' : 'Generate'}
                                        </button>
                                    </div>
                                    {errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug}</p>}
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
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

                            {/* Thumbnail Upload */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Course Thumbnail
                                </label>
                                <div className="space-y-4">
                                    {previewImage ? (
                                        <div className="relative">
                                            <img
                                                src={previewImage}
                                                alt="Course thumbnail preview"
                                                className="w-48 h-32 object-cover rounded-lg border border-gray-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeThumbnail}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Click to upload or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, GIF up to 2MB
                                                </p>
                                            </div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleThumbnailChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    )}
                                    {!previewImage && (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Choose File
                                        </button>
                                    )}
                                    {errors.thumbnail && <p className="text-red-600 text-sm mt-1">{errors.thumbnail}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Course Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Difficulty Level *
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Duration (Weeks) *
                                    </label>
                                    <input
                                        type="number"
                                        value={data.duration_weeks}
                                        onChange={(e) => setData('duration_weeks', e.target.value)}
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.duration_weeks && <p className="text-red-600 text-sm mt-1">{errors.duration_weeks}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Time Commitment (Hours) *
                                    </label>
                                    <input
                                        type="number"
                                        value={data.time_commitment_hours}
                                        onChange={(e) => setData('time_commitment_hours', e.target.value)}
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.time_commitment_hours && <p className="text-red-600 text-sm mt-1">{errors.time_commitment_hours}</p>}
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Language *
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                                        Publish course immediately
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                                        Feature this course on homepage
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Upload */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Thumbnail</h3>
                            <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                    <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Thumbnail (Recommended: 1200x630px)
                                    </label>
                                    <input
                                        type="file"
                                        id="thumbnail"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                    />
                                    {errors.thumbnail && <p className="text-red-600 text-sm mt-1">{errors.thumbnail}</p>}
                                </div>
                                {previewImage && (
                                    <div className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-300">
                                        <img src={previewImage} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={removeThumbnail}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 flex items-center justify-center"
                                            style={{ right: '-10px', top: '-10px' }}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <motion.a
                                href={route('admin.courses')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </motion.a>
                            <motion.button
                                type="submit"
                                disabled={processing}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Creating...' : 'Create Course'}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
} 