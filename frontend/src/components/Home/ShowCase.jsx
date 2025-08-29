const Showcase = () => {
  return (
    <section className="bg-black py-20 px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-blue-500/5 blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* First Showcase */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6 leading-snug">
              Wonderful & Effortless way to{" "}
              <span className="text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.7)]">
                view your finances
              </span>
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Get a complete overview of your financial health with our
              intuitive dashboard. Track expenses, monitor investments, and
              plan for the future all in one place.
            </p>
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 rounded-full text-white font-semibold hover:shadow-[0_0_15px_rgba(34,197,94,0.6)] transition">
              Try It Now
            </button>
          </div>

          <div className="relative">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-6 shadow-xl hover:border-green-500/60 transition">
              <div className="bg-[#111] rounded-2xl p-6">
                <h3 className="text-white text-xl font-semibold mb-6">
                  Financial Overview
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4">
                    <div className="text-white text-sm opacity-80">
                      Net Worth
                    </div>
                    <div className="text-white text-xl font-bold">
                      $125,430
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4">
                    <div className="text-white text-sm opacity-80">
                      This Month
                    </div>
                    <div className="text-white text-xl font-bold">+12.5%</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Checking Account</span>
                    <span className="font-semibold text-white">$8,250</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Savings Account</span>
                    <span className="font-semibold text-white">$45,680</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Investment Portfolio</span>
                    <span className="font-semibold text-white">$71,500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Showcase */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mt-20">
          <div className="lg:order-2">
            <h2 className="text-4xl font-bold text-white mb-6 leading-snug">
              Simple way to{" "}
              <span className="text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.7)]">
                manage your money
              </span>{" "}
              and add transactions
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Add transactions effortlessly with our smart categorization and
              receipt scanning. Never miss a transaction again.
            </p>
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 rounded-full text-white font-semibold hover:shadow-[0_0_15px_rgba(34,197,94,0.6)] transition">
              Learn More
            </button>
          </div>

          <div className="lg:order-1 relative">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-6 shadow-xl hover:border-green-500/60 transition">
              <div className="bg-[#111] rounded-2xl p-6">
                <h3 className="text-white text-xl font-semibold mb-6">
                  Add Transaction
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Amount
                    </label>
                    <div className="bg-gray-800 rounded-lg p-3 text-white text-xl font-semibold">
                      $250.00
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Category
                    </label>
                    <div className="bg-gray-800 rounded-lg p-3 text-white">
                      🍔 Food & Dining
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Description
                    </label>
                    <div className="bg-gray-800 rounded-lg p-3 text-gray-400">
                      Restaurant dinner
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 py-3 rounded-lg text-white font-semibold hover:shadow-[0_0_15px_rgba(34,197,94,0.6)] transition">
                    Add Transaction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
