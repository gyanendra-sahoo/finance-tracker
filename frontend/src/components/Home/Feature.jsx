import { BarChart3, Eye, Shield, Zap } from "lucide-react";

const Feature = () => {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Smart Analytics",
      description:
        "Advanced analytics and insights to understand your spending patterns and financial habits.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bank-Level Security",
      description:
        "Your data is protected with 256-bit encryption and multi-factor authentication.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-Time Sync",
      description:
        "Automatic synchronization across all your devices and bank accounts.",
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Budget Tracking",
      description:
        "Set budgets and track your progress with intelligent notifications and alerts.",
    },
  ];

  return (
    <section id="features" className="bg-black py-20 px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-blue-500/5 blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            What makes us{" "}
            <span className="text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.7)]">
              different?
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            Powerful features designed to simplify your financial life
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-2xl 
              hover:border-green-500/60 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] 
              transition duration-300 group"
            >
              <div className="text-green-400 mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
