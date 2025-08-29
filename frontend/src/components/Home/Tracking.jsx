const Tracking = () => {
  return (
    <section className="bg-black py-20 px-6 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Keep a track of your{" "}
              <span className="text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.6)]">
                transactions
              </span>{" "}
              easily
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Monitor all your transactions in real-time with intelligent
              categorization, spending insights, and customizable alerts to stay
              on top of your finances.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Automatic transaction categorization",
                "Real-time spending alerts",
                "Detailed spending analytics",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 text-white"
                >
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-4 rounded-full text-white font-semibold hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] transition">
              Start Tracking
            </button>
          </div>

          {/* Right Stat Cards */}
          <div className="grid grid-cols-2 gap-6">
            {[
              {
                title: "Expenses",
                value: "$2,150",
                color: "from-red-500 to-pink-500",
                text: "text-red-400",
              },
              {
                title: "Income",
                value: "$4,200",
                color: "from-green-500 to-emerald-500",
                text: "text-green-400",
              },
              {
                title: "Savings",
                value: "$2,050",
                color: "from-blue-500 to-cyan-500",
                text: "text-blue-400",
              },
              {
                title: "Investments",
                value: "$1,850",
                color: "from-purple-500 to-pink-500",
                text: "text-purple-400",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-black rounded-2xl p-6 border border-gray-800 hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition transform hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl mb-4 flex items-center justify-center shadow-md`}
                ></div>
                <h3 className="text-white text-lg font-semibold mb-2">
                  {card.title}
                </h3>
                <div className={`text-2xl font-bold ${card.text}`}>
                  {card.value}
                </div>
                <div className="text-sm text-gray-500">This month</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tracking;
