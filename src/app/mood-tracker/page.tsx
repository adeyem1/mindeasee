import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import MoodTrackerClient from '@/components/mood/MoodTrackerClient';

export default function MoodTrackerPage() {
  return (
    <UnifiedLayout>
      <MoodTrackerClient />
    </UnifiedLayout>
  );
}