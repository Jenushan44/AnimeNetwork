
export const handleAddShelf = async (anime) => {

  if (!anime) return;

  const res = await fetch("http://localhost:5000/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: anime.title.english,
      anilist_id: anime.id,
      genre: "N/A",
      score: "-",
      status: "-",
      episodes: anime.episodes || 0,
      coverImage: anime.coverImage.large,
      format: anime.format
    })
  });


  return res.json();
}
