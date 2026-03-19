interface HealthGovTopic {
  Id: number;
  Title: string;
  Categories?: string;
  Populations?: string;
  LastUpdate?: string;
  ImageUrl?: string;
  ImageAlt?: string;
  AccessibleVersion?: string;
  RelatedItems?: {
    Type: string;
    Id: number;
    Title: string;
    Url: string;
  }[];
}

interface HealthGovResponse {
  Result: HealthGovTopic[];
}

class HealthGovAPIService {
  private baseUrl = "/api/healthgov"; // ✅ calls our Next.js API route

  // Generic fetcher
  private async fetchTopics(keyword: string): Promise<HealthGovTopic[]> {
    try {
      const response = await fetch(`${this.baseUrl}?keyword=${keyword}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch topics for "${keyword}"`);
      }

      const data: HealthGovResponse = await response.json();
      return data.Result || [];
    } catch (error) {
      console.error(`❌ Error fetching ${keyword} topics:`, error);
      return [];
    }
  }

  fetchMentalHealthTopics() {
    return this.fetchTopics("mental");
  }

  fetchStressTopics() {
    return this.fetchTopics("stress");
  }

  fetchSleepTopics() {
    return this.fetchTopics("sleep");
  }

  fetchAnxietyTopics() {
    return this.fetchTopics("anxiety");
  }

  async fetchAllMentalHealthContent(): Promise<HealthGovTopic[]> {
    try {
      const results = await Promise.all([
        this.fetchMentalHealthTopics(),
        this.fetchStressTopics(),
        this.fetchSleepTopics(),
        this.fetchAnxietyTopics(),
      ]);

      const allTopics = results.flat();
      return Array.from(new Map(allTopics.map(t => [t.Id, t])).values());
    } catch (error) {
      console.error("❌ Error fetching all mental health content:", error);
      return [];
    }
  }
}

export const healthGovAPI = new HealthGovAPIService();
export type { HealthGovTopic };
