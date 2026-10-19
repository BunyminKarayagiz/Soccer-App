import { removeFav } from "../services/userService";
import { useNavigate } from "react-router-dom";

export const useFavorites = (
  currentUser,
  emailVerified,
  setList,
  itemType,
  idField = "id",
) => {
  const navigate = useNavigate();

  const handleRemove = async (itemID) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (!emailVerified) {
      navigate("/verify-email");
      return;
    }

    const updated = await removeFav(currentUser.uid, itemID, itemType, idField);
    if (updated) setList(updated);
  };

  return { handleRemove };
};