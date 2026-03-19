// Internal content management service
// Combines API data with curated internal content

import { fetchArticles } from '@/lib/resourceAPIs';
import { GET as fetchPodcastAPI } from '@/app/api/podcasts/route';

interface ResourceAPIResponse {
  articles: Array<{
    title: string;
    description: string;
    url: string;
    urlToImage: string;
  }>;
  videos: Array<{
    id: string;
    title: string;
    thumbnail: string;
  }>;
  audio: Array<{
    id: string;
    title: string;
    duration: number;
  }>;
  quotes: Array<{
    text: string;
    author: string;
  }>;
}

interface PodcastAPIResponse {
  results: Array<{
    title_original: string;
    description_original: string;
    thumbnail: string;
    audio: string;
    audio_length_sec: number;
  }>;
}

const anxietyImg = { src: '/images/resources/anxiety.jpg' };
const depressionImg = { src: '/images/resources/depression.jpg' };
const stressImg = { src: '/images/resources/stress.jpg' };
const meditationImg = { src: '/images/resources/meditation.jpg' };
const relaxationImg = { src: '/images/resources/relaxation.jpg' };
const sleepImg = { src: '/images/resources/sleep.jpg' };
const therapyImg = { src: '/images/resources/therapy.jpg' };
const selfHelpImg = { src: '/images/resources/self-help.jpg' };

export interface InternalResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio' | 'exercise';
  category: 'anxiety' | 'depression' | 'stress' | 'meditation' | 'relaxation' | 'sleep' | 'therapy' | 'self-help';
  imageUrl: string;
  duration: number; // in minutes
  favorite: boolean;
  url: string;
  source?: string;
  isExternal: boolean;
  content?: string; // Full content for internal display
  htmlContent?: string; // HTML formatted content
  sections?: {
    title: string;
    content: string;
  }[];
}

// Curated internal content for mental health topics
const curatedContent = {
  anxiety: {
    title: "Understanding and Managing Anxiety",
    sections: [
      {
        title: "What is Anxiety?",
        content: "Anxiety is a normal and often healthy emotion. However, when a person regularly feels disproportionate levels of anxiety, it might become a medical disorder. Anxiety disorders form a category of mental health diagnoses that lead to excessive nervousness, fear, apprehension, and worry."
      },
      {
        title: "Common Symptoms",
        content: "Physical symptoms may include rapid heartbeat, sweating, trembling, shortness of breath, chest pain, nausea, and dizziness. Emotional symptoms include feelings of apprehension or dread, watching for signs of danger, anticipating the worst, and feeling restless or jumpy."
      },
      {
        title: "Coping Strategies",
        content: "Deep breathing exercises, progressive muscle relaxation, mindfulness meditation, regular exercise, adequate sleep, limiting caffeine, and maintaining social connections can help manage anxiety symptoms."
      },
      {
        title: "When to Seek Help",
        content: "Consider professional help if anxiety interferes with daily activities, lasts for extended periods, causes physical symptoms, or leads to avoidance of important situations."
      }
    ]
  },
  depression: {
    title: "Understanding Depression: Signs and Support",
    sections: [
      {
        title: "What is Depression?",
        content: "Depression is a common but serious mood disorder that causes severe symptoms affecting how you feel, think, and handle daily activities. It's more than just feeling sad or going through a rough patch."
      },
      {
        title: "Recognizing the Signs",
        content: "Persistent sad, anxious, or empty mood; feelings of hopelessness or pessimism; irritability; feelings of guilt, worthlessness, or helplessness; loss of interest in activities; fatigue; difficulty concentrating; sleep disturbances; changes in appetite."
      },
      {
        title: "Types of Depression",
        content: "Major depression, persistent depressive disorder, bipolar disorder, seasonal affective disorder, and postpartum depression are common forms, each with specific characteristics and treatment approaches."
      },
      {
        title: "Treatment Options",
        content: "Effective treatments include psychotherapy (talk therapy), medications, brain stimulation therapies, and lifestyle changes. Treatment plans should be tailored to individual needs."
      }
    ]
  },
  stress: {
    title: "Stress Management and Resilience Building",
    sections: [
      {
        title: "Understanding Stress",
        content: "Stress is the body's reaction to any change that requires an adjustment or response. While some stress is normal and even beneficial, chronic stress can negatively impact physical and mental health."
      },
      {
        title: "Stress Response",
        content: "The body responds to stress by releasing hormones like cortisol and adrenaline, which prepare you for 'fight or flight.' This response is helpful in short bursts but harmful when prolonged."
      },
      {
        title: "Management Techniques",
        content: "Regular exercise, healthy eating, adequate sleep, relaxation techniques, time management, setting boundaries, social support, and professional help when needed are effective stress management strategies."
      },
      {
        title: "Building Resilience",
        content: "Developing resilience involves building strong relationships, accepting change as part of life, setting realistic goals, taking action on problems, and maintaining perspective during difficult times."
      }
    ]
  },
  meditation: {
    title: "Mindfulness and Meditation Practices",
    sections: [
      {
        title: "What is Mindfulness?",
        content: "Mindfulness is the practice of being fully present and engaged in the moment, aware of where you are and what you're doing, without being overly reactive to what's happening around you."
      },
      {
        title: "Benefits of Meditation",
        content: "Regular meditation can reduce stress, improve focus, enhance emotional regulation, boost immune function, improve sleep quality, and increase overall well-being and life satisfaction."
      },
      {
        title: "Getting Started",
        content: "Begin with just 5-10 minutes daily. Find a quiet space, sit comfortably, focus on your breath, and gently return attention to breathing when your mind wanders. Consistency is more important than duration."
      },
      {
        title: "Types of Meditation",
        content: "Mindfulness meditation, loving-kindness meditation, body scan, walking meditation, and guided visualization are popular forms, each offering unique benefits and approaches."
      }
    ]
  },
  relaxation: {
    title: "Relaxation Techniques for Mental Wellness",
    sections: [
      {
        title: "Progressive Muscle Relaxation",
        content: "This technique involves tensing and then relaxing different muscle groups in your body. Start with your toes and work up to your head, holding tension for 5 seconds, then releasing completely."
      },
      {
        title: "Deep Breathing Exercises",
        content: "Practice diaphragmatic breathing by placing one hand on your chest and one on your belly. Breathe slowly through your nose, ensuring your belly rises more than your chest."
      },
      {
        title: "Visualization Techniques",
        content: "Create mental images of peaceful, calming scenes. Engage all your senses - imagine the sights, sounds, smells, and feelings of being in your peaceful place."
      },
      {
        title: "Quick Relaxation Methods",
        content: "Simple techniques you can use anywhere: counting breaths, the 5-4-3-2-1 grounding technique, gentle neck rolls, or brief meditation breaks throughout the day."
      }
    ]
  },
  sleep: {
    title: "Sleep Hygiene and Mental Health",
    sections: [
      {
        title: "Sleep and Mental Health Connection",
        content: "Quality sleep is essential for mental health. Poor sleep can worsen anxiety and depression, while mental health issues can disrupt sleep patterns, creating a challenging cycle."
      },
      {
        title: "Sleep Hygiene Basics",
        content: "Maintain a consistent sleep schedule, create a relaxing bedtime routine, keep your bedroom cool and dark, limit screen time before bed, and avoid caffeine late in the day."
      },
      {
        title: "Creating a Sleep-Friendly Environment",
        content: "Your bedroom should be a sanctuary for sleep. Remove work materials, use blackout curtains, maintain comfortable temperature (60-67°F), and consider white noise if needed."
      },
      {
        title: "When Sleep Problems Persist",
        content: "If sleep difficulties continue despite good sleep hygiene, consider consulting a healthcare provider. Sleep disorders like sleep apnea or insomnia may require professional treatment."
      }
    ]
  },
  therapy: {
    title: "Mental Health Therapy and Support",
    sections: [
      {
        title: "Types of Therapy",
        content: "Cognitive Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT), psychodynamic therapy, humanistic therapy, and family therapy are common approaches, each suited for different needs and conditions."
      },
      {
        title: "What to Expect",
        content: "Therapy provides a safe, confidential space to explore thoughts and feelings. Sessions typically last 45-60 minutes, and progress varies by individual and approach. Building trust with your therapist is crucial."
      },
      {
        title: "Finding the Right Therapist",
        content: "Consider factors like specialty, approach, location, insurance coverage, and personal comfort. Don't hesitate to try different therapists until you find the right fit."
      },
      {
        title: "Crisis Resources",
        content: "If you're experiencing thoughts of self-harm, contact the National Suicide Prevention Lifeline (988) or go to your nearest emergency room. Crisis support is available 24/7."
      }
    ]
  },
  "self-help": {
    title: "Self-Help and Personal Growth",
    sections: [
      {
        title: "Building Self-Awareness",
        content: "Self-awareness is the foundation of personal growth. Practice mindfulness, keep a journal, seek feedback from others, and regularly reflect on your thoughts, feelings, and behaviors."
      },
      {
        title: "Developing Healthy Habits",
        content: "Small, consistent actions create lasting change. Focus on one habit at a time, start small, track progress, celebrate successes, and be patient with setbacks."
      },
      {
        title: "Emotional Regulation Skills",
        content: "Learn to identify emotions, understand their triggers, practice healthy expression, use coping strategies like deep breathing or grounding techniques, and seek support when needed."
      },
      {
        title: "Building Resilience",
        content: "Resilience can be developed through building strong relationships, maintaining perspective during challenges, practicing self-care, developing problem-solving skills, and cultivating optimism."
      }
    ]
  }
};

class InternalContentService {
  private cache: Map<string, InternalResource[]> = new Map();
  private resourceAPICache: ResourceAPIResponse | null = null;
  private podcastCache: PodcastAPIResponse | null = null;

  async getResourcesByCategory(category: string): Promise<InternalResource[]> {
    // Check cache first
    if (this.cache.has(category)) {
      return this.cache.get(category) || [];
    }

    try {
      // Fetch articles via helper if not cached
      if (!this.resourceAPICache) {
        const articles = await fetchArticles();
        this.resourceAPICache = {
          articles: articles.map(a => ({
            title: a.title,
            description: a.description,
            url: a.url,
            urlToImage: '',
          })),
          videos: [],
          audio: [],
          quotes: [],
        };
      }

      // Fetch from podcast API if not cached
      if (!this.podcastCache) {
        const podcastResponse = await fetchPodcastAPI();
        this.podcastCache = await podcastResponse.json();
      }

      if (!this.resourceAPICache || !this.podcastCache) {
        throw new Error("API cache is null");
      }

      // Create curated resources
      const curatedResources = this.createInternalResources(category);

      // Map resourceAPI data to InternalResource
      const externalResources: InternalResource[] = (this.resourceAPICache.articles || []).map((article, index) => {
        const imageUrl = article.urlToImage && article.urlToImage.startsWith('http')
          ? article.urlToImage
          : '/images/anxiety.jpg';

        return {
          id: `external-article-${index}`,
          title: article.title,
          description: article.description || "No description available",
          type: "article",
          category: category.toLowerCase() as InternalResource["category"],
          imageUrl,
          duration: 5,
          favorite: false,
          url: article.url,
          source: "News API",
          isExternal: true,
        };
      });

      // Map podcast API data to InternalResource
      const podcastResources: InternalResource[] = (this.podcastCache.results || []).map((podcast, index) => ({
        id: `podcast-${index}`,
        title: podcast.title_original,
        description: podcast.description_original || "No description available",
        type: "audio",
        category: category.toLowerCase() as InternalResource["category"],
        imageUrl: podcast.thumbnail || "/placeholder.jpg",
        duration: Math.ceil(podcast.audio_length_sec / 60),
        favorite: false,
        url: podcast.audio,
        source: "Podcast API",
        isExternal: true
      }));

      // Filter external by category if needed
      const filteredExternal =
        category === "All"
          ? [...externalResources, ...podcastResources]
          : [...externalResources, ...podcastResources].filter(r => r.category === category.toLowerCase());

      // Merge curated + external
      const merged = [...curatedResources, ...filteredExternal];

      // Cache results
      this.cache.set(category, merged);

      return merged;
    } catch (error) {
      console.error("Error getting resources by category:", error);
      return this.createInternalResources(category); // Fallback only curated
    }
  }

  private createInternalResources(category: string): InternalResource[] {
    const resources: InternalResource[] = [];

    // Add curated content for the category
    if (category === 'All') {
      // Return resources for all categories
      Object.keys(curatedContent).forEach(cat => {
        resources.push(...this.createResourcesForCategory(cat));
      });
    } else {
      const categoryKey = category.toLowerCase() as keyof typeof curatedContent;
      if (curatedContent[categoryKey]) {
        resources.push(...this.createResourcesForCategory(categoryKey));
      }
    }

    return resources;
  }

  private createResourcesForCategory(category: string): InternalResource[] {
    const categoryData = curatedContent[category as keyof typeof curatedContent];
    if (!categoryData) return [];

    const categoryImages = {
      anxiety: anxietyImg.src,
      depression: depressionImg.src,
      stress: stressImg.src,
      meditation: meditationImg.src,
      relaxation: relaxationImg.src,
      sleep: sleepImg.src,
      therapy: therapyImg.src,
      'self-help': selfHelpImg.src
    };

    const resources: InternalResource[] = [];

    // Add comprehensive article
    resources.push({
      id: `internal-${category}-article-1`,
      title: categoryData.title,
      description: categoryData.sections[0]?.content.substring(0, 150) + '...' || 'Comprehensive guide to ' + category,
      type: 'article' as const,
      category: category as InternalResource['category'],
      imageUrl: categoryImages[category as keyof typeof categoryImages],
      duration: Math.max(5, categoryData.sections.length * 3),
      favorite: false,
      url: `/resources/${category}/guide`,
      isExternal: false,
      sections: categoryData.sections,
      htmlContent: this.generateHTMLContent(categoryData)
    });

    // Add guided video content
    resources.push({
      id: `internal-${category}-video-1`,
      title: `${categoryData.title.replace('Understanding and Managing ', '').replace('Understanding ', '')} - Video Guide`,
      description: `Watch this comprehensive video guide to learn practical techniques and strategies for managing ${category}.`,
      type: 'video' as const,
      category: category as InternalResource['category'],
      imageUrl: categoryImages[category as keyof typeof categoryImages],
      duration: 15,
      favorite: false,
      url: `/resources/${category}/video`,
      isExternal: false,
      htmlContent: `<div class="video-placeholder"><p>Video content for ${category}</p></div>`
    });

    // Add audio meditation/guide
    resources.push({
      id: `internal-${category}-audio-1`,
      title: `${categoryData.title.split(':')[0]} - Guided Audio`,
      description: `Listen to this calming audio guide designed to help you understand and manage ${category} at your own pace.`,
      type: 'audio' as const,
      category: category as InternalResource['category'],
      imageUrl: categoryImages[category as keyof typeof categoryImages],
      duration: 20,
      favorite: false,
      url: `/resources/${category}/audio`,
      isExternal: false,
      htmlContent: `<div class="audio-placeholder"><p>Audio guide for ${category}</p></div>`
    });

    // Add interactive exercises
    resources.push({
      id: `internal-${category}-exercise-1`,
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Management Exercises`,
      description: `Practice interactive exercises and techniques to build skills for managing ${category} in daily life.`,
      type: 'exercise' as const,
      category: category as InternalResource['category'],
      imageUrl: categoryImages[category as keyof typeof categoryImages],
      duration: 10,
      favorite: false,
      url: `/resources/${category}/exercises`,
      isExternal: false,
      htmlContent: `<div class="exercise-placeholder"><p>Interactive exercises for ${category}</p></div>`
    });

    return resources;
  }

  private generateHTMLContent(categoryData: { title: string; sections: { title: string; content: string }[] }): string {
    const sectionsHTML = categoryData.sections.map(section => 
      `<section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-primary">${section.title}</h2>
        <p class="text-foreground leading-relaxed">${section.content}</p>
      </section>`
    ).join('');

    return `
      <article class="max-w-4xl mx-auto prose prose-lg">
        <h1 class="text-3xl font-bold mb-8 text-primary">${categoryData.title}</h1>
        ${sectionsHTML}
      </article>
    `;
  }

  async getResourceById(id: string): Promise<InternalResource | null> {
    // Extract category from ID for internal resources
    if (id.startsWith('internal-')) {
      const parts = id.split('-');
      if (parts.length >= 3) {
        const category = parts[1];
        const resources = await this.getResourcesByCategory(category);
        return resources.find(r => r.id === id) || null;
      }
    }
    return null;
  }
}

export const internalContentService = new InternalContentService();