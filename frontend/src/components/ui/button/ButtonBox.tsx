import { ReactNode } from "react";
import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";

interface ButtonBoxProps extends ButtonProps {
  children?: ReactNode;
  className?: string;
}
export function ButtonBox({ children, className }: ButtonBoxProps) {
  return (
    <Button
      className={cn(
        "border-primary border-2 rounded-none font-semibold hover:text-black bg-transparent text-white",
        className
      )}
    >
      {children}
    </Button>
  );
}
