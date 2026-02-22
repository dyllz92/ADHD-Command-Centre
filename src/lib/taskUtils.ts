export const parseTags = (task: { tags: string }) => {
  if (!task.tags) return [] as string[];
  try {
    const parsed = JSON.parse(task.tags) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return task.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  }
};

export const formatTags = (tags: string[]) => JSON.stringify(tags);
