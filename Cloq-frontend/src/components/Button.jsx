import { cn } from "../utils/cn";
import { Loader2 } from "lucide-react";

export const Button = ({ className, variant = "primary", isLoading, children, ...props }) => {
  const base = "font-medium py-2 px-4 rounded-lg transition-all duration-300 focus:outline-none flex items-center justify-center gap-2 relative overflow-hidden";
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]",
    secondary: "bg-dark-700 hover:bg-slate-600 border border-slate-600 text-white",
    danger: "bg-red-600/90 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]",
    ghost: "bg-transparent hover:bg-white/10 text-slate-300 hover:text-white"
  };

  return (
    <button 
      className={cn(base, variants[variant], isLoading && "opacity-80 cursor-wait", className)} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};
