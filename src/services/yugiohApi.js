// Récupérer un lot de cartes aléatoires
export async function fetchRandomCards(count = 5) {
  try {
    // On récupère une sélection de cartes
    const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?num=50&offset=${Math.floor(Math.random() * 500)}`);
    const data = await response.json();
    
    // Mélanger et piocher le nombre demandé
    const shuffled = data.data.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  } catch (error) {
    console.error("Erreur lors de la récupération des cartes :", error);
    return [];
  }
}
