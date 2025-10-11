import Header from '@/components/organisms/Header';

export default async function ConsignmentPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Equipment Consignment
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Sell your photography equipment through our consignment program.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              How Consignment Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Submit Equipment</h3>
                <p className="text-gray-600">Send us details about your equipment</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Evaluation</h3>
                <p className="text-gray-600">We assess condition and market value</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏪</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">List for Sale</h3>
                <p className="text-gray-600">Your equipment goes live on our platform</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Get Paid</h3>
                <p className="text-gray-600">Receive payment when your item sells</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Start Consignment Process</h3>
            <p className="text-gray-600 mb-4">Ready to sell your equipment? Get started with our easy consignment process.</p>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Submit Equipment for Consignment
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}