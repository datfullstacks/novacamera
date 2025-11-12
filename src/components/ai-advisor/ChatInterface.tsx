"use client";

import { chatService } from "@/lib/api/chatService";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { showToast } from "@/components/atoms/ui/Toast";

interface ContextProduct {
  equipmentId: number;
  name: string | null;
  brand: string | null;
  description: string | null;
  pricePerDay: number;
  depositFee: number | null;
  stock: number | null;
  category: string | null;
  imageUrl: string | null;
}

interface Message {
  id: string;
  type: "user" | "ai" | "recommendations";
  content: string;
  timestamp: Date;
  component?: React.ReactNode;
  contextProducts?: ContextProduct[]; // Add equipment data
}

interface ChatInterfaceProps {
  initialRecommendations?: React.ReactNode;
  initialQuestion?: string;
  initialAIResponse?: string;
}

export default function ChatInterface({
  initialRecommendations,
  initialQuestion,
  initialAIResponse,
}: ChatInterfaceProps) {
  // Initialize messages based on initial data
  const [messages, setMessages] = useState<Message[]>(() => {
    const initialMessages: Message[] = [];

    // If we have both initial question and AI response, add them
    if (initialQuestion && initialAIResponse) {
      // Add user's initial question first
      initialMessages.push({
        id: `user-${Date.now()}`,
        type: "user",
        content: initialQuestion,
        timestamp: new Date(),
      });

      // Then add AI's response
      initialMessages.push({
        id: `ai-${Date.now() + 1}`,
        type: "ai",
        content: initialAIResponse,
        timestamp: new Date(),
      });
    } else if (initialAIResponse) {
      // Only AI response provided (backward compatibility)
      initialMessages.push({
        id: `ai-${Date.now()}`,
        type: "ai",
        content: initialAIResponse,
        timestamp: new Date(),
      });
    } else {
      // Default greeting
      initialMessages.push({
        id: `ai-${Date.now()}`,
        type: "ai",
        content:
          "Xin chào! Tôi là NOVA AI Advisor 🤖. Dựa trên thông tin bạn đã cung cấp, tôi đã tạo ra những đề xuất thiết bị tốt nhất cho bạn. Bạn có thể xem các đề xuất bên dưới hoặc hỏi tôi bất kỳ câu hỏi nào!",
        timestamp: new Date(),
      });
    }

    return initialMessages;
  });

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [recommendationsAdded, setRecommendationsAdded] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [shouldScroll, setShouldScroll] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const dispatch = useDispatch();

  // Handle add to cart
  const handleAddToCart = (product: ContextProduct) => {
    if ((product.stock ?? 0) === 0) {
      showToast({
        type: 'error',
        title: 'Hết hàng',
        message: 'Sản phẩm này hiện đã hết hàng',
        duration: 3000,
      });
      return;
    }

    dispatch(addToCart({
      equipmentId: product.equipmentId,
      name: product.name || 'Unnamed Product',
      pricePerDay: product.pricePerDay,
      depositFee: product.depositFee || 0,
      imageUrl: product.imageUrl || null,
      brand: product.brand || null,
      category: product.category || null,
      quantity: 1,
      rentalStartDate: null,
      rentalEndDate: null,
      totalDays: 1,
    }));

    showToast({
      type: 'success',
      title: 'Đã thêm vào giỏ hàng',
      message: `${product.name} đã được thêm vào giỏ hàng`,
      duration: 3000,
    });
  };

  // Handle view details
  const handleViewDetails = (equipmentId: number) => {
    router.push(`/rental/${equipmentId}`);
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      // Scroll chỉ trong container, không scroll cả trang
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Only scroll when shouldScroll is true (user sends message or AI replies)
    if (shouldScroll && !isInitialMount) {
      scrollToBottom();
      setShouldScroll(false); // Reset flag
    }
  }, [messages, isInitialMount, shouldScroll]);

  // Mark initial mount complete (no auto-focus to keep scroll at top)
  useEffect(() => {
    setTimeout(() => {
      setIsInitialMount(false);
    }, 100);
  }, []);

  useEffect(() => {
    // Show recommendations after initial message (only once)
    // Chỉ thêm recommendations 1 lần duy nhất khi có initialRecommendations
    if (initialRecommendations && !recommendationsAdded) {
      const timer = setTimeout(() => {
        setMessages((prev) => {
          // Kiểm tra xem đã có recommendations chưa (double-check)
          const hasRecommendations = prev.some(
            (msg) => msg.type === "recommendations"
          );
          if (hasRecommendations) {
            return prev; // Không thêm nếu đã có
          }

          const recommendationsMessage: Message = {
            id: `recommendations-${Date.now()}`,
            type: "recommendations",
            content: "Equipment Recommendations",
            timestamp: new Date(),
            component: initialRecommendations,
          };
          return [...prev, recommendationsMessage];
        });
        setRecommendationsAdded(true);
      }, 1000);

      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [initialRecommendations, recommendationsAdded]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userQuestion = inputValue;
    const timestamp = Date.now();
    const newMessage: Message = {
      id: `user-${timestamp}`,
      type: "user",
      content: userQuestion,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setShouldScroll(true); // Enable scroll for user message

    // Call real AI chatbot API
    setIsTyping(true);
    try {
      const response = await chatService.askQuestion(userQuestion);

      console.log("💬 Chat AI Response:", response);

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        type: "ai",
        content:
          response.success && response.data
            ? response.data.answer
            : "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này. Vui lòng thử lại sau.",
        timestamp: new Date(),
        contextProducts:
          response.success && response.data?.contextProducts
            ? response.data.contextProducts
            : undefined,
      };

      console.log(
        "💬 AI Message with products:",
        aiMessage.contextProducts?.length || 0
      );

      setMessages((prev) => [...prev, aiMessage]);
      setShouldScroll(true); // Enable scroll for AI response
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: `ai-${Date.now()}`,
        type: "ai",
        content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setShouldScroll(true);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = async (question: string) => {
    setInputValue(question);
    // Auto-send the question
    setTimeout(async () => {
      const timestamp = Date.now();
      const newMessage: Message = {
        id: `user-${timestamp}`,
        type: "user",
        content: question,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");
      setShouldScroll(true);

      // Call real AI chatbot API
      setIsTyping(true);
      try {
        const response = await chatService.askQuestion(question);

        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          type: "ai",
          content:
            response.success && response.data
              ? response.data.answer
              : getAIResponse(question), // Fallback to mock response
          timestamp: new Date(),
          contextProducts:
            response.success && response.data?.contextProducts
              ? response.data.contextProducts
              : undefined,
        };

        setMessages((prev) => [...prev, aiMessage]);
        setShouldScroll(true);
      } catch (error) {
        console.error("Error getting AI response:", error);
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          type: "ai",
          content: getAIResponse(question), // Fallback to mock response
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setShouldScroll(true);
      } finally {
        setIsTyping(false);
      }
    }, 100);
  };

  const getAIResponse = (question: string): string => {
    if (question.includes("So sánh")) {
      return "Tôi có thể giúp bạn so sánh các máy ảnh trong danh sách đề xuất. Bạn muốn so sánh theo tiêu chí nào? (Giá cả, tính năng, thương hiệu, độ phân giải, ...)";
    } else if (question.includes("Tại sao")) {
      return "Tôi đề xuất những thiết bị này dựa trên nhu cầu của bạn: loại hình chụp ảnh, trình độ và ngân sách. Các thiết bị này có tỷ lệ giá/hiệu suất tốt nhất và phù hợp với phong cách của bạn.";
    } else if (question.includes("Phụ kiện")) {
      return "Ngoài máy ảnh và ống kính, bạn có thể cần: thẻ nhớ tốc độ cao (64GB-128GB), túi đựng máy ảnh, pin dự phòng, bộ lọc UV/CPL, và chân máy. Bạn muốn tôi gợi ý cụ thể không?";
    } else if (question.includes("ngân sách")) {
      return "Dựa trên ngân sách bạn đã chọn, tôi có thể điều chỉnh đề xuất hoặc gợi ý các combo tiết kiệm hơn. Bạn muốn xem các lựa chọn trong khoảng giá nào?";
    } else if (question.includes("Combo")) {
      return "Tôi có thể gợi ý các combo tiết kiệm bao gồm: Body + Lens + Phụ kiện với giá ưu đãi. Combo thường rẻ hơn 10-15% so với mua riêng lẻ!";
    } else if (question.includes("Cũ")) {
      return "Máy cũ (used/refurbished) là lựa chọn tốt để tiết kiệm 30-50% ngân sách. Tôi có thể gợi ý các model cũ chất lượng từ các thương hiệu uy tín với bảo hành đầy đủ.";
    }
    return "Cảm ơn bạn đã hỏi! Tôi sẽ tìm hiểu và trả lời chi tiết cho bạn ngay.";
  };

  return (
    <div className="flex flex-col h-[85vh] bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Header with gradient and icons */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-6 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* AI Avatar */}
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                NOVA AI Advisor
                <span className="px-2 py-0.5 bg-green-400 text-green-900 text-xs font-semibold rounded-full">
                  Online
                </span>
              </h2>
              <p className="text-sm text-blue-100">
                Trợ lý tư vấn thiết bị nhiếp ảnh thông minh
              </p>
            </div>
          </div>

          {/* Help Icon */}
          <button className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages with improved styling */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-transparent scroll-smooth"
      >
        {messages.map((message) => (
          <div key={message.id}>
            {message.type === "recommendations" ? (
              <div className="w-full animate-fadeIn">
                {/* Recommendations Header */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-xl">✨</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      Đề Xuất Thiết Bị Cho Bạn
                      <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                        AI Powered
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Được chọn lọc dựa trên nhu cầu và ngân sách của bạn
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium rounded-lg transition-colors border border-blue-200">
                      🔄 Làm mới
                    </button>
                    <button className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 text-xs font-medium rounded-lg transition-colors border border-purple-200">
                      💾 Lưu
                    </button>
                  </div>
                </div>

                {/* Recommendations Content with Container */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium">
                          Đã phân tích {Math.floor(Math.random() * 200 + 100)}{" "}
                          sản phẩm
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          {message.timestamp.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">{message.component}</div>
                </div>
              </div>
            ) : (
              <div
                className={`flex gap-3 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                } animate-slideIn`}
              >
                {/* AI Avatar for AI messages */}
                {message.type === "ai" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-blue-200">
                    <span className="text-sm">🤖</span>
                  </div>
                )}

                <div
                  className={`group relative ${
                    message.type === "user" ? "max-w-[75%]" : "max-w-[85%]"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none shadow-lg shadow-blue-200"
                        : "bg-white border-2 border-gray-200 text-gray-900 rounded-bl-none shadow-md hover:shadow-lg transition-shadow"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>

                    <div
                      className={`flex items-center justify-between mt-2 ${
                        message.type === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      <p className="text-xs">
                        {message.timestamp.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                      {/* Action buttons for AI messages */}
                      {message.type === "ai" && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(message.content)
                            }
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Sao chép"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-3.5 h-3.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                              />
                            </svg>
                          </button>
                          <button
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Thích"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-3.5 h-3.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                              />
                            </svg>
                          </button>
                          <button
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Không thích"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-3.5 h-3.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Equipment Cards - Show if contextProducts exists */}
                  {message.type === "ai" &&
                    message.contextProducts &&
                    message.contextProducts.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-gray-500 font-medium px-2">
                          📦 {message.contextProducts.length} sản phẩm được đề
                          xuất
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {message.contextProducts.map((product) => (
                            <div
                              key={product.equipmentId}
                              className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-3 hover:shadow-md transition-all hover:border-blue-300"
                            >
                              <div className="flex gap-3">
                                {/* Product Image */}
                                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
                                  <Image
                                    src={product.imageUrl || ""}
                                    alt={product.name || "Equipment"}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "https://via.placeholder.com/80x80";
                                    }}
                                    unoptimized
                                  />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm text-gray-900 truncate">
                                    {product.name || "Unnamed Product"}
                                  </h4>
                                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                    {product.brand} • {product.category}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-sm font-bold text-blue-600">
                                      {product.pricePerDay.toLocaleString(
                                        "vi-VN"
                                      )}
                                      ₫/ngày
                                    </span>
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full ${
                                        (product.stock ?? 0) > 0
                                          ? "bg-green-100 text-green-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {(product.stock ?? 0) > 0
                                        ? `Còn ${product.stock}`
                                        : "Hết hàng"}
                                    </span>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-1.5">
                                  <button 
                                    onClick={() => handleViewDetails(product.equipmentId)}
                                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium rounded-lg transition-colors border border-blue-200"
                                  >
                                    Chi tiết
                                  </button>
                                  <button
                                    onClick={() => handleAddToCart(product)}
                                    className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={(product.stock ?? 0) === 0}
                                  >
                                    + Thêm
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* User Avatar for user messages */}
                {message.type === "user" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator with animation */}
        {isTyping && (
          <div className="flex gap-3 justify-start animate-fadeIn">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-blue-200">
              <span className="text-sm">🤖</span>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-2xl rounded-bl-none px-5 py-3 shadow-md">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1.5">
                  <div
                    className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  AI đang suy nghĩ...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area with modern design */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-3 items-end">
          {/* Attach button */}
          <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
              />
            </svg>
          </button>

          {/* Input field */}
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              className="w-full resize-none border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
              rows={1}
              style={{
                minHeight: "44px",
                maxHeight: "120px",
              }}
            />
            {/* Emoji button inside input */}
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                />
              </svg>
            </button>
          </div>

          {/* Send button */}
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>

        {/* Quick actions - Scrollable horizontal */}
        <div className="mt-3 overflow-x-auto pb-1">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() =>
                handleQuickAction("So sánh các máy ảnh được đề xuất")
              }
              className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 text-blue-700 text-xs font-medium rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-1.5"
            >
              <span>⚖️</span>
              <span>So sánh máy ảnh</span>
            </button>
            <button
              onClick={() =>
                handleQuickAction("Tại sao AI đề xuất những thiết bị này?")
              }
              className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 text-purple-700 text-xs font-medium rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-1.5"
            >
              <span>🤔</span>
              <span>Tại sao chọn những này?</span>
            </button>
            <button
              onClick={() =>
                handleQuickAction("Phụ kiện nào cần thiết cho người mới?")
              }
              className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 text-green-700 text-xs font-medium rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-1.5"
            >
              <span>🎒</span>
              <span>Phụ kiện cần thiết</span>
            </button>
            <button
              onClick={() => handleQuickAction("Điều chỉnh ngân sách của tôi")}
              className="px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border border-orange-200 text-orange-700 text-xs font-medium rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-1.5"
            >
              <span>�</span>
              <span>Điều chỉnh ngân sách</span>
            </button>
            <button
              onClick={() => handleQuickAction("Combo máy + lens tiết kiệm")}
              className="px-4 py-2 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-200 text-red-700 text-xs font-medium rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-1.5"
            >
              <span>📦</span>
              <span>Combo ưu đãi</span>
            </button>
            <button
              onClick={() => handleQuickAction("Máy cũ (used) có tốt không?")}
              className="px-4 py-2 bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-1.5"
            >
              <span>♻️</span>
              <span>Máy cũ chất lượng</span>
            </button>
          </div>
        </div>

        {/* Helper text */}
        <p className="text-xs text-gray-400 mt-2 text-center">
          💬 Nhấn vào gợi ý hoặc nhập câu hỏi của bạn
        </p>
      </div>

      {/* Add animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
