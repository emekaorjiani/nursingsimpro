import { Link } from '@inertiajs/react';
import { Shield, Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Error403() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <motion.div 
                className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                    <Shield className="w-8 h-8 text-red-600" />
                </motion.div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-8">
                    Sorry, you don't have permission to access this page. 
                    This area is restricted to administrators only.
                </p>
                
                <div className="space-y-4">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link 
                            href="/" 
                            className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Go to Home
                        </Link>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link 
                            href="/my-courses" 
                            className="inline-flex items-center justify-center w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            My Courses
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
} 