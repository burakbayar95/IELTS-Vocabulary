import { GoogleGenAI, Type } from "@google/genai";
import { VocabularyItem } from "../types";

// Initialize Gemini Client
// We assume process.env.API_KEY is available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchVocabularyList = async (count: number = 10): Promise<VocabularyItem[]> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Generate a list of ${count} distinct A1 or A2 level Turkish words that are commonly used in daily life.
      For each word, provide the English translation and a short English definition.
      Ensure the words are simple nouns, verbs, or adjectives suitable for a beginner.
      Do not include phrases, only single words.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              turkish: {
                type: Type.STRING,
                description: "The Turkish word (e.g., Mutlu)",
              },
              english: {
                type: Type.STRING,
                description: "The English translation (e.g., Happy)",
              },
              definition: {
                type: Type.STRING,
                description: "The English definition (e.g., Feeling or showing pleasure)",
              },
            },
            required: ["turkish", "english", "definition"],
          },
        },
        systemInstruction: "You are a helpful language tutor designed to help Turkish speakers learn English spelling.",
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as VocabularyItem[];
      // Normalize data (lowercase trim) to make checking easier later
      return data.map(item => ({
        turkish: item.turkish,
        english: item.english.toLowerCase().trim(),
        definition: item.definition
      }));
    }

    throw new Error("No data returned from Gemini");

  } catch (error) {
    console.error("Error fetching vocabulary:", error);
    // Extended Fallback list for offline usage or GitHub Pages demo without API Key
    const fallbackList: VocabularyItem[] = [
      { turkish: "Elma", english: "apple", definition: "A round fruit with red or green skin." },
      { turkish: "Kitap", english: "book", definition: "A set of pages with writing on them." },
      { turkish: "Su", english: "water", definition: "A clear liquid that falls as rain." },
      { turkish: "Mutlu", english: "happy", definition: "Feeling or showing pleasure." },
      { turkish: "Kırmızı", english: "red", definition: "The color of blood or fire." },
      { turkish: "Okul", english: "school", definition: "A place where children learn." },
      { turkish: "Kedi", english: "cat", definition: "A small animal kept as a pet." },
      { turkish: "Köpek", english: "dog", definition: "An animal often kept as a pet or for guarding." },
      { turkish: "Araba", english: "car", definition: "A road vehicle with an engine and four wheels." },
      { turkish: "Ev", english: "house", definition: "A building for people to live in." },
      { turkish: "Kapı", english: "door", definition: "A movable entrance to a room or building." },
      { turkish: "Pencere", english: "window", definition: "An opening in a wall to let in light and air." },
      { turkish: "Masa", english: "table", definition: "A piece of furniture with a flat top and legs." },
      { turkish: "Sandalye", english: "chair", definition: "A seat with a back for one person." },
      { turkish: "Kalem", english: "pen", definition: "A tool for writing with ink." },
      { turkish: "Defter", english: "notebook", definition: "A book of plain paper for writing on." },
      { turkish: "Bilgisayar", english: "computer", definition: "An electronic machine for storing and processing data." },
      { turkish: "Telefon", english: "phone", definition: "A device used for talking to someone who is far away." },
      { turkish: "Arkadaş", english: "friend", definition: "A person you know well and like." },
      { turkish: "Aile", english: "family", definition: "A group of parents and children." },
      { turkish: "Anne", english: "mother", definition: "A female parent." },
      { turkish: "Baba", english: "father", definition: "A male parent." },
      { turkish: "Çocuk", english: "child", definition: "A young human being." },
      { turkish: "Güneş", english: "sun", definition: "The star that gives light and heat to the earth." },
      { turkish: "Ay", english: "moon", definition: "The natural satellite of the earth." },
      { turkish: "Deniz", english: "sea", definition: "The salt water that covers most of the earth's surface." },
      { turkish: "Ağaç", english: "tree", definition: "A tall plant with a trunk and branches." },
      { turkish: "Çiçek", english: "flower", definition: "The part of a plant that is often brightly colored." },
      { turkish: "Kuş", english: "bird", definition: "An animal with feathers and wings." },
      { turkish: "Ekmek", english: "bread", definition: "A food made from flour and water, baked." },
      { turkish: "Süt", english: "milk", definition: "A white liquid produced by female mammals." },
      { turkish: "Çay", english: "tea", definition: "A drink made by pouring hot water on dried leaves." },
      { turkish: "Kahve", english: "coffee", definition: "A hot drink made from roasted coffee beans." },
      { turkish: "Yemek", english: "food", definition: "Something that people and animals eat." },
      { turkish: "Sabah", english: "morning", definition: "The early part of the day." },
      { turkish: "Akşam", english: "evening", definition: "The end of the day and early part of the night." },
      { turkish: "Gece", english: "night", definition: "The time when it is dark and people sleep." },
      { turkish: "Bugün", english: "today", definition: "The present day." },
      { turkish: "Yarın", english: "tomorrow", definition: "The day after today." },
      { turkish: "Evet", english: "yes", definition: "Used to give an affirmative response." },
      { turkish: "Hayır", english: "no", definition: "Used to give a negative response." },
      { turkish: "Lütfen", english: "please", definition: "Used to ask for something politely." },
      { turkish: "Teşekkürler", english: "thanks", definition: "An expression of gratitude." },
      { turkish: "Merhaba", english: "hello", definition: "A greeting." },
      { turkish: "Büyük", english: "big", definition: "Large in size." },
      { turkish: "Küçük", english: "small", definition: "Little in size." },
      { turkish: "Sıcak", english: "hot", definition: "Having a high temperature." },
      { turkish: "Soğuk", english: "cold", definition: "Having a low temperature." },
      { turkish: "Hızlı", english: "fast", definition: "Moving quickly." },
      { turkish: "Yavaş", english: "slow", definition: "Moving without much speed." }
    ];
    
    // Shuffle and return a subset
    return fallbackList.sort(() => 0.5 - Math.random()).slice(0, count);
  }
};