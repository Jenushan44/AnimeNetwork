import { auth } from "../firebase";

export const handleAddShelf = async (anime, setPopupMsg = null, navigate = null) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("No user logged in.");
    if (setPopupMsg) {
      setPopupMsg("You must be logged in to add to your shelf");
      setTimeout(() => setPopupMsg(null), 3000);
    }
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

  if (response.status === 409) {
    if (setPopupMsg) {
      setPopupMsg("Anime already in your list");
      setTimeout(() => setPopupMsg(null), 3000);
    }
    return;
  }

  if (setPopupMsg) {
    setPopupMsg("Added to your shelf");
    setTimeout(() => setPopupMsg(null), 3000);
  }

  if (navigate) {
    navigate("/list", { state: { editId: anime.id } });
  }
};
