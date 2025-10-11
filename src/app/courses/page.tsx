import Header from '@/components/organisms/Header';

export default async function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Photography AI Courses
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Learn photography techniques enhanced by AI technology.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">AI-Powered Composition</h3>
              <p className="text-gray-600 mb-4">Learn how AI can help you create better compositions and find the perfect shot.</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$99</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Enroll Now
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Smart Lighting with AI</h3>
              <p className="text-gray-600 mb-4">Master lighting techniques using AI-assisted tools and analysis.</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$129</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Enroll Now
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Photo Editing</h3>
              <p className="text-gray-600 mb-4">Advanced photo editing techniques using AI-powered tools and workflows.</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$149</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Enroll Now
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Complete AI Photography</h3>
              <p className="text-gray-600 mb-4">Comprehensive course covering all aspects of AI-enhanced photography.</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$299</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}