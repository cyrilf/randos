export default function (difficulty: string | undefined) {
  const difficultyColors = {
    Facile: "success" as const,
    Moyenne: "warning" as const,
    Difficile: "error" as const,
    default: "neutral" as const,
  };
  return difficultyColors[(difficulty || "default") as keyof typeof difficultyColors] || "neutral";
}
