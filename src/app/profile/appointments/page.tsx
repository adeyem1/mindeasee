'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { BackButton } from '@/components/ui/back-button';
import { useAuthStore } from '@/store/authStore';
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiVideo,
  FiMoreVertical,
  FiMessageCircle,
  FiFileText,
  FiXCircle,
  FiCheckCircle,
  FiChevronRight,
  FiSearch,
  FiFilter,
  FiDownload
} from 'react-icons/fi';

// Mock appointments data
const mockAppointments = [
  {
    id: 'apt-1',
    therapistId: '1',
    therapistName: 'Dr. Sarah Johnson',
    therapistTitle: 'Clinical Psychologist',
    therapistImage: '/images/therapists/therapist1.jpg',
    date: '2023-07-15',
    time: '10:30 AM',
    type: 'video',
    status: 'upcoming',
    notes: '',
  },
  {
    id: 'apt-2',
    therapistId: '2',
    therapistName: 'Dr. Michael Chen',
    therapistTitle: 'Psychiatrist',
    therapistImage: '/images/therapists/therapist2.jpg',
    date: '2023-06-25',
    time: '02:00 PM',
    type: 'inPerson',
    status: 'completed',
    notes: 'Follow-up appointment in 3 weeks',
  },
  {
    id: 'apt-3',
    therapistId: '3',
    therapistName: 'Jennifer Lopez',
    therapistTitle: 'Licensed Counselor',
    therapistImage: '/images/therapists/therapist3.jpg',
    date: '2023-07-22',
    time: '11:00 AM',
    type: 'video',
    status: 'upcoming',
    notes: '',
  },
  {
    id: 'apt-4',
    therapistId: '1',
    therapistName: 'Dr. Sarah Johnson',
    therapistTitle: 'Clinical Psychologist',
    therapistImage: '/images/therapists/therapist1.jpg',
    date: '2023-06-10',
    time: '09:30 AM',
    type: 'video',
    status: 'completed',
    notes: 'Discussed anxiety management techniques',
  },
  {
    id: 'apt-5',
    therapistId: '4',
    therapistName: 'Dr. James Wilson',
    therapistTitle: 'Neuropsychologist',
    therapistImage: '/images/therapists/therapist4.jpg',
    date: '2023-08-05',
    time: '01:30 PM',
    type: 'inPerson',
    status: 'upcoming',
    notes: 'Initial consultation',
  }
];

export default function AppointmentsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [filter, setFilter] = useState('all'); // all, upcoming, completed
  const [searchTerm, setSearchTerm] = useState('');
  const [appointmentMenuOpen, setAppointmentMenuOpen] = useState<string | null>(null);
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  // Get filtered appointments
  const getFilteredAppointments = () => {
    return mockAppointments
      .filter(appointment => {
        // Filter by status
        if (filter === 'upcoming' && appointment.status !== 'upcoming') return false;
        if (filter === 'completed' && appointment.status !== 'completed') return false;
        
        // Filter by search term
        if (searchTerm && !appointment.therapistName.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort by date (upcoming first)
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        
        if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
        if (a.status !== 'upcoming' && b.status === 'upcoming') return 1;
        
        return dateA.getTime() - dateB.getTime();
      });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };
  
  // Check if appointment is today
  const isToday = (dateString: string) => {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    
    return today.getDate() === appointmentDate.getDate() &&
      today.getMonth() === appointmentDate.getMonth() &&
      today.getFullYear() === appointmentDate.getFullYear();
  };
  
  // Handle reschedule
  const handleReschedule = (appointmentId: string) => {
    const appointment = mockAppointments.find(a => a.id === appointmentId);
    if (appointment) {
      router.push(`/therapists/${appointment.therapistId}/book`);
    }
  };
  
  // Handle cancel
  const handleCancelConfirm = (appointmentId: string) => {
    // In a real app, this would send a cancel request to the backend
    alert(`Appointment ${appointmentId} cancelled`);
    setConfirmCancelId(null);
  };
  
  // Close all menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setAppointmentMenuOpen(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const filteredAppointments = getFilteredAppointments();

  return (
    <UnifiedLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton href="/profile" />
        </div>
        <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
        
        {/* Filters and search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md ${
                  filter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-md ${
                  filter === 'upcoming'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-md ${
                  filter === 'completed'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Past
              </button>
            </div>
            
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search appointments"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Appointments list */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <FiCalendar className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">No appointments found</h2>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You don't have any appointments scheduled yet." 
                : filter === 'upcoming'
                  ? "You don't have any upcoming appointments."
                  : "You don't have any past appointments."
              }
            </p>
            <button
              onClick={() => router.push('/therapists')}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
            >
              Find a Therapist
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                  appointment.status === 'completed' ? 'border-l-4 border-gray-300' : 'border-l-4 border-green-500'
                }`}
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => setActiveAppointmentId(
                    activeAppointmentId === appointment.id ? null : appointment.id
                  )}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center">
                      <img
                        src={appointment.therapistImage || '/images/therapists/default.jpg'}
                        alt={appointment.therapistName}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/therapists/default.jpg';
                        }}
                      />
                      <div>
                        <h3 className="font-semibold">{appointment.therapistName}</h3>
                        <p className="text-gray-600 text-sm">{appointment.therapistTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center mt-4 md:mt-0">
                      {isToday(appointment.date) && appointment.status === 'upcoming' && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full mr-2">
                          Today
                        </span>
                      )}

                      <div className="flex flex-col md:items-end flex-grow">
                        <div className="flex items-center text-sm">
                          <FiCalendar className="text-gray-500 mr-1" />
                          <span>{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <FiClock className="text-gray-500 mr-1" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                      
                      <div className="ml-4 relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setAppointmentMenuOpen(
                              appointmentMenuOpen === appointment.id ? null : appointment.id
                            );
                          }}
                          className="p-2 rounded-full hover:bg-gray-100"
                        >
                          <FiMoreVertical />
                        </button>
                        
                        {/* Dropdown menu */}
                        {appointmentMenuOpen === appointment.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                            <div className="py-1">
                              {appointment.status === 'upcoming' && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Join video call - In a real app, this would open the video call
                                      if (appointment.type === 'video') {
                                        window.open('https://meet.example.com/123456', '_blank');
                                      }
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    disabled={appointment.type !== 'video'}
                                  >
                                    <FiVideo className="mr-2" /> Join Video Call
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReschedule(appointment.id);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                  >
                                    <FiCalendar className="mr-2" /> Reschedule
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setConfirmCancelId(appointment.id);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                  >
                                    <FiXCircle className="mr-2" /> Cancel
                                  </button>
                                </>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/therapists/${appointment.therapistId}`);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <FiFileText className="mr-2" /> View Therapist Profile
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // In a real app, this would send a message to the therapist
                                  alert('Messaging feature will be implemented soon!');
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <FiMessageCircle className="mr-2" /> Message
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Expand/collapse indicator */}
                      <FiChevronRight 
                        className={`ml-2 transform transition-transform ${
                          activeAppointmentId === appointment.id ? 'rotate-90' : 'rotate-0'
                        }`} 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Expanded details */}
                {activeAppointmentId === appointment.id && (
                  <div className="px-4 pb-4 pt-2 border-t">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Appointment Details</h4>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div className="text-gray-600">Date:</div>
                            <div>{formatDate(appointment.date)}</div>
                            
                            <div className="text-gray-600">Time:</div>
                            <div>{appointment.time}</div>
                            
                            <div className="text-gray-600">Type:</div>
                            <div className="flex items-center">
                              {appointment.type === 'video' ? (
                                <>
                                  <FiVideo className="mr-1" /> Video Session
                                </>
                              ) : (
                                <>
                                  <FiMapPin className="mr-1" /> In-Person
                                </>
                              )}
                            </div>
                            
                            <div className="text-gray-600">Status:</div>
                            <div>
                              {appointment.status === 'upcoming' ? (
                                <span className="text-green-600 flex items-center">
                                  <FiCheckCircle className="mr-1" /> Confirmed
                                </span>
                              ) : (
                                <span className="text-gray-600 flex items-center">
                                  <FiCheckCircle className="mr-1" /> Completed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Notes</h4>
                            <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-md">
                              {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Quick Actions</h4>
                        <div className="space-y-2">
                          {appointment.status === 'upcoming' ? (
                            <>
                              {appointment.type === 'video' && (
                                <button className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-secondary flex items-center justify-center">
                                  <FiVideo className="mr-2" /> Join Video Session
                                </button>
                              )}
                              <button 
                                onClick={() => handleReschedule(appointment.id)}
                                className="w-full py-2 px-4 border border-primary text-primary rounded-md hover:bg-indigo-50 flex items-center justify-center"
                              >
                                <FiCalendar className="mr-2" /> Reschedule
                              </button>
                              <button
                                onClick={() => setConfirmCancelId(appointment.id)}
                                className="w-full py-2 px-4 border border-red-600 text-red-600 rounded-md hover:bg-red-50 flex items-center justify-center"
                              >
                                <FiXCircle className="mr-2" /> Cancel Appointment
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleReschedule(appointment.id)}
                                className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-secondary flex items-center justify-center"
                              >
                                <FiCalendar className="mr-2" /> Book Follow-up
                              </button>
                              <button className="w-full py-2 px-4 border border-primary text-primary rounded-md hover:bg-indigo-50 flex items-center justify-center">
                                <FiFileText className="mr-2" /> View Session Notes
                              </button>
                              <button className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center">
                                <FiDownload className="mr-2" /> Download Receipt
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Confirmation dialog */}
                {confirmCancelId === appointment.id && (
                  <div className="px-4 pb-4 pt-2 border-t bg-red-50">
                    <div className="text-center">
                      <h4 className="font-medium mb-2">Cancel Appointment?</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Are you sure you want to cancel your appointment on {formatDate(appointment.date)} at {appointment.time}?
                      </p>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => setConfirmCancelId(null)}
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                        >
                          No, Keep It
                        </button>
                        <button
                          onClick={() => handleCancelConfirm(appointment.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Yes, Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Add new appointment button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/therapists')}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary"
          >
            Find a Therapist
          </button>
        </div>
      </div>
    </UnifiedLayout>
  );
}
