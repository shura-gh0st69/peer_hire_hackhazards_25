import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Switch } from './ui/switch';
import { Users, User } from 'lucide-react';

// Define the UserRole type to match the one in AuthContext
type UserRole = "client" | "freelancer";

export const RoleToggle = () => {
    const { currentRole, updateUserRole } = useAuth();
    
    const handleToggleChange = (checked: boolean) => {
        const newRole = checked ? 'freelancer' : 'client';
        updateUserRole(newRole);
    };

    return (
        <div className="fixed bottom-8 left-8 bg-white rounded-full shadow-lg p-4 z-50 flex items-center space-x-3 border-2 border-primary hover:animate-none">
            <div className={`flex items-center ${currentRole === 'client' ? 'text-primary font-medium' : 'text-gray-500'}`}>
                <User className="w-4 h-4 mr-1" />
                <span className="text-sm">Client</span>
            </div>
            
            <Switch
                checked={currentRole === 'freelancer'}
                onCheckedChange={handleToggleChange}
                className="data-[state=checked]:bg-primary"
            />
            
            <div className={`flex items-center ${currentRole === 'freelancer' ? 'text-primary font-medium' : 'text-gray-500'}`}>
                <Users className="w-4 h-4 mr-1" />
                <span className="text-sm">Freelancer</span>
            </div>
        </div>
    );
};