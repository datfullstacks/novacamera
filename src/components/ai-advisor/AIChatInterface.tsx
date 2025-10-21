'use client';

import { useState, useRef, useEffect } from 'react';
import WizardSteps from './WizardSteps';
import EquipmentRecommendations from './EquipmentRecommendations';
import LoadingScreen from './LoadingScreen';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system' | 'wizard' | 'recommendations';
  content: string;
  timestamp: Date;
  component?: React.ReactNode;
  wizardStep?: number;
}

interface AIChatInterfaceProps {
  onStepComplete?: (data: Record<string, unknown>) => void;
}

export default function AIChatInterface({ onStepComplete }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Xin chào! Tôi là NOVA AI Advisor 🤖. Tôi sẽ giúp bạn tìm thiết bị nhiếp ảnh hoàn hảo cho dự án của bạn. Hãy để tôi hỏi bạn một vài câu hỏi để đưa ra lời khuyên tốt nhất!',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentWizardStep, setCurrentWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState<Record<string, unknown>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Show first wizard step after initial message
    setTimeout(() => {
      addWizardMessage(1);
    }, 1000);
  }, []);

  const addWizardMessage = (step: number) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'wizard',
      content: `Wizard Step ${step}`,
      timestamp: new Date(),
      wizardStep: step,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleWizardStepComplete = (stepData: Record<string, unknown>) => {
    const updatedData = { ...wizardData, ...stepData };
    setWizardData(updatedData);

    // Format user selection in a friendly way
    let selectionText = '';
    if (stepData.photographyType) {
      const types: Record<string, string> = {
        portrait: 'Chân dung',
        wedding: 'Đám cưới & sự kiện',
        landscape: 'Phong cảnh & Du lịch',
        commercial: 'Thương mại & Sản phẩm',
        sports: 'Thể thao & Hành động',
        filmmaking: 'Làm phim & video',
        vlogging: 'Vlogging & nội dung',
        other: 'Khác'
      };
      selectionText = `Đã chọn: ${types[stepData.photographyType as string] || stepData.photographyType}`;
    } else if (stepData.skillLevel) {
      const skills: Record<string, string> = {
        beginner: 'Người mới bắt đầu',
        intermediate: 'Trung cấp',
        advanced: 'Trình độ cao'
      };
      selectionText = `Mức kỹ năng: ${skills[stepData.skillLevel as string] || stepData.skillLevel}`;
    } else if (stepData.budget) {
      selectionText = `Ngân sách: ${(stepData.budget as number).toLocaleString('vi-VN')}₫/ngày`;
    } else if (stepData.brands || stepData.features) {
      const brands = (stepData.brands as string[]) || [];
      const features = (stepData.features as string[]) || [];
      selectionText = `Đã chọn ${brands.length} thương hiệu và ${features.length} tính năng`;
    }

    // Add user's selection as a message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: selectionText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Progress to next step or show results
    if (currentWizardStep < 4) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setCurrentWizardStep(currentWizardStep + 1);
        addWizardMessage(currentWizardStep + 1);
      }, 1500);
    } else {
      // All steps complete - show loading screen
      setIsTyping(false);
      setCurrentWizardStep(5); // Set to 5 to show loading screen
      
      // Show loading message
      const loadingMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: 'Đang tạo đề xuất...',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, loadingMessage]);
      
      // Simulate API call (replace with real API later)
      setTimeout(() => {
        fetchRecommendations(/* updatedData */);
      }, 3000);
      
      if (onStepComplete) {
        onStepComplete(updatedData);
      }
    }
  };

  const fetchRecommendations = async (/* wizardData: Record<string, unknown> */) => {
    try {
      // TODO: Replace with real API call
      // const response = await fetch('/api/ai-advisor/recommendations', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(wizardData)
      // });
      // const data = await response.json();
      
      // For now, use mock data
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Tuyệt vời! Dựa trên sở thích của bạn, đây là những khuyến nghị của tôi...',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Add recommendations
      setTimeout(() => {
        const recommendationsMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'recommendations',
          content: 'Equipment Recommendations',
          timestamp: new Date(),
          component: getMockRecommendations(),
        };
        setMessages(prev => [...prev, recommendationsMessage]);
        setCurrentWizardStep(6); // Mark as complete
      }, 500);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: 'Đã xảy ra lỗi khi tạo đề xuất. Vui lòng thử lại.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const getMockRecommendations = () => {
    const mockData = [
      {
        title: 'Máy ảnh phù hợp',
        icon: '📷',
        items: [
          {
            equipmentId: 1,
            equipmentName: 'Canon EOS R6',
            price: 950000,
            features: ['4K 60fps, chụng rung...IBS, phủ gọn', 'Tốt cho mọi loại hình nhiếp ảnh'],
            category: 'camera'
          },
          {
            equipmentId: 2,
            equipmentName: 'Panasonic GH5',
            price: 790000,
            features: ['4K 60fps, chống rung...chuyên video', 'Phù hợp với người làm video chuyên nghiệp'],
            category: 'camera'
          }
        ]
      },
      {
        title: 'Ống kính đề xuất',
        icon: '🔍',
        items: [
          {
            equipmentId: 3,
            equipmentName: 'Canon EOS R6',
            price: 950000,
            features: ['4K 60fps, chụng rung...IBS, phủ gọn', 'Tốt cho mọi loại hình nhiếp ảnh'],
            category: 'lens'
          },
          {
            equipmentId: 4,
            equipmentName: 'Panasonic GH5',
            price: 790000,
            features: ['4K 60fps, chống rung...chuyên video', 'Phù hợp với người làm video chuyên nghiệp'],
            category: 'lens'
          }
        ]
      },
      {
        title: 'Phụ kiện đề xuất',
        icon: '⚡',
        items: [
          {
            equipmentId: 5,
            equipmentName: 'Canon EOS R6',
            price: 950000,
            features: ['4K 60fps, chụng rung...IBS, phủ gọn', 'Tốt cho mọi loại hình nhiếp ảnh'],
            category: 'accessory'
          },
          {
            equipmentId: 6,
            equipmentName: 'Panasonic GH5',
            price: 790000,
            features: ['4K 60fps, chống rung...chuyên video', 'Phù hợp với người làm video chuyên nghiệp'],
            category: 'accessory'
          }
        ]
      }
    ];

    return (
      <EquipmentRecommendations 
        recommendations={mockData}
        onAddToCart={(id) => console.log('Add to cart:', id)}
      />
    );
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Cảm ơn bạn đã liên hệ! Tôi có thể giúp bạn với điều đó.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getProgressPercentage = () => {
    return (currentWizardStep / 4) * 100;
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">NOVA AI Advisor 🤖</h2>
        <p className="text-sm text-blue-100">Trợ lý tư vấn thiết bị nhiếp ảnh thông minh</p>
        
        {/* Progress bar */}
        {currentWizardStep <= 4 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Tiến độ</span>
              <span>{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-blue-800 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            {message.type === 'wizard' && message.wizardStep === 5 ? (
              <LoadingScreen />
            ) : message.type === 'wizard' && message.wizardStep ? (
              <WizardSteps 
                currentStep={message.wizardStep}
                onStepComplete={handleWizardStepComplete}
              />
            ) : message.type === 'recommendations' ? (
              <div className="w-full">
                {message.component}
              </div>
            ) : (
              <div
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : message.type === 'ai'
                      ? 'bg-gray-100 text-gray-900 rounded-bl-none'
                      : 'bg-yellow-50 text-yellow-900 border border-yellow-200'
                  }`}
                >
                  {message.component || (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg rounded-bl-none p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        {/* Chat with Expert button */}
        <div className="mb-3 text-center">
          <button 
            className="text-sm text-gray-600 hover:text-gray-900 underline inline-flex items-center gap-1"
            onClick={() => alert('Tính năng chat với chuyên gia sắp ra mắt!')}
          >
            Bạn muốn bỏ qua điều này và trò chuyện với Shop
          </button>
        </div>
        
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn"
            className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
