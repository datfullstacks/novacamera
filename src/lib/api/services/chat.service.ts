import { apiClient } from '../client';
import type { AskRequest, AskApiResponse, IndexApiResponse } from '@/types/api';

/**
 * Chat Service
 * Handles AI chat-related API calls
 */
export const chatService = {
  /**
   * Ask AI a question (RAG system)
   */
  ask: async (question: string): Promise<AskApiResponse> => {
    const data: AskRequest = { question };
    const response = await apiClient.post<AskApiResponse['data']>(
      '/Chat/ask',
      data as unknown as Record<string, unknown>
    );
    return response;
  },

  /**
   * Index equipment data (admin only - for initialization)
   */
  indexEquipment: async (): Promise<IndexApiResponse> => {
    const response = await apiClient.post<IndexApiResponse['data']>('/Chat/index');
    return response;
  },
};
