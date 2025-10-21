import { ApiClient } from './client';
import { AskResponse } from '@/types/api/chat';

export interface ChatApiResponse {
  data: AskResponse | null;
  success: boolean;
  message: string;
}

export class ChatService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Gửi câu hỏi đến AI chatbot
   */
  async askQuestion(question: string): Promise<ChatApiResponse> {
    try {
      const requestData = {
        question: question || null,
      };

      const apiResponse = await this.apiClient.post<AskResponse>('/Chat/ask', requestData);

      return {
        data: apiResponse.data || null,
        success: true,
        message: apiResponse.message || 'Question processed successfully',
      };
    } catch (error: unknown) {
      console.error('❌ Error asking chatbot:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response from chatbot';
      return {
        data: null,
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Index equipment data for AI (optional - for admin)
   */
  async indexEquipment(): Promise<{ success: boolean; message: string; indexed?: number }> {
    try {
      const apiResponse = await this.apiClient.post<{ message: string; indexed: number }>('/Chat/index', {});

      return {
        success: true,
        message: apiResponse.data?.message || apiResponse.message || 'Equipment indexed successfully',
        indexed: apiResponse.data?.indexed,
      };
    } catch (error: unknown) {
      console.error('Error indexing equipment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to index equipment';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }
}

export const chatService = new ChatService();
