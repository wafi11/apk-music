import { cn } from "@/lib/utils";

interface TitleComponentProps {
  text: string;
  className?: string;
}
export function TitleComponent({ text, className }: TitleComponentProps) {
  return (
    <h3
      className={cn(
        "text-2xl w-fit mb-4 font-bold bebas border-b-4  border-primary",
        className
      )}
    >
      {text}
    </h3>
  );
}
