import React from 'react'
import { Check, Star, Shield } from "lucide-react";

const TestimonialSection = ({ testimonials }) => {
  return (
    <div className="py-20 bg-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">

              Trusted by Proffessionals Wordwide
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">

              See about our user have to say about CloudShare
            </p>

          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow transform transition duration-500 hover:scale-105">
                <div className="p-8">

                  <div className="flex items-center">
                    <div className="shrink-0 h-12 w-12">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full"
                      />

                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>

                    </div>

                  </div>
                  <div className="mt-4 flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < testimonial.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4">
                    <p className="text-base italic text-gray-600">
                      "{testimonial.quote} "
                    </p>

                  </blockquote>
                </div>

              </div>
            )
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default TestimonialSection;
