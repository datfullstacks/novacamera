'use client';

export default function LoadingScreen() {
  return (
    <div className="p-8 bg-white rounded-lg shadow-sm text-center">
      {/* Loading Spinner */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Tải các đề xuất AI...
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Vui lòng chờ một chút, chúng tôi đang tải cấu trả lời tối ưu để xuất thiết bị phù hợp nhất cho bạn.
      </p>

      {/* Robot Icon */}
      <div className="mb-4">
        <span className="text-5xl">🤖</span>
      </div>

      {/* Loading Dots */}
      <div className="flex justify-center gap-2 mb-6">
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>

      {/* Progress Text */}
      <p className="text-sm text-gray-700 mb-8">
        Điều này có thể mất vài giây...
      </p>

      {/* Skip Button */}
      <button
        onClick={() => alert('Tính năng chat với chuyên gia sắp ra mắt!')}
        className="text-sm text-gray-900 hover:text-black underline font-medium"
      >
        Bạn muốn bỏ qua và trò chuyện với Shop
      </button>
    </div>
  );
}
