import { usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            {header && (
                <header className="bg-white shadow pt-24">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="pt-24">{children}</main>
        </div>
    );
}
