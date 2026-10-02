import type { YugiohCard } from '../types/card';

export async function fetchRandomCards(count: number = 5): Promise<YugiohCard[]> {
  try {
    const offset = Math.floor(Math.random() * 500);
    const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?num=50&offset=${offset}`);
    const data = await response.json();
    
    const shuffled: YugiohCard[] = data.data.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  } catch (error) {
    console.error("Erreur lors de la récupération des cartes :", error);
    return [];
  }
}