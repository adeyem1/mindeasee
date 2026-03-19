'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { FiCalendar, FiClock, FiChevronLeft, FiMapPin, FiVideo, FiDollarSign, FiCreditCard, FiCheck } from 'react-icons/fi';
// import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';

// Mock therapist data
const getTherapist = (id: string) => {
  return {
    id,
    name: 'Dr. Sarah Johnson',
    title: 'Clinical Psychologist',
    image: '/images/therapists/therapist1.jpg',
    price: 120,
    location: '123 Wellness Avenue, Suite 300, New York, NY 10001',
    availableSlots: [
      { date: '2023-07-15', slots: ['09:00 AM', '10:30 AM', '02:00 PM'] },
      { date: '2023-07-16', slots: ['11:00 AM', '01:30 PM', '04:00 PM'] },
      { date: '2023-07-17', slots: ['10:00 AM', '03:30 PM'] },
      { date: '2023-07-18', slots: ['09:30 AM', '11:00 AM', '02:30 PM'] },
      { date: '2023-07-19', slots: ['01:00 PM', '03:00 PM', '04:30 PM'] }
    ]
  };
};

export default function BookAppointment(props: any) {
  const { params } = props as { params: { id: string } };
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentType, setAppointmentType] = useState<'video' | 'inPerson'>('video');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insuranceId, setInsuranceId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const therapist = getTherapist(params.id);

  const handleContinue = () => {
    if (currentStep === 1 && (!selectedDate || !selectedTime)) {
      alert('Please select both a date and time for your appointment');
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      handleBookAppointment();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    } else {
      router.push(`/therapists/${params.id}`);
    }
  };

  const handleBookAppointment = async () => {
    setIsProcessing(true);
    
    try {
      // In a real app, this would send the booking request to the backend
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setBookingConfirmed(true);
  } catch {
      alert('An error occurred while booking your appointment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
      return dateString;
    }
  };

  const formatShortDate = (dateString: string) => {
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
          onClick={handleBack}
          className="flex items-center text-primary mb-4"
        >
          <FiChevronLeft className="mr-1" /> {currentStep === 1 ? 'Back to therapist profile' : 'Back'}
        </button>

        {/* Page title */}
        <h1 className="text-2xl font-bold mb-6">
          {bookingConfirmed ? 'Booking Confirmed' : 'Book an Appointment'}
        </h1>

        {bookingConfirmed ? (
          <div className="bg-card rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FiCheck className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-foreground">Your appointment is confirmed!</h2>
            <p className="mb-4 text-foreground">You are scheduled with {therapist.name} on {formatDate(selectedDate)} at {selectedTime}.</p>
            
            <div className="bg-muted rounded-lg p-4 max-w-md mx-auto mb-6">
              <div className="flex justify-between mb-2 text-foreground">
                <span>Date:</span>
                <span className="font-medium">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between mb-2 text-foreground">
                <span>Time:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between mb-2 text-foreground">
                <span>Type:</span>
                <span className="font-medium">
                  {appointmentType === 'video' ? 'Video Session' : 'In-Person Visit'}
                </span>
              </div>
              {appointmentType === 'inPerson' && (
                <div className="flex justify-between text-foreground">
                  <span>Location:</span>
                  <span className="font-medium text-right">{therapist.location}</span>
                </div>
              )}
            </div>
            
            <p className="text-muted-foreground mb-6">
              A confirmation has been sent to your email. You will receive a reminder 24 hours before your appointment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/profile/appointments')}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-secondary"
              >
                Go to My Appointments
              </button>
              <button
                onClick={() => router.push('/resources')}
                className="border border-border text-foreground px-6 py-2 rounded-md hover:bg-muted"
              >
                Browse Resources
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main booking form */}
            <div className="md:col-span-2">
              <div className="bg-card rounded-lg shadow-md overflow-hidden">
                {/* Progress steps */}
                <div className="flex border-b border-border">
                  <div className={`flex-1 py-3 px-4 text-center text-foreground ${currentStep >= 1 ? 'bg-muted' : ''}`}>
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      1
                    </span>
                    Schedule
                  </div>
                  <div className={`flex-1 py-3 px-4 text-center text-foreground ${currentStep >= 2 ? 'bg-muted' : ''}`}>
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      2
                    </span>
                    Details
                  </div>
                  <div className={`flex-1 py-3 px-4 text-center text-foreground ${currentStep >= 3 ? 'bg-muted' : ''}`}>
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      3
                    </span>
                    Payment
                  </div>
                </div>

                {/* Step content */}
                <div className="p-6">
                  {/* Step 1: Schedule */}
                  {currentStep === 1 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-foreground">Select Appointment Type</h2>
                      <div className="mb-6">
                        <div className="flex space-x-3">
                          <button
                            className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center ${
                              appointmentType === 'video'
                                ? 'bg-primary/10 text-primary border border-primary'
                                : 'bg-card border border-border text-foreground'
                            }`}
                            onClick={() => setAppointmentType('video')}
                          >
                            <FiVideo className="mr-2" /> Video Session
                          </button>
                          <button
                            className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center ${
                              appointmentType === 'inPerson'
                                ? 'bg-primary/10 text-primary border border-primary'
                                : 'bg-card border border-border text-foreground'
                            }`}
                            onClick={() => setAppointmentType('inPerson')}
                          >
                            <FiMapPin className="mr-2" /> In-Person Visit
                          </button>
                        </div>
                        
                        {appointmentType === 'inPerson' && (
                          <div className="mt-2 p-3 bg-muted rounded-md">
                            <p className="text-sm text-muted-foreground">
                              <FiMapPin className="inline mr-1" /> {therapist.location}
                            </p>
                          </div>
                        )}
                        
                        {appointmentType === 'video' && (
                          <div className="mt-2 p-3 bg-muted rounded-md">
                            <p className="text-sm text-muted-foreground">
                              <FiVideo className="inline mr-1" /> You will receive a secure video link via email before your appointment.
                            </p>
                          </div>
                        )}
                      </div>

                      <h2 className="text-xl font-semibold mb-4 text-foreground">Select Date</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                        {therapist.availableSlots.map(slot => (
                          <button
                            key={slot.date}
                            className={`py-3 px-4 text-center border rounded-md ${
                              selectedDate === slot.date
                                ? 'bg-primary/10 text-primary border-primary'
                                : 'bg-card border-border text-foreground'
                            }`}
                            onClick={() => {
                              setSelectedDate(slot.date);
                              setSelectedTime('');
                            }}
                          >
                            <FiCalendar className="mx-auto mb-2" />
                            {formatShortDate(slot.date)}
                          </button>
                        ))}
                      </div>

                      {selectedDate && (
                        <>
                          <h2 className="text-xl font-semibold mb-4 text-foreground">Select Time</h2>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {therapist.availableSlots
                              .find(slot => slot.date === selectedDate)
                              ?.slots.map(time => (
                                <button
                                  key={time}
                                  className={`py-3 px-4 text-center border rounded-md ${
                                    selectedTime === time
                                      ? 'bg-primary/10 text-primary border-primary'
                                      : 'bg-card border-border text-foreground'
                                  }`}
                                  onClick={() => setSelectedTime(time)}
                                >
                                  <FiClock className="mx-auto mb-2" />
                                  {time}
                                </button>
                              ))
                            }
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Step 2: Details */}
                  {currentStep === 2 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-foreground">Appointment Details</h2>
                      
                      {/* Appointment summary */}
                      <div className="bg-muted p-4 rounded-lg mb-6">
                        <div className="flex items-start mb-3">
                          <FiCalendar className="mt-1 mr-3 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">Date & Time</p>
                            <p className="text-foreground">{formatDate(selectedDate)} at {selectedTime}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <FiMapPin className="mt-1 mr-3 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">
                              {appointmentType === 'video' ? 'Video Session' : 'Office Location'}
                            </p>
                            <p className="text-foreground">
                              {appointmentType === 'video' 
                                ? 'A secure link will be sent to your email'
                                : therapist.location
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Insurance information */}
                      <h3 className="font-medium mb-3 text-foreground">Insurance Information (Optional)</h3>
                      <div className="mb-6">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Insurance Provider
                          </label>
                          <select
                            value={insuranceProvider}
                            onChange={(e) => setInsuranceProvider(e.target.value)}
                            className="w-full bg-card text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Select a provider</option>
                            <option value="aetna">Aetna</option>
                            <option value="bcbs">Blue Cross Blue Shield</option>
                            <option value="cigna">Cigna</option>
                            <option value="uhc">United Healthcare</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Member ID / Policy Number
                          </label>
                          <input
                            type="text"
                            value={insuranceId}
                            onChange={(e) => setInsuranceId(e.target.value)}
                            placeholder="Enter your member ID"
                            className="w-full bg-card text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        
                        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                          <p className="mb-1">
                            <span className="font-semibold">Note:</span> Insurance information is optional. If you choose not to provide it now, you can add it later.
                          </p>
                          <p>We will verify your coverage before the appointment.</p>
                        </div>
                      </div>
                      
                      {/* Health questionnaire would go here */}
                    </div>
                  )}

                  {/* Step 3: Payment */}
                  {currentStep === 3 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-foreground">Payment Information</h2>
                      
                      <div className="mb-6">
                        <h3 className="font-medium mb-3 text-foreground">Payment Options</h3>
                        <div className="space-y-3">
                          <div 
                            className={`flex items-center border rounded-md p-4 cursor-pointer ${
                              paymentMethod === 'credit' ? 'border-primary bg-primary/10' : 'border-border bg-card'
                            }`}
                            onClick={() => setPaymentMethod('credit')}
                          >
                            <input
                              type="radio"
                              id="credit"
                              checked={paymentMethod === 'credit'}
                              onChange={() => setPaymentMethod('credit')}
                              className="h-4 w-4 text-primary focus:ring-primary border-border"
                            />
                            <label htmlFor="credit" className="ml-3 flex-1 cursor-pointer">
                              <span className="block font-medium text-foreground">Credit or Debit Card</span>
                              <span className="block text-sm text-muted-foreground">Pay securely with your card</span>
                            </label>
                            <div className="flex space-x-1">
                              <div className="w-10 h-6 bg-blue-600 rounded"></div>
                              <div className="w-10 h-6 bg-red-500 rounded"></div>
                              <div className="w-10 h-6 bg-gray-800 rounded"></div>
                            </div>
                          </div>
                          
                          <div 
                            className={`flex items-center border rounded-md p-4 cursor-pointer ${
                              paymentMethod === 'insurance' ? 'border-primary bg-primary/10' : 'border-border bg-card'
                            }`}
                            onClick={() => setPaymentMethod('insurance')}
                          >
                            <input
                              type="radio"
                              id="insurance"
                              checked={paymentMethod === 'insurance'}
                              onChange={() => setPaymentMethod('insurance')}
                              className="h-4 w-4 text-primary focus:ring-primary border-border"
                            />
                            <label htmlFor="insurance" className="ml-3 flex-1 cursor-pointer">
                              <span className="block font-medium text-foreground">Insurance Only</span>
                              <span className="block text-sm text-muted-foreground">We&apos;ll bill your insurance directly</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {paymentMethod === 'credit' && (
                        <div className="mb-6">
                          <h3 className="font-medium mb-3 text-foreground">Card Details</h3>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Name on Card
                            </label>
                            <input
                              type="text"
                              placeholder="Enter name on card"
                              className="w-full bg-card text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Card Number
                            </label>
                            <input
                              type="text"
                              placeholder="**** **** **** ****"
                              className="w-full bg-card text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-1">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full bg-card text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-1">
                                CVC
                              </label>
                              <input
                                type="text"
                                placeholder="***"
                                className="w-full bg-card text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                          </div>
                          
                          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            <p>
                              <FiCreditCard className="inline-block mr-1" /> Your card will not be charged until after your appointment.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Cancellation policy */}
                      <div className="text-sm text-foreground bg-accent/10 p-3 rounded-md border border-accent/20">
                        <p className="font-medium mb-1">Cancellation Policy</p>
                        <p className="text-muted-foreground">You may cancel or reschedule up to 24 hours before your appointment without charge. Late cancellations or no-shows may incur a fee.</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-8">
                    <button
                      onClick={handleBack}
                      className="px-6 py-2 border border-border text-foreground rounded-md hover:bg-muted"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleContinue}
                      disabled={isProcessing}
                      className={`px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-secondary disabled:opacity-70 disabled:cursor-not-allowed flex items-center`}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : currentStep === 3 ? (
                        'Complete Booking'
                      ) : (
                        'Continue'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking summary sidebar */}
            <div className="md:col-span-1">
              <div className="bg-card rounded-lg shadow-md p-5 sticky top-5">
                <h2 className="text-lg font-semibold mb-4 text-foreground">Appointment Summary</h2>
                
                  <Image
                    src={therapist.image || '/images/therapists/default.jpg'}
                    alt={therapist.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="font-medium text-foreground">{therapist.name}</p>
                    <p className="text-sm text-muted-foreground">{therapist.title}</p>
                  </div>
                </div>
                
                <div className="border-t border-border pt-3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Session Type:</span>
                    <span className="text-foreground">{appointmentType === 'video' ? 'Video Call' : 'In-Person'}</span>
                  </div>
                  
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="text-foreground">{formatShortDate(selectedDate)}</span>
                    </div>
                  )}
                  
                  {selectedTime && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="text-foreground">{selectedTime}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-b border-border py-3 mt-3 mb-3">
                  <div className="flex justify-between font-medium text-foreground">
                    <span>Session Fee:</span>
                    <span>${therapist.price}</span>
                  </div>
                  {insuranceProvider && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Insurance coverage will be verified
                    </div>
                  )}
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  <FiDollarSign className="inline mr-1" />
                  No charge until after your appointment
                </div>
              </div>
            </div>
        )}
      </div>
    </UnifiedLayout>
  );
}
