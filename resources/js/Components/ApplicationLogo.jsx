import { Heart } from 'lucide-react';

export default function ApplicationLogo({ textColor = "text-white" }) {
    return (
        <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-blue-600" />
            <span className={`text-xl font-bold ${textColor}`}>NursingSim Pro</span>
        </div>
    );
}
