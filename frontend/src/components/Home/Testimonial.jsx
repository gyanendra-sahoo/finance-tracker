import { Star } from "lucide-react";

const Testimonial = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b19b5665?w=100&h=100&fit=crop&crop=face",
      text: "FinTrack has completely transformed how I manage my finances. The insights are incredible and have helped me save over $3,000 this year.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      text: "The best financial app I've ever used. Clean interface, powerful features, and excellent customer support. Highly recommend!",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Small Business Owner",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      text: "As a business owner, tracking expenses was a nightmare. FinTrack made it simple and automated. It's been a game-changer.",
      rating: 5,
    },
  ];

  return (
    <section className="bg-[#111] py-20 px-6 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            What Our{" "}
            <span className="text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.7)]">
              Users Say
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Join thousands of satisfied users who've transformed their financial
            lives
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-black p-8 rounded-2xl border border-gray-800 hover:border-green-500/40 hover:shadow-[0_0_25px_rgba(34,197,94,0.2)] transition transform hover:-translate-y-2"
            >
              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]"
                  />
                ))}
              </div>

              {/* Feedback */}
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* User */}
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full ring-2 ring-green-500/40 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
                />
                <div>
                  <div className="text-white font-semibold">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
