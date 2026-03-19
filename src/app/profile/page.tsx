'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/ui/back-button';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { useAuthStore } from '@/store/authStore';
import AvatarUpload from '@/components/user/AvatarUpload';
import { Calendar, Mail, User, Clock, FileText } from 'lucide-react';

// Mock appointments data
const mockAppointments = [
  {
    id: '1',
    therapistName: 'Dr. Sarah Johnson',
    date: '2024-02-15',
    time: '10:00 AM',
    status: 'upcoming' as const
  },
  {
    id: '2',
    therapistName: 'Dr. Michael Chen',
    date: '2024-02-10',
    time: '2:00 PM',
    status: 'completed' as const
  }
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUserProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <UnifiedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Please sign in to view your profile.</p>
        </div>
      </UnifiedLayout>
    );
  }
  
  return (
    <UnifiedLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <BackButton onClick={() => router.push('/')} />
        </div>

        {/* Profile Header Card */}
        <div className="bg-card rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-primary px-6 py-12">
            <div className="text-center">
              <div className="mx-auto mb-4">
                <AvatarUpload size="lg" onUploadComplete={() => {}} />
              </div>
              <h1 className="text-2xl font-bold text-primary-foreground">{user.name || 'User'}</h1>
              <p className="text-primary-foreground/80">{user.email}</p>
            </div>
          </div>
          
          <div className="px-6 py-6">
            {!isEditing ? (
              <>
                {/* Personal Information */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2 text-foreground">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="text-lg text-foreground">{user.name || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="text-lg text-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="text-lg text-foreground">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Account Type</p>
                        <p className="text-lg text-foreground capitalize">{user.role || 'User'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Edit Profile
                  </button>
                  
                  <button
                    onClick={() => router.push('/forgot-password')}
                    className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2 text-foreground">Personal Information</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                        className="w-full px-3 py-2 border border-input bg-muted text-muted-foreground rounded-md cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-card rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Appointments
            </h2>
            <button
              onClick={() => router.push('/profile/appointments')}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          {mockAppointments.length > 0 ? (
            <div className="space-y-3">
              {mockAppointments.slice(0, 3).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{appointment.therapistName}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'upcoming' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No appointments yet</p>
              <button
                onClick={() => router.push('/therapists')}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Book an Appointment
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/chat')}
              className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left"
            >
              <h3 className="font-medium text-foreground mb-1">AI Chat</h3>
              <p className="text-sm text-muted-foreground">Talk to our AI assistant</p>
            </button>
            <button
              onClick={() => router.push('/mood-tracker')}
              className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left"
            >
              <h3 className="font-medium text-foreground mb-1">Mood Tracker</h3>
              <p className="text-sm text-muted-foreground">Track your daily mood</p>
            </button>
            <button
              onClick={() => router.push('/resources')}
              className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left"
            >
              <h3 className="font-medium text-foreground mb-1">Resources</h3>
              <p className="text-sm text-muted-foreground">Browse helpful resources</p>
            </button>
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
}
