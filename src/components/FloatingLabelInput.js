"use client";

import { useState } from "react";
import { motion } from "framer-motion"; // Using framer-motion as it's already in the project
import { cn } from "@/components/lib/utils"; // Corrected path for our project structure

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const letterVariants = {
  initial: {
    y: 0,
    color: "hsl(var(--foreground))", // Use theme variable for text color
  },
  animate: {
    y: "-120%",
    color: "hsl(var(--primary))", // Use theme variable for focused label color
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

/**
 * An input component with a floating label that animates letter by letter.
 * Adapted from the user-provided component to fit the project's JS and theme structure.
 * @param {object} props - Extends standard HTML input attributes.
 * @param {string} props.label - The text for the floating label.
 */
export const FloatingLabelInput = ({
  label,
  className = "",
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const showLabel = isFocused || (value && value.length > 0);

  return (
    <div className={cn("relative", className)}>
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 pointer-events-none text-foreground"
        variants={containerVariants}
        initial="initial"
        animate={showLabel ? "animate" : "initial"}
      >
        {label.split("").map((char, index) => (
          <motion.span
            key={index}
            className="inline-block text-base" // Use text-base to match other inputs
            variants={letterVariants}
            style={{ willChange: "transform" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>

      <input
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={value}
        {...props}
        className="outline-none border-b-2 border-input py-2 w-full text-base font-medium text-foreground bg-transparent placeholder-transparent focus:border-primary"
      />
    </div>
  );
};