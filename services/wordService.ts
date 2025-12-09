import { VocabularyItem } from "../types";
import { vocabularyList } from "./vocabulary";

export const fetchVocabularyList = async (count: number = 10): Promise<VocabularyItem[]> => {
  // Simulate a small delay for better UX (so the loading spinner shows briefly)
  await new Promise(resolve => setTimeout(resolve, 600));

  // Shuffle the array randomly
  const shuffled = [...vocabularyList].sort(() => 0.5 - Math.random());

  // Return the requested number of items, cleaned up
  return shuffled.slice(0, count).map(item => ({
    ...item,
    // Remove "to " from start of verbs (case insensitive), and trim whitespace
    english: item.english.replace(/^to\s+/i, '').trim(),
    // Ensure definition is passed (it's already in the object but good to be explicit if we were transforming)
    definition: item.definition
  }));
};