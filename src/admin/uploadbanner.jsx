import { useState, useEffect } from "react";
import axios from "axios";

function UploadBanner() {
  const [banners, setBanners] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState(null);

  const fetchBanners = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/banners/");
      const sortedBanners = res.data.sort((a, b) => a.order - b.order);
      setBanners(sortedBanners);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch banners");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return setError("Please select lee pll an image");
    if (!title.trim()) return setError("Please enter a banner title");

    try {
      setIsUploading(true);
      const base64Image = await toBase64(selectedImage);
      const payload = { banner_name: title, banner_image: [base64Image] };
      await axios.post("http://127.0.0.1:8000/api/banners/", payload);

      setSelectedImage(null);
      setPreviewUrl(null);
      setTitle("");
      setError("");
      fetchBanners();
    } catch (err) {
      console.error(err);
      setError("Failed to upload banner");
    } finally {
      setIsUploading(false);
    }
  };

  const removeBanner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/banners/${id}/`);
      fetchBanners();
    } catch {
      setError("Failed to delete banner");
    }
  };

  const moveUp = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/banners/${id}/move_up/`);
      fetchBanners(); // refresh from backend
    } catch {
      setError("Failed to move banner up");
    }
  };

  const moveDown = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/banners/${id}/move_down/`);
      fetchBanners(); // refresh from backend
    } catch {
      setError("Failed to move banner down");
    }
  };

  const startEdit = (banner) => {
    setEditingBanner(banner);
    setEditTitle(banner.banner_name);
    setEditImage(null);
    setEditPreviewUrl(banner.banner_image[0]);
  };

  const cancelEdit = () => {
    setEditingBanner(null);
    setEditTitle("");
    setEditImage(null);
    setEditPreviewUrl(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return setError("Please enter a banner title");

    try {
      setIsUploading(true);
      let payload = { banner_name: editTitle };

      if (editImage) {
        const base64Image = await toBase64(editImage);
        payload.banner_image = [base64Image];
      }

      await axios.put(`http://127.0.0.1:8000/api/banners/${editingBanner.id}/`, payload);

      setError("");
      cancelEdit();
      fetchBanners();
    } catch (err) {
      console.error(err);
      setError("Failed to update banner");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Upload Form */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-5 text-gray-800">
            Upload New Banner
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Banner Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />

            <div className="w-full">
              <input
                id="banner-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSelectedImage(file);
                    setPreviewUrl(URL.createObjectURL(file));
                  }
                }}
                className="hidden"
              />

              <label
                htmlFor="banner-upload"
                className="cursor-pointer inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Choose Image
              </label>

              {selectedImage && (
                <span className="text-gray-700 font-medium ml-2">
                  {selectedImage.name}
                </span>
              )}

              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-48 w-full object-contain rounded-md border border-gray-200 mt-2"
                />
              )}
            </div>

            {error && <div className="text-red-500 font-medium">{error}</div>}

            <button
              type="submit"
              disabled={isUploading}
              className={`w-full py-2 rounded-lg font-semibold text-white transition-colors ${
                isUploading
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload Banner"}
            </button>
          </form>
        </div>

        {/* Edit Form */}
        {editingBanner && (
          <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold mb-5 text-gray-800">
              Edit Banner
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Banner Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />

              <div className="w-full">
                <input
                  id="edit-banner-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setEditImage(file);
                      setEditPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                />

                <label
                  htmlFor="edit-banner-upload"
                  className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Change Image
                </label>

                {editImage && (
                  <span className="text-gray-700 font-medium ml-2">
                    {editImage.name}
                  </span>
                )}

                {editPreviewUrl && (
                  <img
                    src={editPreviewUrl}
                    alt="Edit Preview"
                    className="h-48 w-full object-contain rounded-md border border-gray-200 mt-2"
                  />
                )}
              </div>

              {error && <div className="text-red-500 font-medium">{error}</div>}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`flex-1 py-2 rounded-lg font-semibold text-white transition-colors ${
                    isUploading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isUploading ? "Updating..." : "Update Banner"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Banners - Grid Layout */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            All Banners ({banners.length})
          </h2>

          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              Loading banners...
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No banners uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <img
                    src={banner.banner_image[0]}
                    alt={banner.banner_name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 truncate">
                      {banner.banner_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Order: {banner.order}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => moveUp(banner.id)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                        title="Move Up"
                      >
                        ⬆️
                      </button>
                      <button
                        onClick={() => moveDown(banner.id)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                        title="Move Down"
                      >
                        ⬇️
                      </button>
                      <button
                        onClick={() => startEdit(banner)}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        title="Edit Banner"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => removeBanner(banner.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        title="Delete Banner"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadBanner;
