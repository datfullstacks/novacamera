import Header from '@/components/organisms/Header';
import ChatProvider from '@/components/layout/ChatProvider';

export default async function AIAdvisorPage() {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-gray-50 pt-20">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              AI Photography Advisor
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Get personalized equipment recommendations powered by artificial intelligence.
            </p>
            
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                How it works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📸</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Tell us your project</h3>
                  <p className="text-gray-600">Describe your photography project and requirements</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">AI Analysis</h3>
                  <p className="text-gray-600">Our AI analyzes your needs and budget</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Get Recommendations</h3>
                  <p className="text-gray-600">Receive personalized equipment suggestions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Start Your AI Consultation</h3>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Begin AI Consultation
              </button>
            </div>
          </div>
        </main>
      </div>
    </ChatProvider>
  );
}