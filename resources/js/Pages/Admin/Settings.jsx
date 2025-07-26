import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { Settings, Save, Globe, Shield, Bell, Database } from 'lucide-react';

export default function AdminSettings() {
    const settingsSections = [
        {
            title: 'General Settings',
            icon: Settings,
            color: 'bg-blue-500',
            description: 'Basic platform configuration'
        },
        {
            title: 'Security Settings',
            icon: Shield,
            color: 'bg-red-500',
            description: 'Authentication and security options'
        },
        {
            title: 'Notification Settings',
            icon: Bell,
            color: 'bg-green-500',
            description: 'Email and notification preferences'
        },
        {
            title: 'Database Settings',
            icon: Database,
            color: 'bg-purple-500',
            description: 'Database configuration and backup'
        },
        {
            title: 'Regional Settings',
            icon: Globe,
            color: 'bg-orange-500',
            description: 'Language and timezone settings'
        }
    ];

    return (
        <DashboardLayout title="Settings">
            <Head title="Settings" />
            
            <div className="space-y-6 w-full max-w-none pt-20">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
                    <p className="text-gray-600">Configure platform settings and preferences</p>
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {settingsSections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center mb-4">
                                <div className={`${section.color} p-3 rounded-lg mr-4`}>
                                    <section.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                                    <p className="text-sm text-gray-500">{section.description}</p>
                                </div>
                            </div>
                            <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors">
                                Configure
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save All Settings
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                        >
                            <Database className="w-4 h-4 mr-2" />
                            Backup Database
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                            <Globe className="w-4 h-4 mr-2" />
                            Reset to Defaults
                        </motion.button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 