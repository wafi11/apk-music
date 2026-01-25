import { ReactNode } from "react";

interface TitleSectionProps {
  children?: ReactNode;
  title: string;
}
export function TitleSection({ children, title }: TitleSectionProps) {
  return (
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-xl font-semibold">{title}</h3>
      {children}
    </div>
  );
}
