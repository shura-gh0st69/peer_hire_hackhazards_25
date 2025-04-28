import React, { useState } from 'react';
import { CustomButton } from '@/components/ui/custom-button';
import { toast } from 'sonner';
import {
    Bell,
    Mail,
    Globe,
    Moon,
    Shield,
    ToggleLeft,
    ToggleRight,
    Lock,
    Eye,
    EyeOff
} from 'lucide-react';

interface SettingsSwitchProps {
    title: string;
    description: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    icon?: React.ReactNode;
}

const SettingsSwitch: React.FC<SettingsSwitchProps> = ({
    title,
    description,
    enabled,
    onChange,
    icon
}) => {
    return (
        <div className="flex justify-between items-center py-3">
            <div className="flex items-start">
                {icon && <div className="text-primary mt-0.5 mr-3">{icon}</div>}
                <div>
                    <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                    <p className="text-xs text-gray-500">{description}</p>
                </div>
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className="focus:outline-none"
                aria-pressed={enabled}
            >
                {enabled ? (
                    <div className="bg-primary text-white p-1 rounded-full">
                        <ToggleRight className="w-6 h-6" />
                    </div>
                ) : (
                    <div className="bg-gray-200 text-gray-600 p-1 rounded-full">
                        <ToggleLeft className="w-6 h-6" />
                    </div>
                )}
            </button>
        </div>
    );
};

const Settings = () => {
    // Notification settings
    const [notificationSettings, setNotificationSettings] = useState({
        projectUpdates: true,
        newMessages: true,
        paymentNotifications: true,
        marketingEmails: false,
        platformUpdates: true,
        jobRecommendations: true
    });

    // General settings
    const [generalSettings, setGeneralSettings] = useState({
        darkMode: false,
        twoFactorAuth: false,
        publicProfile: true,
        showEarnings: false,
        autoAcceptPayments: true
    });

    // Password management
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleNotificationChange = (key: keyof typeof notificationSettings, value: boolean) => {
        setNotificationSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleGeneralChange = (key: keyof typeof generalSettings, value: boolean) => {
        setGeneralSettings(prev => ({ ...prev, [key]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }

        // Here you'd make an API call to change the password
        toast.success("Password updated successfully!");
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const saveNotificationSettings = () => {
        // Here you'd make an API call to save notification settings
        toast.success("Notification settings saved!");
    };

    const saveGeneralSettings = () => {
        // Here you'd make an API call to save general settings
        toast.success("Settings saved successfully!");
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-16 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

                {/* Notifications Section */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center">
                            <Bell className="w-5 h-5 text-primary mr-2" />
                            <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage how you receive notifications and updates
                        </p>
                    </div>

                    <div className="p-6 space-y-4">
                        <SettingsSwitch
                            title="Project Updates"
                            description="Receive notifications for updates on your projects"
                            enabled={notificationSettings.projectUpdates}
                            onChange={(val) => handleNotificationChange('projectUpdates', val)}
                        />
                        <SettingsSwitch
                            title="New Messages"
                            description="Get notified when you receive new messages"
                            enabled={notificationSettings.newMessages}
                            onChange={(val) => handleNotificationChange('newMessages', val)}
                            icon={<Mail className="w-4 h-4" />}
                        />
                        <SettingsSwitch
                            title="Payment Notifications"
                            description="Get alerts for payments and escrow updates"
                            enabled={notificationSettings.paymentNotifications}
                            onChange={(val) => handleNotificationChange('paymentNotifications', val)}
                        />
                        <SettingsSwitch
                            title="Marketing Emails"
                            description="Receive promotional emails and offers"
                            enabled={notificationSettings.marketingEmails}
                            onChange={(val) => handleNotificationChange('marketingEmails', val)}
                        />
                        <SettingsSwitch
                            title="Platform Updates"
                            description="Important updates about PeerHire"
                            enabled={notificationSettings.platformUpdates}
                            onChange={(val) => handleNotificationChange('platformUpdates', val)}
                        />
                        <SettingsSwitch
                            title="Job Recommendations"
                            description="Receive personalized job recommendations"
                            enabled={notificationSettings.jobRecommendations}
                            onChange={(val) => handleNotificationChange('jobRecommendations', val)}
                        />

                        <div className="flex justify-end pt-4">
                            <CustomButton onClick={saveNotificationSettings}>
                                Save Notification Settings
                            </CustomButton>
                        </div>
                    </div>
                </div>

                {/* General Settings */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center">
                            <Globe className="w-5 h-5 text-primary mr-2" />
                            <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            Configure your account preferences
                        </p>
                    </div>

                    <div className="p-6 space-y-4">
                        <SettingsSwitch
                            title="Dark Mode"
                            description="Use dark theme throughout the application"
                            enabled={generalSettings.darkMode}
                            onChange={(val) => handleGeneralChange('darkMode', val)}
                            icon={<Moon className="w-4 h-4" />}
                        />
                        <SettingsSwitch
                            title="Two-Factor Authentication"
                            description="Add an extra layer of security to your account"
                            enabled={generalSettings.twoFactorAuth}
                            onChange={(val) => handleGeneralChange('twoFactorAuth', val)}
                            icon={<Shield className="w-4 h-4" />}
                        />
                        <SettingsSwitch
                            title="Public Profile"
                            description="Make your profile visible to other users"
                            enabled={generalSettings.publicProfile}
                            onChange={(val) => handleGeneralChange('publicProfile', val)}
                        />
                        <SettingsSwitch
                            title="Show Earnings"
                            description="Display your earnings on your public profile"
                            enabled={generalSettings.showEarnings}
                            onChange={(val) => handleGeneralChange('showEarnings', val)}
                        />
                        <SettingsSwitch
                            title="Auto-Accept Payments"
                            description="Automatically accept payments when work is verified"
                            enabled={generalSettings.autoAcceptPayments}
                            onChange={(val) => handleGeneralChange('autoAcceptPayments', val)}
                        />

                        <div className="flex justify-end pt-4">
                            <CustomButton onClick={saveGeneralSettings}>
                                Save General Settings
                            </CustomButton>
                        </div>
                    </div>
                </div>

                {/* Password Section */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center">
                            <Lock className="w-5 h-5 text-primary mr-2" />
                            <h2 className="text-lg font-medium text-gray-900">Password</h2>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            Update your password
                        </p>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="newPassword"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <CustomButton type="submit">
                                    Update Password
                                </CustomButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;