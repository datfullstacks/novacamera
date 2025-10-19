'use client';

/**
 * Chat/AI Query Hooks
 * Custom hooks for AI chat functionality
 */

import { useMutation } from '@tanstack/react-query';
import { chatService } from '@/lib/api/services';

/**
 * Ask AI a question mutation
 * For RAG (Retrieval-Augmented Generation) queries
 */
export function useAskAI() {
  return useMutation({
    mutationFn: (question: string) => chatService.ask(question),
  });
}

/**
 * Index equipment for RAG mutation
 * Updates vector database with equipment data
 */
export function useIndexEquipment() {
  return useMutation({
    mutationFn: () => chatService.indexEquipment(),
  });
}
