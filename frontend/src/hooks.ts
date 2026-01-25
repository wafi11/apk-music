export const scrollToComponent = (to: string) => {
  const element = document.getElementById(to);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};
