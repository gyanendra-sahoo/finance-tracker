const Newsletter = () => {
  return (
    <section className="bg-[#111] py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Sign Up For Our Newsletter & Get The Latest News
        </h2>
        <p className="text-green-100 mb-8 text-lg">
          Stay updated with the latest features, financial tips, and exclusive offers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-black text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
