import { motion } from "motion/react";
import { toggleSignupModal } from "../../redux/slices/modalSlice";
import { useDispatch } from "react-redux";
const Hero = () => {

  const dispatch = useDispatch();

  return (
    <section className="bg-black text-white pt-28 pb-20 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
        initial={{ opacity:0, scale:0 }}
        animate={{ opacity:1, scale:1, duration:0.3 }}
        className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Manage your money in the{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-lg">
                best possible way
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
              Take control of your financial future with our comprehensive
              tracking tools, smart insights, and personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
              whileTap={{scale: 0.9}}
              initial={{opacity: 0, scale: 0}}
              animate={{opacity: 1, scale: 1, duration: 0.3}}
              onClick={() => dispatch(toggleSignupModal())}
              className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:border-green-300 cursor-pointer">
                Start Free Trial
              </motion.button>
              <motion.button 
              whileTap={{scale: 0.9}}
              className="border border-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-green-300 cursor-pointer">
                Watch Demo
              </motion.button>
            </div>
            <div className="flex items-center mt-10 space-x-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">10M+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">4.9★</div>
                <div className="text-sm text-gray-400">App Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">$2B+</div>
                <div className="text-sm text-gray-400">Tracked</div>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="relative z-10">
              <img
                src="/images/chart.png"
                alt="chart"
                className="w-[40vw] mx-auto drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-blue-500/20 blur-3xl"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
