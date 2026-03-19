export type User = {
  id: string;
  uid: string; // Firebase auth uid
  name?: string;
  email?: string;
  phone?: string;
  createdAt?: number;
  photoURL?: string;
  role?: 'user' | 'therapist' | 'guest' | 'admin';
  provider?: 'email' | 'google' | 'facebook' | 'apple';
};

export type Message = {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  image?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
};

export type MoodEntry = {
  id: string;
  date: string; // ISO date string
  mood: 'verySad' | 'sad' | 'neutral' | 'happy' | 'veryHappy';
  notes?: string;
  createdAt: number;
};

export type TherapistProfile = {
  id: string;
  name: string;
  credentials: string;
  specialties: string[];
  bio: string;
  rating: number;
  imageUrl?: string;
  availableSlots?: Array<{
    date: string;
    time: string;
  }>;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  category: string[];
  type: 'article' | 'meditation' | 'exercise';
  content: string;
  imageUrl?: string;
};

export type Appointment = {
  id: string;
  therapistId: string;
  userId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
};
