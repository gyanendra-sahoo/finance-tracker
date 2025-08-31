import { User } from "lucide-react";
import React from "react";

const OurPlatform = () => {
  return (
    <div className="px-6 py-16 max-w-7xl mx-auto bg-[#FCFBFC]">
      {/* Time Saving Part */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 mb-20">
        {/* Left */}
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight text-gray-900">
            Save Time By Having <br className="hidden sm:block" /> Everything In
            One Platform
          </h1>
        </div>

        {/* Right */}
        <div className="flex-1 text-center md:text-right">
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            With decades of experience and a commitment to <br className="hidden sm:block" /> 
            personalized service, we ensure a seamless journey.
          </p>
          <button className="mt-6 bg-[#6265B8] hover:bg-[#4b4ea3] rounded-full px-6 py-3 text-sm sm:text-md font-semibold text-white shadow-md transition-transform transform hover:-translate-y-1">
            See More
          </button>
        </div>
      </div>

      {/* Impact Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* Users */}
        <div className="p-6">
          <div className="flex gap-3 justify-center items-center mb-4">
            <User className="w-6 h-6 text-[#6265B8]" />
            <p className="text-lg font-semibold text-gray-800">Users</p>
          </div>
          <p className="text-4xl sm:text-5xl font-light text-gray-900 mb-3">
            2,500+
          </p>
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae,
            numquam aut. Nobis, totam.
          </p>
        </div>

        {/* Impact */}
        <div className="p-6 border-l border-gray-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Impact</h3>
          <p className="text-4xl sm:text-5xl font-light text-gray-900 mb-3">
            90%
          </p>
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae,
            numquam aut. Nobis, totam. Deleniti, eligendi.
          </p>
        </div>

        {/* Experience */}
        <div className="p-6 border-l border-gray-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Experience</h3>
          <p className="text-4xl sm:text-5xl font-light text-gray-900 mb-3">
            1 year
          </p>
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae,
            numquam aut. Nobis, totam. Deleniti, eligendi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurPlatform;
