import { auth } from "../firebase";

export const handleAddShelf = async (anime) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("No user logged in.");
    return;
  }

  const token = await user.getIdToken();
  if (!anime) return;

  const response = await fetch("http://localhost:5000/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      title: anime.title.english || "Unknown Title",
      genre: anime.genres?.join(", ") || "Unknown",
      score: "-",
      status: "Watching",
      episodes: anime.episodes || 0,
      coverImage: anime.coverImage.large,
      anilist_id: anime.id,
      format: anime.format || "TV"
    })
  });

  const result = await response.json();
  console.log(result);
}
