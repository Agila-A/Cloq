import { cn } from "../utils/cn";
import { motion } from "framer-motion";

export const Card = ({ className, children, ...props }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn("glass-card overflow-hidden", className)} 
      {...props}
    >
      {children}
    </motion.div>
  );
};
