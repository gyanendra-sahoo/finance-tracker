import { Shield, TrendingUp, Users } from "lucide-react";

const Reason = () => {
  const reasons = [
    {
      icon: <Users className="w-12 h-12" />,
      title: "Trusted by Millions",
      description:
        "Join over 10 million users who trust us with their financial data and rely on our platform daily.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Proven Results",
      description:
        "Our users save an average of $500+ per month and increase their net worth by 25% annually.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Bank-Grade Security",
      description:
        "Your financial data is protected with the same security standards used by major banks worldwide.",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section className="bg-black py-20 px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-blue-500/5 blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Key reasons to{" "}
            <span className="text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.7)]">
              choose us
            </span>{" "}
            over others
          </h2>
          <p className="text-lg text-gray-400">
            Why millions of users trust FinTrack for their financial management
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-2xl text-center transition hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              <div
                className={`bg-gradient-to-r ${reason.color} p-4 rounded-full flex justify-center items-center w-16 h-16 mx-auto mb-6 shadow-lg`}
              >
                <div className="text-white">{reason.icon}</div>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                {reason.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reason;
