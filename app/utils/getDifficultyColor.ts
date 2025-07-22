export default function (difficulty: string | undefined) {
  const difficultyColors = {
    facile: "success" as const,
    moyenne: "warning" as const,
    difficile: "error" as const,
    default: "neutral" as const,
  };
  return difficultyColors[(difficulty || "default") as keyof typeof difficultyColors] || "neutral";
}
