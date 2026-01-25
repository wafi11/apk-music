interface DataProjectsProps {
  name: string;
  link: string;
  image?: string;
  description?: string;
  techStack: string[]; // Perhatikan: saya ubah dari texhStack ke techStack
}

export const DataProjects: DataProjectsProps[] = [
  {
    name: "Udatopup",
    link: "https://udatopup.com",
    image: "/udatopup.png",
    description: "Website Topup dan juga PPOB",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Golang",
      "PostgreSQL",
      "Duitku",
    ],
  },
  {
    name: "zgame.id",
    link: "https://zgame.id",
    image: "/cabang3.webp",
    description:
      "Platform topup game online terpercaya dengan harga terjangkau",
    techStack: ["React", "Node.js", "Golang", "Postgresql", "Duitku"],
  },
  {
    name: "udagim.id",
    link: "https://udagim.id",
    image: "/cabang1.webp",
    description: "Layanan digital dan topup game dengan sistem otomatis",
    techStack: [
      "Next.js",
      "TypeScript",
      "Postgresql",
      "Golang",
      "Redis",
      "Duitku",
      "API Integration",
    ],
  },
];
