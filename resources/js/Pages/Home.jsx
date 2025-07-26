import MainLayout from '../Layouts/MainLayout';
import { useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { 
    Globe, 
    GraduationCap, 
    Shield, 
    Users, 
    Heart, 
    Lightbulb, 
    User, 
    Baby, 
    Bed, 
    Activity, 
    Footprints, 
    Check, 
    Mail, 
    Phone, 
    MapPin,
    Target,
    Eye
} from 'lucide-react';

export default function Home() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        institution: '',
        message: '',
    });

    // Handle hash routing for navigation
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash) {
                const element = document.querySelector(hash);
                if (element) {
                    // Add a small delay to ensure the page is fully loaded
                    setTimeout(() => {
                        element.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 100);
                }
            }
        };

        // Handle initial load with hash
        handleHashChange();

        // Handle hash changes
        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => {
                reset();
                alert('Thank you for your message! We will get back to you soon.');
            },
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <MainLayout title="Nursing Simulation Excellence">


            {/* Hero Section - HOME */}
            <section id="home" className="min-h-screen flex items-center bg-gradient-primary text-white pt-20">
                <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        className="text-center lg:text-left"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Transforming Nursing Education Through Advanced Simulation
                        </h1>
                        <p className="text-xl mb-8 opacity-90">
                            Empowering healthcare professionals worldwide with cutting-edge simulation technology and expert training in critical nursing skills.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <motion.a 
                                href="/#about" 
                                className="btn-primary"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Learn About Us
                            </motion.a>
                            <motion.a 
                                href="/#images" 
                                className="btn-secondary"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View Our Training
                            </motion.a>
                        </div>
                    </motion.div>
                    <motion.div 
                        className="flex justify-center lg:justify-end"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="text-8xl text-white/20">
                            <User className="w-full h-full" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-5">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">ABOUT</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Our commitment to excellence in healthcare education</p>
                    </motion.div>
                    
                    {/* Mission Section */}
                    <div className="mb-24" id="mission">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
                            <motion.div 
                                className="lg:col-span-2"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">MISSION</h3>
                                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                    Our mission is to revolutionize nursing education by providing comprehensive simulation training that prepares healthcare professionals for real-world challenges. We are dedicated to ensuring that every nursing student, regardless of their location or resources, has access to world-class training opportunities.
                                </p>
                                <motion.div 
                                    className="space-y-4"
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                >
                                    <motion.div 
                                        className="flex items-center p-4 bg-white rounded-xl shadow-sm"
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                    >
                                        <Globe className="text-blue-600 text-xl w-5 mr-4" />
                                        <span className="font-medium text-gray-800">Global Accessibility</span>
                                    </motion.div>
                                    <motion.div 
                                        className="flex items-center p-4 bg-white rounded-xl shadow-sm"
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                    >
                                        <GraduationCap className="text-blue-600 text-xl w-5 mr-4" />
                                        <span className="font-medium text-gray-800">Expert Training</span>
                                    </motion.div>
                                    <motion.div 
                                        className="flex items-center p-4 bg-white rounded-xl shadow-sm"
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                    >
                                        <Shield className="text-blue-600 text-xl w-5 mr-4" />
                                        <span className="font-medium text-gray-800">Patient Safety</span>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <div className="image-placeholder">
                                    <Target className="w-full h-full" />
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Vision Section */}
                    <div className="mb-24" id="vision">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
                            <motion.div 
                                className="lg:order-2 lg:col-span-2"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">VISION</h3>
                                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                    We envision a world where every healthcare professional has access to the highest quality simulation training, regardless of their geographical location or institutional resources. Our vision is to bridge the gap between traditional education and real-world clinical practice, creating a safer and more competent healthcare workforce worldwide.
                                </p>
                                <motion.div 
                                    className="space-y-4"
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                >
                                    <motion.div 
                                        className="flex items-center p-4 bg-white rounded-xl shadow-sm"
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                    >
                                        <Users className="text-blue-600 text-xl w-5 mr-4" />
                                        <span className="font-medium text-gray-800">Empower Healthcare Workers</span>
                                    </motion.div>
                                    <motion.div 
                                        className="flex items-center p-4 bg-white rounded-xl shadow-sm"
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                    >
                                        <Heart className="text-blue-600 text-xl w-5 mr-4" />
                                        <span className="font-medium text-gray-800">Improve Patient Outcomes</span>
                                    </motion.div>
                                    <motion.div 
                                        className="flex items-center p-4 bg-white rounded-xl shadow-sm"
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                    >
                                        <Lightbulb className="text-blue-600 text-xl w-5 mr-4" />
                                        <span className="font-medium text-gray-800">Innovation in Education</span>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                            <motion.div 
                                className="lg:order-1"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <div className="image-placeholder">
                                    <Eye className="w-full h-full" />
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Leadership Team */}
                    <motion.div 
                        className="pt-16 border-t border-gray-200"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">Our Leadership</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <motion.div 
                                className="bg-white p-12 rounded-2xl shadow-lg text-center"
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 text-5xl text-white">
                                    <User className="w-16 h-16" />
                                </div>
                                <h4 className="text-2xl font-bold mb-2 text-gray-800">Dr. Melissa Culp</h4>
                                <p className="text-blue-600 font-medium mb-4">Principal & Medical Director</p>
                                <p className="text-gray-600 leading-relaxed">
                                    A distinguished healthcare professional with extensive experience in medical education and simulation technology. Dr. Culp brings years of clinical expertise and a passion for advancing nursing education through innovative training methods.
                                </p>
                            </motion.div>
                            <motion.div 
                                className="bg-white p-12 rounded-2xl shadow-lg text-center"
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 text-5xl text-white">
                                    <User className="w-16 h-16" />
                                </div>
                                <h4 className="text-2xl font-bold mb-2 text-gray-800">Mrs. Sandra (Sandy) Coleman</h4>
                                <p className="text-blue-600 font-medium mb-4">Principal & Clinical Director</p>
                                <p className="text-gray-600 leading-relaxed">
                                    A seasoned nursing professional with a deep commitment to excellence in healthcare education. Sandy's extensive background in clinical practice and education makes her an invaluable leader in developing comprehensive simulation programs.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Images Section */}
            <section id="images" className="py-24">
                <div className="max-w-7xl mx-auto px-5">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">IMAGES</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Explore our comprehensive training modules</p>
                    </motion.div>
                    
                    <motion.div 
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* TRANSFERRING A PATIENT */}
                        <motion.div 
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                            variants={itemVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="image-placeholder training">
                                <Bed className="w-full h-full" />
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold mb-4 text-gray-800">TRANSFERRING A PATIENT</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Master safe patient transfer techniques including bed-to-chair transfers, lateral transfers, and proper body mechanics to prevent injury to both patients and healthcare providers.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Check className="text-green-500 text-xs mr-2" />
                                        <span>Safe Transfer Protocols</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Check className="text-green-500 text-xs mr-2" />
                                        <span>Body Mechanics</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Check className="text-green-500 text-xs mr-2" />
                                        <span>Equipment Usage</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* CHILDBIRTH */}
                        <motion.div 
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                            variants={itemVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="image-placeholder training">
                                <Baby className="w-full h-full" />
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold mb-4 text-gray-800">CHILDBIRTH</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Comprehensive obstetric training covering labor and delivery procedures, neonatal care, maternal health monitoring, and emergency childbirth scenarios.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Check className="text-green-500 text-xs mr-2" />
                                        <span>Labor & Delivery</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Check className="text-green-500 text-xs mr-2" />
                                        <span>Neonatal Care</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Check className="text-green-500 text-xs mr-2" />
                                        <span>Emergency Procedures</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* INTUBATION */}
                        <motion.div 
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                            variants={itemVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="image-placeholder training">
                                <Activity className="w-full h-full" />
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold mb-4 text-gray-800">INTUBATION</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Advanced airway management training including endotracheal intubation, airway assessment, ventilation techniques, and emergency airway procedures.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Check className="text-green-500 text-xs mr-2" />
                                        <span>Airway Assessment</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Check className="text-green-500 text-xs mr-2" />
                                        <span>Intubation Techniques</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Check className="text-green-500 text-xs mr-2" />
                                        <span>Emergency Protocols</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* ORTHO - RANGE OF MOTION */}
                        <motion.div 
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                            variants={itemVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="image-placeholder training">
                                <Footprints className="w-full h-full" />
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold mb-4 text-gray-800">ORTHO - RANGE OF MOTION</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Orthopedic assessment and treatment training including range of motion exercises, joint mobilization, rehabilitation techniques, and orthopedic patient care.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Check className="text-green-500 text-xs mr-2" />
                                        <span>ROM Assessment</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Check className="text-green-500 text-xs mr-2" />
                                        <span>Joint Mobilization</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Check className="text-green-500 text-xs mr-2" />
                                        <span>Rehabilitation</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-5">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Get In Touch</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Ready to transform your nursing education program?</p>
                    </motion.div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Let's Connect</h3>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                We're here to help you implement cutting-edge simulation training in your nursing education program. Contact us to learn more about our services and how we can support your institution.
                            </p>
                            <motion.div 
                                className="space-y-4"
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <motion.div 
                                    className="flex items-center"
                                    variants={itemVariants}
                                    whileHover={{ x: 5 }}
                                >
                                    <Mail className="text-blue-600 text-xl w-5 mr-4" />
                                    <span className="text-gray-700">info@nursingsimpro.com</span>
                                </motion.div>
                                <motion.div 
                                    className="flex items-center"
                                    variants={itemVariants}
                                    whileHover={{ x: 5 }}
                                >
                                    <Phone className="text-blue-600 text-xl w-5 mr-4" />
                                    <span className="text-gray-700">+1 (555) 123-4567</span>
                                </motion.div>
                                <motion.div 
                                    className="flex items-center"
                                    variants={itemVariants}
                                    whileHover={{ x: 5 }}
                                >
                                    <MapPin className="text-blue-600 text-xl w-5 mr-4" />
                                    <span className="text-gray-700">Global Healthcare Education</span>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                        <motion.div 
                            className="bg-white p-10 rounded-2xl shadow-lg"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <input 
                                        type="text" 
                                        placeholder="Your Name" 
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="form-input"
                                        required 
                                    />
                                    {errors.name && <div className="form-error">{errors.name}</div>}
                                </div>
                                <div className="mb-6">
                                    <input 
                                        type="email" 
                                        placeholder="Your Email" 
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="form-input"
                                        required 
                                    />
                                    {errors.email && <div className="form-error">{errors.email}</div>}
                                </div>
                                <div className="mb-6">
                                    <input 
                                        type="text" 
                                        placeholder="Institution/Organization"
                                        value={data.institution}
                                        onChange={e => setData('institution', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="mb-6">
                                    <textarea 
                                        placeholder="Tell us about your training needs..." 
                                        rows="5"
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        className="form-textarea"
                                        required
                                    ></textarea>
                                    {errors.message && <div className="form-error">{errors.message}</div>}
                                </div>
                                <motion.button 
                                    type="submit" 
                                    className="btn-primary w-full" 
                                    disabled={processing}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {processing ? 'Sending...' : 'Send Message'}
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
} 