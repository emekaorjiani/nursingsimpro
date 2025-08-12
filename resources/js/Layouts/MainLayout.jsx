import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Heart, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import Navbar from '@/Components/Navbar';

export default function MainLayout({ children, title }) {
    return (
        <>
            <Head title={title} />
            
            <Navbar />

            {/* Main Content */}
            <main className="font-inter">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12 overflow-hidden">
                <div className="max-w-7xl mx-auto px-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <Link href="/" className="flex items-center text-2xl font-bold mb-4 hover:text-blue-400 transition-colors duration-300">
                                <Heart className="mr-2 text-blue-600" />
                                <span>NursingSim Pro</span>
                            </Link>
                            <p className="text-gray-300">Transforming nursing education through advanced simulation technology and expert training</p>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><Link href="/" className="text-gray-300 hover:text-blue-600 transition-colors duration-300">HOME</Link></li>
                                <li><Link href="/#about" className="text-gray-300 hover:text-blue-600 transition-colors duration-300">ABOUT</Link></li>
                                <li><Link href="/#images" className="text-gray-300 hover:text-blue-600 transition-colors duration-300">IMAGES</Link></li>
                                <li><Link href="/#contact" className="text-gray-300 hover:text-blue-600 transition-colors duration-300">Contact</Link></li>
                            </ul>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <h4 className="text-lg font-semibold mb-4">Training Modules</h4>
                            <ul className="space-y-2">
                                <li className="text-gray-300">Patient Transfer</li>
                                <li className="text-gray-300">Childbirth</li>
                                <li className="text-gray-300">Intubation</li>
                                <li className="text-gray-300">Orthopedic Care</li>
                            </ul>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <h4 className="text-lg font-semibold mb-4">Connect</h4>
                            <div className="flex space-x-4">
                                <motion.a 
                                    href="#" 
                                    className="social-link"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Linkedin className="w-5 h-5" />
                                </motion.a>
                                <motion.a 
                                    href="#" 
                                    className="social-link"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Twitter className="w-5 h-5" />
                                </motion.a>
                                <motion.a 
                                    href="#" 
                                    className="social-link"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Facebook className="w-5 h-5" />
                                </motion.a>
                                <motion.a 
                                    href="#" 
                                    className="social-link"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Instagram className="w-5 h-5" />
                                </motion.a>
                            </div>
                        </motion.div>
                    </div>
                    <motion.div 
                        className="text-center pt-8 border-t border-gray-700 text-gray-400"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <p>&copy; 2025 NursingSim Pro. All rights reserved. Empowering healthcare education worldwide.</p>
                    </motion.div>
                </div>
            </footer>
        </>
    );
} 