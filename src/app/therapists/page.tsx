'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { BackButton } from '@/components/ui/back-button';
import { FiSearch, FiFilter, FiStar, FiDollarSign, FiMapPin } from 'react-icons/fi';

// Mock therapist data
const therapistsData = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    title: 'Clinical Psychologist',
    specialties: ['Anxiety', 'Depression', 'Trauma'],
    rating: 4.9,
    reviewCount: 124,
    imageUrl: '/images/therapists/therapist1.jpg',
    languages: ['English', 'Spanish'],
    bio: 'Dr. Johnson has 15 years of experience helping clients overcome anxiety and depression. She specializes in cognitive-behavioral therapy and mindfulness-based approaches.',
    availability: ['Mon', 'Wed', 'Fri'],
    price: {
      amount: 120,
      currency: 'USD',
      per: 'session'
    }
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    title: 'Psychiatrist',
    specialties: ['Mood Disorders', 'ADHD', 'Medication Management'],
    rating: 4.7,
    reviewCount: 98,
    imageUrl: '/images/therapists/therapist2.jpg',
    languages: ['English', 'Mandarin'],
    bio: 'Dr. Chen combines medication management with therapeutic approaches to provide comprehensive care for his patients. He specializes in treating complex mood disorders.',
    availability: ['Tue', 'Thu', 'Sat'],
    price: {
      amount: 150,
      currency: 'USD',
      per: 'session'
    }
  },
  {
    id: '3',
    name: 'Jennifer Lopez',
    title: 'Licensed Counselor',
    specialties: ['Relationships', 'Family Therapy', 'Grief'],
    rating: 4.8,
    reviewCount: 87,
    imageUrl: '/images/therapists/therapist3.jpg',
    languages: ['English', 'Spanish'],
    bio: 'Jennifer creates a warm, supportive environment for her clients as they work through relationship challenges, family conflicts, and grief. Her approach is compassionate and solution-focused.',
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    price: {
      amount: 90,
      currency: 'USD',
      per: 'session'
    }
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    title: 'Neuropsychologist',
    specialties: ['Trauma', 'PTSD', 'Cognitive Rehabilitation'],
    rating: 4.6,
    reviewCount: 56,
    imageUrl: '/images/therapists/therapist4.jpg',
    languages: ['English'],
    bio: 'Dr. Wilson specializes in trauma-informed care and PTSD treatment. His background in neuropsychology allows him to take a brain-based approach to mental health treatment.',
    availability: ['Wed', 'Thu', 'Fri'],
    price: {
      amount: 135,
      currency: 'USD',
      per: 'session'
    }
  },
  {
    id: '5',
    name: 'Maria Rodriguez',
    title: 'Art Therapist',
    specialties: ['Anxiety', 'Depression', 'Self-Expression'],
    rating: 4.9,
    reviewCount: 43,
    imageUrl: '/images/therapists/therapist5.jpg',
    languages: ['English', 'Spanish'],
    bio: 'Maria uses creative expression and art therapy to help clients process emotions, reduce stress, and increase self-awareness. Her gentle approach is especially helpful for those who find traditional talk therapy challenging.',
    availability: ['Mon', 'Wed', 'Fri'],
    price: {
      amount: 100,
      currency: 'USD',
      per: 'session'
    }
  },
  {
    id: '6',
    name: 'Dr. Robert Kim',
    title: 'Clinical Psychologist',
    specialties: ['Addiction', 'Substance Abuse', 'Recovery'],
    rating: 4.8,
    reviewCount: 76,
    imageUrl: '/images/therapists/therapist6.jpg',
    languages: ['English', 'Korean'],
    bio: 'Dr. Kim has dedicated his career to helping individuals overcome addiction and substance abuse. His evidence-based approaches combine cognitive-behavioral therapy with motivational interviewing.',
    availability: ['Tue', 'Thu', 'Sat'],
    price: {
      amount: 125,
      currency: 'USD',
      per: 'session'
    }
  }
];

// Available filter categories
const specialtyOptions = ['Anxiety', 'Depression', 'Trauma', 'Relationships', 'Addiction', 'ADHD', 'Mood Disorders', 'PTSD', 'Family Therapy', 'Grief'];
const languageOptions = ['English', 'Spanish', 'Mandarin', 'Korean'];

export default function TherapistsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    specialties: [] as string[],
    languages: [] as string[],
    priceRange: 'all', // 'all', 'low', 'medium', 'high'
    availability: [] as string[]
  });

  // Filter therapists based on search term and filters
  const filteredTherapists = therapistsData.filter(therapist => {
    // Search filter
    if (searchTerm && !therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !therapist.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Specialty filter
    if (filters.specialties.length > 0 && 
        !therapist.specialties.some(s => filters.specialties.includes(s))) {
      return false;
    }
    
    // Language filter
    if (filters.languages.length > 0 && 
        !therapist.languages.some(l => filters.languages.includes(l))) {
      return false;
    }
    
    // Price filter
    if (filters.priceRange !== 'all') {
      if (filters.priceRange === 'low' && therapist.price.amount > 100) return false;
      if (filters.priceRange === 'medium' && (therapist.price.amount < 100 || therapist.price.amount > 130)) return false;
      if (filters.priceRange === 'high' && therapist.price.amount < 130) return false;
    }
    
    // Availability filter
    if (filters.availability.length > 0 && 
        !therapist.availability.some(a => filters.availability.includes(a))) {
      return false;
    }
    
    return true;
  });

  const toggleSpecialty = (specialty: string) => {
    setFilters(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty) 
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const toggleLanguage = (language: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const toggleAvailability = (day: string) => {
    setFilters(prev => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter(d => d !== day)
        : [...prev.availability, day]
    }));
  };

  const clearFilters = () => {
    setFilters({
      specialties: [],
      languages: [],
      priceRange: 'all',
      availability: []
    });
  };

  const viewTherapistProfile = (therapist: any) => {
    router.push(`/therapists/${therapist.id}`);
  };

  const scheduleConsultation = (id: string) => {
    router.push(`/therapists/${id}/book`);
  };

  return (
    <UnifiedLayout>
      <div className="container mx-auto px-4 py-8">
        
        <h1 className="text-3xl font-bold mb-2">Find a Therapist</h1>
        <p className="text-gray-600 mb-6">
          Connect with licensed mental health professionals who can provide the support you need.
        </p>

        {/* Search and filter bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="relative flex-grow mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or specialty"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 bg-indigo-50 text-primary rounded-md hover:bg-indigo-100"
            >
              <FiFilter className="mr-2" />
              Filters {filters.specialties.length + filters.languages.length + (filters.priceRange !== 'all' ? 1 : 0) + filters.availability.length > 0 && `(${filters.specialties.length + filters.languages.length + (filters.priceRange !== 'all' ? 1 : 0) + filters.availability.length})`}
            </button>
          </div>

          {/* Filter options */}
          {showFilters && (
            <div className="mt-4 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Specialties */}
                <div>
                  <h3 className="font-medium mb-2">Specialties</h3>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {specialtyOptions.map((specialty, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`specialty-${index}`}
                          checked={filters.specialties.includes(specialty)}
                          onChange={() => toggleSpecialty(specialty)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor={`specialty-${index}`} className="ml-2 text-sm text-gray-700">
                          {specialty}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="font-medium mb-2">Languages</h3>
                  <div className="space-y-1">
                    {languageOptions.map((language, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`language-${index}`}
                          checked={filters.languages.includes(language)}
                          onChange={() => toggleLanguage(language)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor={`language-${index}`} className="ml-2 text-sm text-gray-700">
                          {language}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-all"
                        name="price"
                        checked={filters.priceRange === 'all'}
                        onChange={() => setFilters(prev => ({ ...prev, priceRange: 'all' }))}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label htmlFor="price-all" className="ml-2 text-sm text-gray-700">
                        All prices
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-low"
                        name="price"
                        checked={filters.priceRange === 'low'}
                        onChange={() => setFilters(prev => ({ ...prev, priceRange: 'low' }))}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label htmlFor="price-low" className="ml-2 text-sm text-gray-700">
                        $ (Under $100)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-medium"
                        name="price"
                        checked={filters.priceRange === 'medium'}
                        onChange={() => setFilters(prev => ({ ...prev, priceRange: 'medium' }))}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label htmlFor="price-medium" className="ml-2 text-sm text-gray-700">
                        $$ ($100-$130)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-high"
                        name="price"
                        checked={filters.priceRange === 'high'}
                        onChange={() => setFilters(prev => ({ ...prev, priceRange: 'high' }))}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label htmlFor="price-high" className="ml-2 text-sm text-gray-700">
                        $$$ (Over $130)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-medium mb-2">Availability</h3>
                  <div className="space-y-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`day-${index}`}
                          checked={filters.availability.includes(day)}
                          onChange={() => toggleAvailability(day)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor={`day-${index}`} className="ml-2 text-sm text-gray-700">
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-indigo-800"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Therapist list */}
        <div className="space-y-6">
          {filteredTherapists.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-600">No therapists found matching your criteria.</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredTherapists.map(therapist => (
              <div key={therapist.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 flex justify-center md:justify-start mb-4 md:mb-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden">
                      <img
                        src={therapist.imageUrl || '/images/therapists/default.jpg'}
                        alt={therapist.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/therapists/default.jpg';
                        }}
                      />
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <h2 className="text-xl font-bold">{therapist.name}</h2>
                        <p className="text-gray-600">{therapist.title}</p>
                        <div className="flex items-center mt-1">
                          <FiStar className="text-yellow-500 fill-current" />
                          <span className="ml-1 text-gray-800">{therapist.rating}</span>
                          <span className="ml-1 text-gray-500">({therapist.reviewCount} reviews)</span>
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0 text-right">
                        <div className="text-gray-700 font-medium">
                          ${therapist.price.amount}/{therapist.price.per}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {therapist.languages.join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {therapist.specialties.map((specialty, index) => (
                          <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                            {specialty}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-700 line-clamp-2 mb-4">
                        {therapist.bio}
                      </p>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => viewTherapistProfile(therapist)}
                          className="text-primary hover:text-indigo-800"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => scheduleConsultation(therapist.id)}
                          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </UnifiedLayout>
  );
}
