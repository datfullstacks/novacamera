'use client';

import { HTMLAttributes, useState } from 'react';
import ChatModal from './ChatModal';

interface Message {
  readonly id: string;
  readonly text: string;
  readonly isUser: boolean;
  readonly timestamp?: string;
  readonly avatar?: string;
}

interface ChatContainerProps extends HTMLAttributes<HTMLDivElement> {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly aiAvatar?: string;
  readonly userAvatar?: string;
}

export default function ChatContainer({
  isOpen,
  onClose,
  aiAvatar,
  userAvatar,
  className = '',
  ...props
}: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là AI Advisor của Nova Camera. Tôi có thể giúp bạn tìm thiết bị phù hợp cho dự án chụp ảnh của mình.',
      isUser: false,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      avatar: aiAvatar,
    },
    {
      id: '2',
      text: 'Hãy cho tôi biết về dự án chụp ảnh của bạn: loại hình chụp, ngân sách, kinh nghiệm và thời gian sử dụng nhé!',
      isUser: false,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      avatar: aiAvatar,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      avatar: userAvatar,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(message),
        isUser: false,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        avatar: aiAvatar,
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Photography project types
    if (lowerMessage.includes('chân dung') || lowerMessage.includes('portrait')) {
      return 'Tuyệt vời! Chụp chân dung cần ống kính có khẩu độ lớn (f/1.4-f/2.8) và máy ảnh có khả năng xử lý màu da tốt. Tôi khuyên dùng Canon EOS R5 hoặc Sony A7III với ống kính 85mm f/1.4. Bạn có ngân sách bao nhiêu?';
    }
    
    if (lowerMessage.includes('phong cảnh') || lowerMessage.includes('landscape')) {
      return 'Chụp phong cảnh cần ống kính góc rộng và máy ảnh có độ phân giải cao. Tôi khuyên dùng Canon EOS R5 với ống kính 16-35mm f/2.8 hoặc Sony A7R IV với ống kính 14-24mm f/2.8. Bạn thường chụp ở đâu?';
    }
    
    if (lowerMessage.includes('sự kiện') || lowerMessage.includes('event')) {
      return 'Chụp sự kiện cần thiết bị linh hoạt và đáng tin cậy. Tôi khuyên dùng Canon EOS R6 Mark II hoặc Sony A7IV với ống kính 24-70mm f/2.8 và 70-200mm f/2.8. Sự kiện của bạn kéo dài bao lâu?';
    }
    
    if (lowerMessage.includes('thương mại') || lowerMessage.includes('commercial')) {
      return 'Chụp thương mại cần thiết bị chuyên nghiệp với chất lượng cao. Tôi khuyên dùng Canon EOS R5 hoặc Sony A7R V với ống kính L-series hoặc G-Master. Bạn có studio riêng không?';
    }
    
    // Budget ranges
    if (lowerMessage.includes('ngân sách') || lowerMessage.includes('budget') || lowerMessage.includes('giá')) {
      return 'Tôi có thể tư vấn thiết bị phù hợp với mọi ngân sách:\n• Dưới 2 triệu: Canon EOS M50 II + ống kính kit\n• 2-5 triệu: Sony A7III + ống kính 24-70mm\n• 5-10 triệu: Canon EOS R5 + ống kính L-series\n• Trên 10 triệu: Sony A7R V + ống kính G-Master\nBạn có ngân sách bao nhiêu?';
    }
    
    // Experience levels
    if (lowerMessage.includes('mới bắt đầu') || lowerMessage.includes('beginner')) {
      return 'Tuyệt vời! Tôi khuyên bạn bắt đầu với máy ảnh entry-level như Canon EOS M50 II hoặc Sony A6000. Chúng dễ sử dụng và có giá cả phải chăng. Bạn muốn chụp gì chủ yếu?';
    }
    
    if (lowerMessage.includes('chuyên nghiệp') || lowerMessage.includes('professional')) {
      return 'Với kinh nghiệm chuyên nghiệp, tôi khuyên dùng Canon EOS R5 hoặc Sony A7R V kết hợp với ống kính cao cấp. Bạn cần thiết bị cho dự án cụ thể nào?';
    }
    
    // Equipment brands
    if (lowerMessage.includes('canon')) {
      return 'Canon có dòng EOS R series rất mạnh. Tôi khuyên:\n• EOS R5: 45MP, 8K video, chụp chân dung và thương mại\n• EOS R6: 20MP, 4K video, chụp sự kiện và thể thao\n• EOS M50 II: Entry-level, dễ sử dụng\nBạn quan tâm đến model nào?';
    }
    
    if (lowerMessage.includes('sony')) {
      return 'Sony A7 series có công nghệ tiên tiến. Tôi khuyên:\n• A7R V: 61MP, chụp phong cảnh và thương mại\n• A7IV: 33MP, cân bằng tốt cho mọi thể loại\n• A7III: 24MP, giá cả hợp lý, hiệu suất cao\nBạn muốn tìm hiểu về model nào?';
    }
    
    if (lowerMessage.includes('nikon')) {
      return 'Nikon Z series có chất lượng hình ảnh xuất sắc. Tôi khuyên:\n• Z9: Flagship, chụp thể thao và động vật hoang dã\n• Z7 II: 45MP, chụp phong cảnh và thương mại\n• Z6 II: 24MP, đa năng, giá cả hợp lý\nBạn có quan tâm đến Nikon không?';
    }
    
    // Default response
    return 'Cảm ơn bạn đã chia sẻ! Để tôi tư vấn chính xác hơn, bạn có thể cho tôi biết:\n• Loại hình chụp ảnh (chân dung, phong cảnh, sự kiện...)\n• Ngân sách dự kiến\n• Kinh nghiệm chụp ảnh\n• Thời gian sử dụng thiết bị\nTôi sẽ đưa ra gợi ý phù hợp nhất!';
  };

  return (
    <ChatModal
      isOpen={isOpen}
      onClose={onClose}
      onSendMessage={handleSendMessage}
      messages={messages}
      isLoading={isLoading}
      title="AI Assistant"
      subtitle="Đang hoạt động"
      aiAvatar={aiAvatar}
      userAvatar={userAvatar}
      className={className}
      {...props}
    />
  );
}
