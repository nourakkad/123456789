"use client";

import { motion } from "framer-motion";

export default function OurValues() {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Values</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              What drives us every day
            </p>
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center py-12 gap-8">
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-2xl md:text-3xl font-semibold text-primary mb-4 w-full flex justify-start"
          >
            Integrity
          </motion.div>
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-2xl md:text-3xl font-semibold text-primary mb-4 w-full flex justify-end"
          >
            Innovation
          </motion.div>
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-2xl md:text-3xl font-semibold text-primary mb-4 w-full flex justify-start"
          >
            Quality
          </motion.div>
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-2xl md:text-3xl font-semibold text-primary mb-4 w-full flex justify-end"
          >
            Teamwork
          </motion.div>
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-2xl md:text-3xl font-semibold text-primary mb-4 w-full flex justify-start"
          >
            Customer Focus
          </motion.div>
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-2xl md:text-3xl font-semibold text-primary mb-4 w-full flex justify-end"
          >
            Sustainability
          </motion.div>
        </div>
      </div>
    </section>
  );
} 