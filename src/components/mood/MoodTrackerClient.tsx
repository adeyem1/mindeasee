"use client";

import React, { useState, useEffect } from 'react';
import { MoodEntry } from '@/types';

export default function MoodTrackerClient() {
  const [selectedMood, setSelectedMood] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);

  const availableActivities = [
    'Work', 'Exercise', 'Social', 'Family', 'Hobbies', 'Rest', 
    'Study', 'Travel', 'Meditation', 'Outdoors', 'Cooking', 'Reading'
  ];

  const moods = [
    { value: 'verySad', label: 'Very Sad', emoji: '😢', color: 'text-red-500' },
    { value: 'sad', label: 'Sad', emoji: '😞', color: 'text-orange-500' },
    { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'text-yellow-500' },
    { value: 'happy', label: 'Happy', emoji: '😊', color: 'text-green-500' },
    { value: 'veryHappy', label: 'Very Happy', emoji: '😄', color: 'text-green-600' }
  ];

  useEffect(() => {
    const mockHistory: MoodEntry[] = [
      {
        id: '1',
        date: '2024-01-15',
        mood: 'happy',
        notes: 'Great day at work!',
        createdAt: Date.now() - 86400000
      },
      {
        id: '2', 
        date: '2024-01-14',
        mood: 'neutral',
        notes: 'Regular day',
        createdAt: Date.now() - 172800000
      }
    ];
    setMoodHistory(mockHistory);
  }, []);

  const handleActivityToggle = (activity: string) => {
    if (activities.includes(activity)) {
      setActivities(activities.filter(a => a !== activity));
    } else {
      setActivities([...activities, activity]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      alert('Please select a mood');
      return;
    }
    setIsSubmitting(true);
    try {
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        mood: selectedMood as MoodEntry['mood'],
        notes,
        createdAt: Date.now()
      };

      setMoodHistory([newEntry, ...moodHistory]);
      setSelectedMood('');
      setActivities([]);
      setNotes('');
      alert('Mood entry saved successfully!');
    } catch (error) {
      console.error('Error saving mood entry:', error);
      alert('Failed to save mood entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodEmoji = (mood: string) => {
    return moods.find(m => m.value === mood)?.emoji || '😐';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-2 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mood Tracker</h1>
        <p className="text-muted-foreground">Track your daily mood and see patterns over time</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-6">How are you feeling today?</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {moods.map((mood) => (
            <button
              key={mood.value}
              type="button"
              onClick={() => setSelectedMood(mood.value)}
              className={`p-4 rounded-lg border transition-all ${
                selectedMood === mood.value
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-3xl mb-2">{mood.emoji}</div>
              <div className="text-sm font-medium">{mood.label}</div>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">What did you do today?</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {availableActivities.map((activity) => (
              <button
                key={activity}
                type="button"
                onClick={() => handleActivityToggle(activity)}
                className={`p-2 rounded-md text-sm transition-all ${
                  activities.includes(activity)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {activity}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
            rows={3}
            placeholder="How was your day? Any thoughts or reflections..."
          />
        </div>

        <button
          type="submit"
          disabled={!selectedMood || isSubmitting}
          className={`w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        >
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </button>
      </form>

      <div className="bg-card rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Your Mood History</h2>
        {moodHistory.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No mood entries yet. Start by tracking your mood above!</p>
        ) : (
          <div className="space-y-4">
            {moodHistory.map((entry) => (
              <div key={entry.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    <div>
                      <div className="font-medium">{moods.find(m => m.value === entry.mood)?.label}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(entry.date)}</div>
                    </div>
                  </div>
                </div>
                {entry.notes && (
                  <div className="mt-2 text-muted-foreground">
                    <p>{entry.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
