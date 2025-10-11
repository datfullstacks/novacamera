import Header from '@/components/organisms/Header';

export default async function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Need Support?
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We're here to help with your equipment rental and photography needs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📧</span>
                  <span className="text-gray-700">support@novacamera.com</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📱</span>
                  <span className="text-gray-700">+84 123 456 789</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⏰</span>
                  <span className="text-gray-700">Mon-Fri: 8AM-6PM</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Help</h3>
              <div className="space-y-3">
                <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  📖 Equipment Manuals
                </a>
                <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  🎥 Tutorial Videos
                </a>
                <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  ❓ FAQ
                </a>
                <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  💬 Live Chat
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}