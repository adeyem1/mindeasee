'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { FiUser, FiCamera, FiUpload, FiTrash2 } from 'react-icons/fi';

interface AvatarUploadProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onUploadComplete?: (url: string) => void;
}

export default function AvatarUpload({ size = 'md', onUploadComplete }: AvatarUploadProps) {
  const { user, updateUserProfile } = useAuthStore();
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-20 w-20',
    lg: 'h-28 w-28',
    xl: 'h-36 w-36'
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      
      // Here we would normally upload to Firebase Storage or another service
      // Mock upload progress for demo purposes
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
      }

      // Create a local URL for the image for demonstration purposes
      // In a real app, we would upload to storage and get back a URL
      const localImageUrl = URL.createObjectURL(file);
      
      // Update user profile with new image URL
      await updateUserProfile({ photoURL: localImageUrl });

      if (onUploadComplete) {
        onUploadComplete(localImageUrl);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveAvatar = async () => {
    if (confirm('Are you sure you want to remove your profile picture?')) {
      try {
        await updateUserProfile({ photoURL: undefined });
        if (onUploadComplete) {
          onUploadComplete('');
        }
      } catch (error) {
        console.error('Error removing avatar:', error);
        alert('Failed to remove profile picture. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 cursor-pointer`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {user?.photoURL ? (
          <img 
            src={user.photoURL}
            alt={user.name || 'User'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-primary">
            <FiUser className={size === 'sm' ? 'h-6 w-6' : 'h-10 w-10'} />
          </div>
        )}
        
        {/* Hover overlay */}
        {isHovering && !isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <FiCamera className="text-white h-6 w-6" />
          </div>
        )}
        
        {/* Upload progress overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
            <div className="text-white text-xs mb-1">{uploadProgress}%</div>
            <div className="w-3/4 bg-gray-300 rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {user?.photoURL && (
        <button
          onClick={handleRemoveAvatar}
          className="mt-2 text-xs text-red-500 flex items-center"
          type="button"
        >
          <FiTrash2 className="mr-1" size={12} /> Remove
        </button>
      )}
      
      <div className="mt-2 flex flex-col items-center text-center">
        <p className="text-sm text-gray-500">
          {user?.photoURL ? 'Change photo' : 'Upload photo'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          JPEG, PNG, GIF (max 5MB)
        </p>
      </div>
    </div>
  );
}
