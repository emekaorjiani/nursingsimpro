import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <motion.nav 
            className="fixed top-0 w-full bg-white/95 nav-blur z-50 py-4 transition-all duration-300"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
                <motion.div 
                    className="flex items-center text-2xl font-bold text-blue-600 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                >
                    <Link href="/" className="flex items-center">
                        <Heart className="mr-2 text-3xl" />
                        <span>NursingSim Pro</span>
                    </Link>
                </motion.div>
                
                <ul className={`flex items-center space-x-8 ${isMenuOpen ? 'fixed left-0 top-[70px] flex-col bg-white w-full text-center transition-all duration-300 shadow-lg py-8 md:static md:flex-row md:bg-transparent md:shadow-none md:py-0' : 'hidden md:flex'}`}>
                    <motion.li whileHover={{ scale: 1.05 }}>
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                            HOME
                        </Link>
                    </motion.li>
                    <motion.li whileHover={{ scale: 1.05 }}>
                        <Link href="/#about" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                            ABOUT
                        </Link>
                    </motion.li>
                    <motion.li whileHover={{ scale: 1.05 }}>
                        <Link href="/#popular-courses" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                            POPULAR COURSES
                        </Link>
                    </motion.li>
                    <motion.li whileHover={{ scale: 1.05 }}>
                        <Link href="/courses" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                            ALL COURSES
                        </Link>
                    </motion.li>
                    <motion.li whileHover={{ scale: 1.05 }}>
                        <Link href="/#contact" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                            CONTACT
                        </Link>
                    </motion.li>
                </ul>

                {/* Authentication Links */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link href="/my-courses" className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                    My Courses
                                </Link>
                            </motion.div>
                            {user.is_admin ? (
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link href="/dashboard" className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                        Dashboard
                                    </Link>
                                </motion.div>
                            ) : null}
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link href="/logout" method="post" as="button" className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                    Logout
                                </Link>
                            </motion.div>
                        </>
                    ) : (
                        <>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link href="/login" className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                    Login
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link href="/register" className="text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600">
                                    Register
                                </Link>
                            </motion.div>
                        </>
                    )}
                </div>
                
                <motion.button 
                    className="flex flex-col cursor-pointer md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    whileTap={{ scale: 0.95 }}
                >
                    <AnimatePresence mode="wait">
                        {isMenuOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="w-6 h-6 text-gray-700" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu className="w-6 h-6 text-gray-700" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.nav>
    );
}
