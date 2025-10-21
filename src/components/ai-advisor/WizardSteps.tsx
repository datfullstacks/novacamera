'use client';

import { useState } from 'react';

interface WizardStepsProps {
  currentStep: number;
  onStepComplete: (data: Record<string, unknown>) => void;
  onSkip?: () => void;
}

export default function WizardSteps({ currentStep, onStepComplete, onSkip }: WizardStepsProps) {
  // Step 1: Photography Type
  const photographyTypes = [
    { id: 'portrait', label: 'Chân dung', icon: '👤', description: 'Chụp ảnh chân dung chuyên nghiệp hoặc bình thường' },
    { id: 'wedding', label: 'Đám cưới & sự kiện', icon: '💒', description: 'Nắm bắt những dịp đặc biệt và lễ kỷ niệm' },
    { id: 'landscape', label: 'Phong cảnh & Du lịch', icon: '🏔️', description: 'Nhiếp ảnh thiên nhiên, phong cảnh và du lịch' },
    { id: 'commercial', label: 'Thương mại & Sản phẩm', icon: '📦', description: 'Ảnh chụp sản phẩm và chụp ảnh thương mại' },
    { id: 'sports', label: 'Thể thao & Hành động', icon: '⚽', description: 'Các đối tượng chuyển động nhanh và các bức ảnh hành động' },
    { id: 'filmmaking', label: 'Làm phim & video', icon: '🎬', description: 'Sản xuất video chuyên nghiệp' },
    { id: 'vlogging', label: 'Vlogging & nội dung', icon: '📹', description: 'Phương tiện truyền thông xã hội và sáng tạo nội dung' },
    { id: 'other', label: 'Khác', icon: '📸', description: 'Nhu cầu nhiếp ảnh chuyên môn hoặc độc đáo' },
  ];

  // Step 2: Skill Level
  const skillLevels = [
    { id: 'beginner', label: 'Người mới bắt đầu', description: 'Tôi chỉ bắt đầu và thích thiết bị dễ sử dụng.' },
    { id: 'intermediate', label: 'Trung cấp', description: 'Tôi có một số kinh nghiệm và có thể xử lý bánh răng trung gian.' },
    { id: 'advanced', label: 'Trình độ cao', description: 'Tôi là một nhiếp ảnh gia có kinh nghiệm hoặc chuyên nghiệp cần thiết bị nâng cao.' },
  ];

  // Step 3: Budget
  const budgetRanges = [
    { id: 'economy', label: 'Kinh tế', value: 50000, description: '50.000đ/ngày' },
    { id: 'standard', label: 'Tiêu chuẩn', value: 100000, description: '100.000đ/ngày' },
    { id: 'premium', label: 'Cao cấp', value: 300000, description: '300.000đ/ngày' },
  ];

  // Step 4: Options (Brands & Features)
  const brands = ['Canon', 'Sony', 'Nikon', 'Fujifilm', 'Zeiss', 'DJI', 'Panasonic', 'Sigma', 'PUNTOTO', 'Godox'];
  
  const features = [
    { id: 'lowlight', label: 'Ánh sáng yếu', icon: '🌙' },
    { id: 'video', label: 'Video nâng cao', icon: '📹' },
    { id: 'autofocus', label: 'Tự động lấy nét nhanh', icon: '🎯' },
    { id: 'lightweight', label: 'Nhẹ & di động', icon: '🪶' },
    { id: 'stabilization', label: 'Ổn định hình ảnh', icon: '🌀' },
    { id: 'professional-video', label: 'Video chuyên nghiệp', icon: '🎥' },
    { id: 'weather-sealed', label: 'Thời tiết kín', icon: '🌦' },
    { id: 'film-simulation', label: 'Mô phỏng phim', icon: '🎞' },
  ];

  const handleTypeSelect = (typeId: string) => {
    onStepComplete({ photographyType: typeId });
  };

  const handleSkillSelect = (skillId: string) => {
    onStepComplete({ skillLevel: skillId });
  };

  const handleBudgetSelect = (budgetValue: number) => {
    onStepComplete({ budget: budgetValue });
  };

  const handleOptionsSelect = (selectedBrands: string[], selectedFeatures: string[]) => {
    onStepComplete({ brands: selectedBrands, features: selectedFeatures });
  };

  if (currentStep === 1) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Bạn đang lên kế hoạch cho loại nhiếp ảnh hoặc video nào?
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Bước &ldquo;Kiểu&rdquo; giúp bạn xác định thể loại nhiếp ảnh hoặc video (chân dung, sự kiện, phong cảnh…) từ đó AI sẽ gợi ý thiết bị phù hợp nhất với nhu cầu sáng tạo của bạn.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {photographyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeSelect(type.id)}
              className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{type.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">
                    {type.label}
                  </h4>
                  <p className="text-sm text-gray-700 mt-1">{type.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        {onSkip && (
          <button
            onClick={onSkip}
            className="mt-4 w-full text-sm text-gray-900 hover:text-black underline font-medium"
          >
            Bạn muốn bỏ qua điều này và trò chuyện với Shop
          </button>
        )}
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Mức độ kỹ năng nhiếp ảnh của bạn là gì?
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Bước &ldquo;Kỹ năng&rdquo; giúp AI xác định trình độ chuyên môn của bạn để gợi ý thiết bị phù hợp - từ dễ sử dụng cho người mới đến chuyên nghiệp cho cao thủ.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skillLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => handleSkillSelect(level.id)}
              className="text-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-700 group-hover:text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
                    {level.label}
                  </h4>
                  <p className="text-sm text-gray-700">{level.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Cần tư vấn chi tiết hơn Section */}
        <div className="mt-8 text-center">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            Cần tư vấn chi tiết hơn
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Các chuyên gia nhiếp ảnh của chúng tôi đã sẵn sàng để giúp bạn tìm thấy thiết bị hoàn hảo cho các nhu cầu cụ thể của bạn. Phản hồi sẽ được phản hồi trong vòng 24 giờ.
          </p>
          <button
            onClick={() => alert('Tính năng chat với chuyên gia sắp ra mắt!')}
            className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Trò chuyện với Shop
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 3) {
    return (
      <BudgetStep onComplete={handleBudgetSelect} budgetRanges={budgetRanges} />
    );
  }

  if (currentStep === 4) {
    return (
      <OptionsStep onComplete={handleOptionsSelect} brands={brands} features={features} />
    );
  }

  return null;
}

// Budget Step Component (separate for interactivity)
function BudgetStep({
  onComplete,
  budgetRanges
}: {
  onComplete: (budget: number) => void;
  budgetRanges: Array<{ id: string; label: string; value: number; description: string }>;
}) {
  const [selectedBudget, setSelectedBudget] = useState(100000);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBudget(parseInt(e.target.value));
  };

  const handlePresetSelect = (value: number) => {
    setSelectedBudget(value);
  };

  const handleContinue = () => {
    onComplete(selectedBudget);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Ngân sách cho thuê của bạn mỗi ngày là bao nhiêu?
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Chọn chi tiêu hàng ngày ưa thích của bạn để giúp chúng tôi đề xuất các thiết bị phù hợp với ngân sách của bạn.
      </p>

      {/* Slider */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="range"
            min="50000"
            max="500000"
            step="50000"
            value={selectedBudget}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((selectedBudget - 50000) / (500000 - 50000)) * 100}%, #E5E7EB ${((selectedBudget - 50000) / (500000 - 50000)) * 100}%, #E5E7EB 100%)`
            }}
          />
          <div 
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded text-sm font-medium"
            style={{ left: `${((selectedBudget - 50000) / (500000 - 50000)) * 100}%` }}
          >
            {selectedBudget.toLocaleString('vi-VN')}₫
          </div>
        </div>
      </div>

      {/* Selected Budget Display */}
      <div className="text-center mb-6">
        <p className="text-lg font-semibold text-gray-900">
          Bạn đã chọn: {selectedBudget.toLocaleString('vi-VN')}₫/ngày
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex gap-3 mb-6">
        {budgetRanges.map((range) => (
          <button
            key={range.id}
            onClick={() => handlePresetSelect(range.value)}
            className={`flex-1 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
              selectedBudget === range.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400 text-gray-900'
            }`}
          >
            {range.label} ({range.value.toLocaleString('vi-VN')}₫/ngày)
          </button>
        ))}
      </div>

      {/* Kế tiếp Button */}
      <button
        onClick={handleContinue}
        className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors mb-8"
      >
        Kế tiếp
      </button>

      {/* Cần tư vấn chi tiết hơn Section */}
      <div className="text-center pt-6 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          Cần tư vấn chi tiết hơn
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Các chuyên gia nhiếp ảnh của chúng tôi đã sẵn sàng để giúp bạn tìm thấy thiết bị hoàn hảo cho các nhu cầu cụ thể của bạn. Phản hồi sẽ được phản hồi trong vòng 24 giờ.
        </p>
        <button
          onClick={() => alert('Tính năng chat với chuyên gia sắp ra mắt!')}
          className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Trò chuyện với Shop
        </button>
      </div>
    </div>
  );
}

// Options Step Component (separate for complexity)
function OptionsStep({ 
  onComplete, 
  brands, 
  features 
}: { 
  onComplete: (brands: string[], features: string[]) => void;
  brands: string[];
  features: Array<{ id: string; label: string; icon: string }>;
}) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId) ? prev.filter(f => f !== featureId) : [...prev, featureId]
    );
  };

  const handleContinue = () => {
    onComplete(selectedBrands, selectedFeatures);
  };

  const handleSkip = () => {
    onComplete([], []);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Bất kỳ tính năng hoặc thương hiệu cụ thể nào bạn thích?
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Bước &ldquo;Tuỳ chọn&rdquo; giúp AI biết bạn ưu tiên thương hiệu nào và những tính năng cần có (lấy nét nhanh, chống rung, quay video nâng cao…) để gợi ý bộ thiết bị đúng ý nhất.
      </p>

      {/* Brands */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Thương hiệu nhiếp ảnh</h4>
        <div className="grid grid-cols-5 gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => toggleBrand(brand)}
              className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                selectedBrands.includes(brand)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400 bg-white text-gray-900'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Tính năng thiết bị</h4>
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => toggleFeature(feature.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                selectedFeatures.includes(feature.id)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400 bg-white text-gray-900'
              }`}
            >
              <span className="text-xl">{feature.icon}</span>
              <span className="text-sm font-medium text-left">{feature.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={handleSkip}
          className="flex-1 bg-white border-2 border-gray-300 text-gray-900 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Bỏ qua
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Kế tiếp
        </button>
      </div>

      {/* Cần tư vấn chi tiết hơn Section */}
      <div className="text-center pt-6 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          Cần tư vấn chi tiết hơn
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Các chuyên gia nhiếp ảnh của chúng tôi đã sẵn sàng để giúp bạn tìm thấy thiết bị hoàn hảo cho các nhu cầu cụ thể của bạn. Phản hồi sẽ được phản hồi trong vòng 24 giờ.
        </p>
        <button
          onClick={() => alert('Tính năng chat với chuyên gia sắp ra mắt!')}
          className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Trò chuyện với Shop
        </button>
      </div>
    </div>
  );
}
