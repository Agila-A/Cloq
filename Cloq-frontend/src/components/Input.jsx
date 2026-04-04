import { forwardRef } from "react";
import { cn } from "../utils/cn";

export const Input = forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full relative">
      {label && <label className="text-sm font-medium text-slate-300 ml-1">{label}</label>}
      <input
        ref={ref}
        className={cn(
          "input-field peer focus:shadow-[0_0_15px_rgba(37,99,235,0.2)]",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500 ml-1 absolute -bottom-5">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";
