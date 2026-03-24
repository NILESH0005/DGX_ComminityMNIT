import { useContext } from "react";
import ApiContext from "../context/ApiContext";

export const useUserBadges = () => {
  const { fetchData, user, userToken } = useContext(ApiContext);

  const getUserBadges = async (userId) => {
    try {
      console.log("Fetching badges for user:", userId);

      if (!userId) return [];

      const result = await fetchData(`api/getUserbadges`, "GET", {}, {
        "Content-Type": "application/json",
        "auth-token": userToken,
      });

      console.log("API RESULT:", result);
      console.log("BADGE IMAGE:", result?.data?.[0]?.badge);

      if (!result?.success) {
        throw new Error(result?.message || "Failed to fetch badges");
      }

      return result.data.map((b) => ({
        id: b.badgeId,
        name: b.badgeName,
        order: b.badgeOrder,
        isActive: b.badgeIsActive,
        active: Boolean(b.active),
        image: b.badge,
      }));
    } catch (err) {
      console.error("Error fetching badges:", err);
      return [];
    }
  };

  return { getUserBadges };
};
