'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/organisms/Header';
import ChatProvider from '@/components/layout/ChatProvider';
import StandaloneWizard from '@/components/ai-advisor/StandaloneWizard';
import ChatInterface from '@/components/ai-advisor/ChatInterface';
import EquipmentRecommendations from '@/components/ai-advisor/EquipmentRecommendations';
import { chatService } from '@/lib/api/chatService';
import { generateQuestionFromWizard } from '@/lib/utils/wizardToQuestion';
import type { EquipmentResponse } from '@/types/api/equipment';

export default function AIAdvisorPage() {
  const [showChat, setShowChat] = useState(false);
  const [wizardComplete, setWizardComplete] = useState(false);
  const [wizardData, setWizardData] = useState<Record<string, unknown> | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<string>('');
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendedEquipment, setRecommendedEquipment] = useState<EquipmentResponse[]>([]);
  const [initialQuestion, setInitialQuestion] = useState<string>('');

  const handleWizardComplete = async (data: Record<string, unknown>) => {
    console.log('🎯 Wizard completed with data:', data);
    setWizardData(data);
    setWizardComplete(true);

    // Tạo câu hỏi từ wizard data
    const question = generateQuestionFromWizard(data);
    setInitialQuestion(question);
    console.log('❓ Generated question:', question);

    // Gọi AI API để lấy recommendations
    setIsLoadingRecommendations(true);
    try {
      const response = await chatService.askQuestion(question);
      console.log('📡 Full API Response:', response);
      
      if (response.success && response.data) {
        // Always set AI answer
        setAiRecommendations(response.data.answer);
        console.log('🤖 AI Answer:', response.data.answer);
        
        // Convert contextProducts to EquipmentResponse format (if exists)
        if (response.data.contextProducts && response.data.contextProducts.length > 0) {
          console.log(`📦 Processing ${response.data.contextProducts.length} products...`);
          const equipment: EquipmentResponse[] = response.data.contextProducts.map(product => ({
            equipmentId: product.equipmentId,
            categoryId: null,
            name: product.name,
            tagline: null,
            shortDescription: product.description,
            brand: product.brand,
            mainImageUrl: product.imageUrl 
              ? `https://api.mmoshop.site/images/${product.imageUrl}` 
              : null,
            description: product.description,
            conditionNote: null,
            pricePerDay: product.pricePerDay,
            depositFee: product.depositFee,
            rating: null,
            reviewCount: null,
            status: null,
            stock: product.stock,
            rentalCount: null,
            categoryName: product.category,
            isAvailable: (product.stock ?? 0) > 0,
            location: null,
            imageResponses: [],
            formattedPrice: null,
            formattedDeposit: null,
            ratingStars: null,
            reviewText: null,
            availabilityText: null,
          }));
          
          setRecommendedEquipment(equipment);
          console.log('✅ Equipment converted successfully:', equipment.length, 'items');
        } else {
          console.log('💬 Text-only response (no equipment products)');
          setRecommendedEquipment([]);
        }
      } else {
        console.error('❌ API response not successful:', response);
      }
    } catch (error) {
      console.error('🔥 Error getting AI recommendations:', error);
    } finally {
      setIsLoadingRecommendations(false);
      console.log('⏹️ Loading finished');
    }
  };

  // Memoize recommendations để tránh re-create mỗi lần render
  const recommendations = useMemo(() => {
    if (!wizardData || recommendedEquipment.length === 0) return null;
    
    // Group equipment by category
    const groupedByCategory: Record<string, EquipmentResponse[]> = {};
    recommendedEquipment.forEach(eq => {
      const category = eq.categoryName || 'Khác';
      if (!groupedByCategory[category]) {
        groupedByCategory[category] = [];
      }
      groupedByCategory[category].push(eq);
    });

    // Convert to RecommendationSection format
    const sections = Object.entries(groupedByCategory).map(([category, items]) => {
      // Map category to icon
      let icon = '📦';
      let title = category;
      
      if (category.toLowerCase().includes('camera') || category.toLowerCase().includes('máy ảnh')) {
        icon = '📷';
        title = 'Máy ảnh được đề xuất';
      } else if (category.toLowerCase().includes('lens') || category.toLowerCase().includes('ống kính')) {
        icon = '🔍';
        title = 'Ống kính được đề xuất';
      } else if (category.toLowerCase().includes('accessory') || category.toLowerCase().includes('phụ kiện')) {
        icon = '⚙️';
        title = 'Phụ kiện được đề xuất';
      }

      return {
        title,
        icon,
        items: items.map(eq => ({
          equipmentId: eq.equipmentId,
          equipmentName: eq.name || 'Unnamed Equipment',
          price: eq.pricePerDay,
          image: eq.mainImageUrl || 'https://via.placeholder.com/300x200',
          features: [
            eq.brand || '',
            eq.tagline || '',
            eq.shortDescription || ''
          ].filter(Boolean),
          category: category.toLowerCase(),
        }))
      };
    });
    
    return (
      <EquipmentRecommendations recommendations={sections} />
    );
  }, [wizardData, recommendedEquipment]);

  return (
    <ChatProvider>
      <div className="min-h-screen bg-gray-50 pt-20">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            
            {!showChat ? (
              // Gợi ý thuê thiết bị Section - Initial View
              <div className="text-center mb-12 py-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Gợi ý thuê thiết bị?
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                  Có vấn AI của chúng tôi làm cho lựa chọn thiết bị tối đơn giản và và thông minh. Chỉ cần trả lời một vài câu hỏi và chúng tôi sẽ đề xuất các thiết bị tối hoàn hảo phù hợp với dự án nhiếp ảnh của bạn.
                </p>
                <button
                  onClick={() => setShowChat(true)}
                  className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Bắt đầu AI Advisor
                </button>
              </div>
            ) : !wizardComplete || isLoadingRecommendations ? (
              // Wizard Steps OR Loading - Shows after clicking "Bắt đầu AI Advisor"
              <div className="mb-12">
                {isLoadingRecommendations ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mb-4"></div>
                    <p className="text-lg text-gray-600">Đang phân tích và tìm kiếm thiết bị phù hợp...</p>
                    <p className="text-sm text-gray-400 mt-2">Vui lòng đợi...</p>
                  </div>
                ) : (
                  <StandaloneWizard onComplete={handleWizardComplete} />
                )}
              </div>
            ) : wizardComplete && !isLoadingRecommendations && (aiRecommendations || recommendedEquipment.length > 0) ? (
              // Chat Interface - Shows after wizard completion AND data loaded
              <div className="mb-12">
                <ChatInterface 
                  initialRecommendations={recommendations}
                  initialQuestion={initialQuestion}
                  initialAIResponse={aiRecommendations}
                />
              </div>
            ) : (
              // Fallback: Show error or retry
              <div className="mb-12">
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="text-6xl mb-4">😕</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải đề xuất</h3>
                  <p className="text-gray-600 mb-4 text-center max-w-md">
                    Đã xảy ra lỗi khi lấy đề xuất thiết bị. Vui lòng thử lại.
                  </p>
                  <button
                    onClick={() => {
                      setWizardComplete(false);
                      setShowChat(true);
                      setRecommendedEquipment([]);
                      setAiRecommendations('');
                    }}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            )}

            {/* FAQ Section - No border, clean background */}
            <div className="mt-16">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Câu hỏi thường gặp
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Nhiên câu trả lời cho các câu hỏi phổ biến về quá trình cho thuê AI và về vấn AI của chúng tôi.
              </p>
              <div className="space-y-4">
                <details className="group bg-white rounded-lg p-4 shadow-sm">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-lg font-medium text-gray-800">Độ chính xác của tư vấn bằng AI là bao nhiêu?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                    AI của chúng tôi được huấn luyện từ hàng nghìn dự án nhiếp ảnh thành công và phản hồi từ người dùng chuyên nghiệp. Độ chính xác đạt 90%+ cho các dự án thông thường.
                  </p>
                </details>

                <details className="group bg-white rounded-lg p-4 shadow-sm">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-lg font-medium text-gray-800">Tôi có thể thay đổi thiết bị của mình sau khi thuê không?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                    Bạn có thể thay đổi thiết bị trong vòng 24 giờ đầu tiên sau khi nhận hàng, miễn là thiết bị chưa sử dụng và còn nguyên vẹn. Phí thay đổi có thể được áp dụng.
                  </p>
                </details>

                <details className="group bg-white rounded-lg p-4 shadow-sm">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-lg font-medium text-gray-800">Nếu tôi có yêu cầu cụ thể hơn thì sao?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                    Bạn có thể chat trực tiếp với chuyên gia của chúng tôi thông qua nút &quot;Chat with Shop&quot; trong giao diện AI. Đội ngũ chuyên gia sẽ tư vấn cá nhân hóa cho dự án của bạn.
                  </p>
                </details>

                <details className="group bg-white rounded-lg p-4 shadow-sm">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-lg font-medium text-gray-800">Tư vấn AI có giới thiệu phụ kiện quá không?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                    AI chỉ đề xuất phụ kiện thực sự cần thiết cho dự án của bạn. Bạn hoàn toàn có thể bỏ qua các đề xuất phụ kiện nếu không cần thiết.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ChatProvider>
  );
}