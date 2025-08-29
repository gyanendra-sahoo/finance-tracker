import { Apple, Play } from "lucide-react";

const DownloadApp = () => {
  return (
    <section className="bg-black py-20 px-6 relative overflow-hidden">
      {/* Gradient Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 blur-3xl"></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Heading */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-6">
            Download Our App to{" "}
            <span className="text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.7)]">
              Easily Manage Finances
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Take your financial management on the go. Available on iOS and Android.
          </p>

          {/* Store Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition transform hover:-translate-y-1">
              <Apple className="w-6 h-6" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="font-semibold">App Store</div>
              </div>
            </button>

            <button className="flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition transform hover:-translate-y-1">
              <Play className="w-6 h-6" />
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="font-semibold">Google Play</div>
              </div>
            </button>
          </div>
        </div>

        {/* Partners */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-80">
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl h-20 flex items-center justify-center hover:border-green-500/40 transition">
            <span className="text-gray-300 font-semibold">Partner 1</span>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl h-20 flex items-center justify-center hover:border-green-500/40 transition">
            <span className="text-gray-300 font-semibold">Partner 2</span>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl h-20 flex items-center justify-center hover:border-green-500/40 transition">
            <span className="text-gray-300 font-semibold">Partner 3</span>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl h-20 flex items-center justify-center hover:border-green-500/40 transition">
            <span className="text-gray-300 font-semibold">Partner 4</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;
