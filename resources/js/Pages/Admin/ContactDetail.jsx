import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    Mail, 
    User, 
    Building, 
    Clock, 
    MessageSquare, 
    Send,
    CheckCircle,
    AlertCircle,
    Edit3
} from 'lucide-react';
import { useState } from 'react';

export default function ContactDetail({ contact }) {
    const [showResponseForm, setShowResponseForm] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        response: contact.admin_response || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.contacts.respond', contact.id), {
            onSuccess: () => {
                setShowResponseForm(false);
            },
        });
    };

    const getStatusBadge = (status, color) => {
        const colors = {
            new: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-yellow-100 text-yellow-800',
            resolved: 'bg-green-100 text-green-800',
            closed: 'bg-gray-100 text-gray-800',
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[color] || colors.gray}`}>
                {status.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    return (
        <>
            <Head title={`Contact from ${contact.name} - Admin`} />
            
            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={route('admin.contacts')}
                                    className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Back to Contacts
                                </Link>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Contact Message</h1>
                                    <p className="mt-1 text-gray-600">From {contact.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                {getStatusBadge(contact.status, contact.status_color)}
                                {!contact.is_read && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        NEW
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact Information */}
                            <motion.div 
                                className="bg-white rounded-lg shadow p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <User className="w-5 h-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                                            <p className="text-sm text-gray-500">Name</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{contact.email}</p>
                                            <p className="text-sm text-gray-500">Email</p>
                                        </div>
                                    </div>
                                    {contact.institution && (
                                        <div className="flex items-center">
                                            <Building className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{contact.institution}</p>
                                                <p className="text-sm text-gray-500">Institution</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <Clock className="w-5 h-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{contact.created_at}</p>
                                            <p className="text-sm text-gray-500">Submitted</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Message */}
                            <motion.div 
                                className="bg-white rounded-lg shadow p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Message</h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-900 whitespace-pre-wrap">{contact.message}</p>
                                </div>
                            </motion.div>

                            {/* Admin Response */}
                            {contact.has_response && (
                                <motion.div 
                                    className="bg-white rounded-lg shadow p-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-semibold text-gray-900">Admin Response</h2>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                                            Responded on {contact.responded_at}
                                        </div>
                                    </div>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <p className="text-gray-900 whitespace-pre-wrap">{contact.admin_response}</p>
                                    </div>
                                    {contact.responded_by && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            Response by: {contact.responded_by}
                                        </p>
                                    )}
                                </motion.div>
                            )}

                            {/* Response Form */}
                            {!contact.has_response && (
                                <motion.div 
                                    className="bg-white rounded-lg shadow p-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-semibold text-gray-900">Send Response</h2>
                                        <button
                                            onClick={() => setShowResponseForm(!showResponseForm)}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <Edit3 className="w-4 h-4 mr-1" />
                                            {showResponseForm ? 'Cancel' : 'Respond'}
                                        </button>
                                    </div>
                                    
                                    {showResponseForm && (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Your Response
                                                </label>
                                                <textarea
                                                    id="response"
                                                    rows={6}
                                                    value={data.response}
                                                    onChange={e => setData('response', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Type your response here..."
                                                    required
                                                />
                                                {errors.response && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.response}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-end space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowResponseForm(false)}
                                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                                >
                                                    <Send className="w-4 h-4 mr-1" />
                                                    {processing ? 'Sending...' : 'Send Response'}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <motion.div 
                                className="bg-white rounded-lg shadow p-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            // Update status to in_progress
                                            // This would need a separate form/action
                                        }}
                                        className="w-full flex items-center justify-center px-4 py-2 border border-yellow-300 text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                    >
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        Mark In Progress
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Update status to resolved
                                        }}
                                        className="w-full flex items-center justify-center px-4 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Mark Resolved
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Update status to closed
                                        }}
                                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Close
                                    </button>
                                </div>
                            </motion.div>

                            {/* Message Details */}
                            <motion.div 
                                className="bg-white rounded-lg shadow p-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Details</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Status:</span>
                                        <span className="font-medium">{contact.status.replace('_', ' ')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Read:</span>
                                        <span className="font-medium">{contact.is_read ? 'Yes' : 'No'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Has Response:</span>
                                        <span className="font-medium">{contact.has_response ? 'Yes' : 'No'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Message Length:</span>
                                        <span className="font-medium">{contact.message.length} characters</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 