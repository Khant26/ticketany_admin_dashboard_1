import { useState, useEffect } from "react";
import AdminImageSlider from "./adminImageSlider";
import axios from "axios";

// ...existing code...
function AdminBanner() {
  const [banner, setBanner] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/banners/");
        const bannerData = response.data.map((b) => ({
          id: b.id,
          image:
            b.banner_image && b.banner_image.length > 0
              ? b.banner_image[0]
              : "https://via.placeholder.com/1200x400",
          description: b.banner_name || "Event Banner",
        }));
        console.log("Banner images:", bannerData.map((b) => b.image));
        setBanner(bannerData);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  if (banner.length === 0) return null;

  return (
    <>
    <div className="relative group mx-auto rounded-xl w-full max-w-[1060px] ">
      <AdminImageSlider banner={banner} />
    </div>
    </>
  );
}

export default AdminBanner;