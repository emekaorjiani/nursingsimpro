import Navbar from '@/Components/Navbar';

export default function GuestLayout({ children }) {
    return (
        <>
            <Navbar />

            {/* Main Content */}
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4 pt-24">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </>
    );
}
