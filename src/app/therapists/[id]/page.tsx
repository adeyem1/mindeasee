'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { FiStar, FiClock, FiMapPin, FiTag, FiCalendar, FiDollarSign, FiCheckCircle, FiChevronLeft, FiVideo } from 'react-icons/fi';

// Mock therapist data - in a real app, this would come from a database lookup
const therapist = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  title: 'Clinical Psychologist',
  image: '/images/therapists/therapist1.jpg',
  specialties: ['Anxiety', 'Depression', 'Trauma'],
  rating: 4.9,
  reviewCount: 128,
  online: true,
  inPerson: true,
  experience: 12,
  description: 'Dr. Johnson specializes in cognitive behavioral therapy with 12+ years of experience helping clients overcome anxiety and depression.',
  bio: `Dr. Sarah Johnson is a licensed Clinical Psychologist with over 12 years of experience in private practice and hospital settings. She received her Ph.D. in Clinical Psychology from Stanford University and completed her postdoctoral fellowship at the Anxiety and Depression Research Center.

Dr. Johnson specializes in evidence-based treatments for anxiety, depression, and trauma. Her therapeutic approach combines Cognitive Behavioral Therapy (CBT), Acceptance and Commitment Therapy (ACT), and mindfulness techniques. She believes in creating a warm, collaborative relationship with her clients and tailoring treatment to each person's unique needs and goals.

In addition to her clinical work, Dr. Johnson has published several research papers on anxiety treatment outcomes and regularly presents at national psychological conferences. She is an active member of the American Psychological Association and serves as a clinical supervisor for psychology doctoral students.`,
  education: [
    'Ph.D. Clinical Psychology, Stanford University',
    'M.A. Psychology, University of California, Berkeley',
    'B.A. Psychology, Yale University, Summa Cum Laude'
  ],
  nextAvailable: '2023-07-15T10:00:00',
  location: 'New York, NY',
  locationDetails: '123 Wellness Avenue, Suite 300, New York, NY 10001',
  acceptingNew: true,
  insurances: ['Aetna', 'Blue Cross', 'United Healthcare'],
  price: '$120-150',
  languages: ['English', 'Spanish'],
  testimonials: [
    {
      id: '1',
      text: 'Dr. Johnson helped me overcome my anxiety that I\'d been struggling with for years. Her approach was practical and compassionate.',
      author: 'Michael R.',
      rating: 5
    },
    {
      id: '2',
      text: 'I appreciate how Dr. Johnson combines evidence-based techniques with genuine care and understanding. She truly listens.',
      author: 'Jennifer T.',
      rating: 5
    },
    {
      id: '3',
      text: 'After trying several therapists, I finally found Dr. Johnson who has helped me make real progress with my depression.',
      author: 'David L.',
      rating: 4
    }
  ],
  availableSlots: [
    { date: '2023-07-15', slots: ['09:00 AM', '10:30 AM', '02:00 PM'] },
    { date: '2023-07-16', slots: ['11:00 AM', '01:30 PM', '04:00 PM'] },
    { date: '2023-07-17', slots: ['10:00 AM', '03:30 PM'] },
    { date: '2023-07-18', slots: ['09:30 AM', '11:00 AM', '02:30 PM'] },
    { date: '2023-07-19', slots: ['01:00 PM', '03:00 PM', '04:30 PM'] }
  ]
};

function isPromiseLike<T>(value: unknown): value is Promise<T> {
  return !!value && typeof (value as { then?: unknown }).then === 'function';
}

function useUnwrappedParams<T>(params: T | Promise<T>): T {
  const reactWithUse = React as unknown as { use?: <U>(p: Promise<U>) => U };
  if (isPromiseLike<T>(params) && typeof reactWithUse.use === 'function') {
    return reactWithUse.use(params);
  }
  return params as T;
}

export default function TherapistDetail(props: any) {
  const { params } = props as { params: { id: string } | Promise<{ id: string }> };
  const router = useRouter();
  const { id } = useUnwrappedParams(params);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState<'video' | 'inPerson'>('video');

  const handleBookAppointment = () => {
    router.push(`/therapists/${id}/book`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <UnifiedLayout>
      <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => router.push('/therapists')}
        className="flex items-center text-primary mb-4"
      >
        <FiChevronLeft className="mr-1" /> Back to therapists
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Therapist header */}
        <div className="p-6 md:p-8 border-b">
        <div className="flex flex-col md:flex-row">
          {/* Therapist image */}
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-8">
          <Image
            src={therapist.image || '/images/therapists/default.jpg'}
            alt={therapist.name}
            className="w-48 h-48 object-cover rounded-md"
            width={192}
            height={192}
            onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (!target.src.endsWith('/images/therapists/default.jpg')) {
              target.src = '/images/therapists/default.jpg';
            }
            }}
          />
          </div>

          {/* Therapist info */}
          <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
            <h1 className="text-2xl md:text-3xl font-bold">{therapist.name}</h1>
            <p className="text-lg text-gray-600 mb-2">{therapist.title}</p>

            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FiStar
                key={i}
                className={`${
                  i < Math.floor(therapist.rating)
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
                } w-4 h-4`}
                />
              ))}
              </div>
              <span className="ml-1 text-sm font-medium text-gray-600">
              {therapist.rating} ({therapist.reviewCount} reviews)
              </span>
            </div>
            </div>

            {therapist.acceptingNew ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-3 md:mb-0">
              <FiCheckCircle className="mr-1" /> Accepting new patients
            </span>
            ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Waitlist only
            </span>
            )}
          </div>

          {/* Location and experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-4">
            <div className="flex items-center">
            <FiMapPin className="text-gray-400 mr-2" />
            <span>{therapist.location}</span>
            </div>
            <div className="flex items-center">
            <FiClock className="text-gray-400 mr-2" />
            <span>{therapist.experience} years experience</span>
            </div>
          </div>

          {/* Specialties */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
            {therapist.specialties.map((specialty) => (
              <span
              key={specialty}
              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800"
              >
              <FiTag className="mr-1" /> {specialty}
              </span>
            ))}
            </div>
          </div>

          {/* Brief description */}
          <p className="text-gray-600">{therapist.description}</p>
          </div>
        </div>
        </div>

        {/* Tabs for different sections */}
        <div className="grid md:grid-cols-3 gap-6 p-6 md:p-8">
        <div className="md:col-span-2">
          {/* About section */}
          <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <div className="prose max-w-none">
            {therapist.bio.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
            ))}
          </div>
          </div>

          {/* Education */}
          <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Education</h2>
          <ul className="space-y-2">
            {therapist.education.map((education, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 mr-2 bg-indigo-100 text-primary rounded-full">
              •
              </span>
              {education}
            </li>
            ))}
          </ul>
          </div>

          {/* Languages */}
          <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Languages</h2>
          <div className="flex flex-wrap gap-2">
            {therapist.languages.map((language) => (
            <span
              key={language}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
            >
              {language}
            </span>
            ))}
          </div>
          </div>

          {/* Testimonials */}
          <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Patient Reviews</h2>
          <div className="space-y-4">
            {therapist.testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <FiStar
                key={i}
                className={`${
                  i < testimonial.rating
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
                } w-4 h-4`}
                />
              ))}
              </div>
              <p className="text-gray-600 mb-2">&quot;{testimonial.text}&quot;</p>
              <p className="text-sm font-medium">— {testimonial.author}</p>
            </div>
            ))}
          </div>
          </div>
        </div>

        {/* Booking sidebar */}
        <div>
          <div className="bg-gray-50 rounded-lg p-5 sticky top-5">
          <h2 className="text-xl font-semibold mb-4">Book an Appointment</h2>

          {/* Insurance and pricing info */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
            <FiDollarSign className="text-gray-500 mr-2" />
            <span className="font-medium">Session Fee:</span>
            <span className="ml-1">{therapist.price}</span>
            </div>
            <div>
            <span className="font-medium mr-1">Insurance:</span>
            <span>{therapist.insurances.join(', ')}</span>
            </div>
          </div>

          {/* Appointment type selection */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-2">Appointment Type</h3>
            <div className="flex space-x-3">
            <button
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
              selectedType === 'video'
                ? 'bg-indigo-100 text-primary border border-indigo-300'
                : 'bg-white border border-gray-300'
              }`}
              onClick={() => setSelectedType('video')}
              disabled={!therapist.online}
            >
              <FiVideo className="mr-2" /> Video
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
              selectedType === 'inPerson'
                ? 'bg-indigo-100 text-primary border border-indigo-300'
                : 'bg-white border border-gray-300'
              }`}
              onClick={() => setSelectedType('inPerson')}
              disabled={!therapist.inPerson}
            >
              <FiMapPin className="mr-2" /> In-Person
            </button>
            </div>
            {selectedType === 'inPerson' && (
            <p className="text-sm text-gray-600 mt-2">
              <FiMapPin className="inline mr-1" /> {therapist.locationDetails}
            </p>
            )}
          </div>

          {/* Date selection */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-2">Select Date</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {therapist.availableSlots.map((slot) => (
              <button
              key={slot.date}
              className={`py-2 px-1 text-sm border rounded-md ${
                selectedDate === slot.date
                ? 'bg-indigo-100 text-primary border-indigo-300'
                : 'bg-white border-gray-300'
              }`}
              onClick={() => {
                setSelectedDate(slot.date);
                setSelectedTime('');
              }}
              >
              <FiCalendar className="mx-auto mb-1" />
              {formatDate(slot.date)}
              </button>
            ))}
            </div>
          </div>

          {/* Time selection */}
          {selectedDate && (
            <div className="mb-6">
            <h3 className="text-md font-medium mb-2">Select Time</h3>
            <div className="grid grid-cols-3 gap-2">
              {therapist.availableSlots
              .find((slot) => slot.date === selectedDate)
              ?.slots.map((time) => (
                <button
                key={time}
                className={`py-2 px-1 text-sm border rounded-md ${
                  selectedTime === time
                  ? 'bg-indigo-100 text-primary border-indigo-300'
                  : 'bg-white border-gray-300'
                }`}
                onClick={() => setSelectedTime(time)}
                >
                <FiClock className="mx-auto mb-1" />
                {time}
                </button>
              ))}
            </div>
            </div>
          )}

          {/* Book button */}
          <button
            onClick={handleBookAppointment}
            disabled={!selectedDate || !selectedTime}
            className={`w-full py-3 px-4 rounded-md font-medium text-white ${
            !selectedDate || !selectedTime
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-secondary'
            }`}
          >
            Book Appointment
          </button>

          <p className="text-xs text-gray-500 text-center mt-2">
            You won&#39;t be charged until after your appointment
          </p>
          </div>
        </div>
        </div>
      </div>
      </div>
    </UnifiedLayout>
  );
}
