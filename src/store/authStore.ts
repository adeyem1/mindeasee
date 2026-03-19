'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '@/services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  role: 'user' | 'therapist' | 'guest' | 'admin' | null;
  guestChatCount: number;
  
  // Initialize auth state listener
  init: () => void;
  
  // Auth methods
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  
  // User profile methods
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  
  // State setters
  setUser: (user: User | null, role?: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setRole: (role: string | null) => void;
  setGuestChatCount: (count: number) => void;
}

const createUserProfile = async (firebaseUser: FirebaseUser): Promise<User> => {
  const { uid, email, displayName, photoURL, providerData } = firebaseUser;
  
  // Check if this is a first time user
  // const isNewUser = firebaseUser.metadata.creationTime === firebaseUser.metadata.lastSignInTime;
  const isGoogleProvider = providerData.some(provider => provider.providerId === 'google.com');
  
  // Create user object
  const user: User = {
    id: uid,
    uid,
    name: displayName || email?.split('@')[0] || 'User',
    email: email ?? undefined,
    createdAt: Date.now(),
    photoURL: photoURL ?? undefined,
    role: 'user',
    provider: isGoogleProvider ? 'google' : 'email',
  };
  
  // Check if user document exists
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  // If user doesn't exist in Firestore, create it
  if (!userSnap.exists()) {
    await setDoc(userRef, user);
  } else {
    // If user exists, merge with existing data
    const existingData = userSnap.data() as User;
    Object.assign(user, existingData);
    
    // If this is a Google login and we have a photoURL, update it
    if (isGoogleProvider && photoURL && (!existingData.photoURL || existingData.photoURL !== photoURL)) {
      await setDoc(userRef, { photoURL }, { merge: true });
    }
  }
  // Determine role
  if (user.email === 'guest@mindease.com') {
    user.role = 'guest';
  } else if (user.email?.endsWith('@therapist.com')) {
    user.role = 'therapist';
  } else if (user.email === 'admin@mindease.com') {
    user.role = 'admin';
  } else {
    user.role = 'user';
  }
  
  return user;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  role: null,
  guestChatCount: 0,
      
      init: () => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          set({ isLoading: true });
          try {
            if (firebaseUser) {
              // User is signed in
              const user = await createUserProfile(firebaseUser);
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                role: user.role || null,
                guestChatCount: user.role === 'guest' ? 0 : undefined,
              });
            } else {
              // User is signed out
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
                role: null,
                guestChatCount: 0,
              });
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: error instanceof Error ? error.message : 'Authentication error',
              role: null,
              guestChatCount: 0,
            });
          }
        });
        // Return unsubscribe function to clean up on unmount
        return unsubscribe;
      },
      
      signUp: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          // Prevent guest signup
          if (email === 'guest@mindease.com') {
            throw new Error('Guest account cannot be created.');
          }
          // Create user in Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          // Update profile with display name
          await updateProfile(userCredential.user, {
            displayName: name
          });
          // Create user profile in Firestore
          const user = await createUserProfile(userCredential.user);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            role: user.role || null,
          });
        } catch (error) {
          console.error('Sign up error:', error);
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Error creating account',
          });
          throw error;
        }
      },
      
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Sign in with Firebase Auth
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          // Get user profile
          const user = await createUserProfile(userCredential.user);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            role: user.role || null,
            guestChatCount: user.role === 'guest' ? 0 : undefined,
          });
        } catch (error) {
          console.error('Sign in error:', error);
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Invalid email or password',
          });
          throw error;
        }
      },
      
      signInWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          // Sign in with Google popup
          const provider = new GoogleAuthProvider();
          const userCredential = await signInWithPopup(auth, provider);
          // Get user profile
          const user = await createUserProfile(userCredential.user);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            role: user.role || null,
          });
        } catch (error) {
          console.error('Google sign in error:', error);
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to sign in with Google',
          });
          throw error;
        }
      },
      // Guest chat count logic (for limiting guest usage)
      incrementGuestChat: () => {
        const { guestChatCount } = get();
        set({ guestChatCount: guestChatCount + 1 });
      },
      
      signOut: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await firebaseSignOut(auth);
          
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('Sign out error:', error);
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Error signing out'
          });
          throw error;
        }
      },
      
      updateUserProfile: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          const { user } = get();
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          // Update in Firestore
          const userRef = doc(db, 'users', user.id);
          await setDoc(userRef, data, { merge: true });
          
          // Update local state
          set({ 
            user: { ...user, ...data },
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('Update profile error:', error);
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Error updating profile'
          });
          throw error;
        }
      },
      
  setUser: (user, role) => set({ user, role: role as 'user' | 'therapist' | 'guest' | 'admin' | null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
  setRole: (role) => set({ role: role as 'user' | 'therapist' | 'guest' | 'admin' | null }),
  setGuestChatCount: (count) => set({ guestChatCount: count }),
    }),
    {
      name: 'mindease-auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, role: state.role, guestChatCount: state.guestChatCount }),
    }
  )
);

// Initialize auth state listener when app loads
if (typeof window !== 'undefined') {
  useAuthStore.getState().init();
}
