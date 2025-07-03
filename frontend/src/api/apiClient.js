// Simple API client for FastAPI backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dodai-beckend.onrender.com';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Survey methods
  async createSurvey(surveyData) {
    return this.request('/api/surveys', {
      method: 'POST',
      body: surveyData,
    });
  }

  async getSurveys(limit = 100, offset = 0) {
    return this.request(`/api/surveys?limit=${limit}&offset=${offset}`);
  }

  async getSurveyById(id) {
    return this.request(`/api/surveys/${id}`);
  }

  async getSurveyStats() {
    return this.request('/api/surveys/stats');
  }

  // AI Analysis
  async generateAnalysis(prompt) {
    return this.request('/api/ai/analyze', {
      method: 'POST',
      body: {
        prompt: prompt,
        add_context_from_internet: false
      }
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiClient = new APIClient();

// Export functions for backward compatibility
export const SurveyResponse = {
  async create(data) {
    const response = await apiClient.createSurvey(data);
    return response;
  },
  
  async list(orderBy = "-created_date") {
    const response = await apiClient.getSurveys();
    return response.surveys || [];
  }
};

export const InvokeLLM = async ({ prompt, add_context_from_internet = false }) => {
  const response = await apiClient.generateAnalysis(prompt);
  return response.analysis;
};

// Simple SavedAnalysis export to prevent import errors
export const SavedAnalysis = {
  async create(data) {
    // For now, just store in localStorage as a simple implementation
    const analysisId = `analysis_${Date.now()}`;
    const analysisData = {
      ...data,
      analysisId,
      created_date: new Date().toISOString()
    };
    
    // Store in localStorage for simplicity
    localStorage.setItem(`saved_analysis_${data.share_token}`, JSON.stringify(analysisData));
    
    return analysisData;
  },
  
  async filter(params) {
    // Simple filter implementation using localStorage
    if (params.share_token) {
      const stored = localStorage.getItem(`saved_analysis_${params.share_token}`);
      return stored ? [JSON.parse(stored)] : [];
    }
    return [];
  }
}; 