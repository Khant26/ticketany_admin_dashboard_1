import { useState, useEffect } from "react";
import axios from "axios";

function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/categories/");
      setCategories(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch categories");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return setError("Please enter a category name");

    try {
      setIsCreating(true);
      let payload = { category_name: newCategoryName };

      if (newCategoryImage) {
        const base64Image = await toBase64(newCategoryImage);
        payload.category_image = base64Image;
      }

      await axios.post("http://127.0.0.1:8000/api/categories/", payload);

      setNewCategoryName("");
      setNewCategoryImage(null);
      setPreviewUrl(null);
      setError("");
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError("Failed to create category");
    } finally {
      setIsCreating(false);
    }
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    setEditName(category.category_name);
    setEditImage(null);
    setEditPreviewUrl(category.category_image);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditName("");
    setEditImage(null);
    setEditPreviewUrl(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return setError("Please enter a category name");

    try {
      setIsCreating(true);
      let payload = { category_name: editName };

      if (editImage) {
        const base64Image = await toBase64(editImage);
        payload.category_image = base64Image;
      }

      await axios.put(`http://127.0.0.1:8000/api/categories/${editingCategory.id}/`, payload);

      setError("");
      cancelEdit();
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError("Failed to update category");
    } finally {
      setIsCreating(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/categories/${id}/`);
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError("Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Create Category Form */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-5 text-gray-800">
            Create New Category
          </h2>

          <form onSubmit={handleCreateCategory} className="space-y-4">
            <input
              type="text"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />

            <div className="w-full">
              <input
                id="category-image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setNewCategoryImage(file);
                    setPreviewUrl(URL.createObjectURL(file));
                  }
                }}
                className="hidden"
              />

              <label
                htmlFor="category-image-upload"
                className="cursor-pointer inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Choose Image (Optional)
              </label>

              {newCategoryImage && (
                <span className="text-gray-700 font-medium ml-2">
                  {newCategoryImage.name}
                </span>
              )}

              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-md border border-gray-200 mt-2"
                />
              )}
            </div>

            {error && <div className="text-red-500 font-medium">{error}</div>}

            <button
              type="submit"
              disabled={isCreating}
              className={`w-full py-2 rounded-lg font-semibold text-white transition-colors ${
                isCreating
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isCreating ? "Creating..." : "Create Category"}
            </button>
          </form>
        </div>

        {/* Edit Form */}
        {editingCategory && (
          <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold mb-5 text-gray-800">
              Edit Category
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Category Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />

              <div className="w-full">
                <input
                  id="edit-category-image-upload"
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
                  htmlFor="edit-category-image-upload"
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
                    className="h-32 w-32 object-cover rounded-md border border-gray-200 mt-2"
                  />
                )}
              </div>

              {error && <div className="text-red-500 font-medium">{error}</div>}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className={`flex-1 py-2 rounded-lg font-semibold text-white transition-colors ${
                    isCreating
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isCreating ? "Updating..." : "Update Category"}
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

        {/* Categories List */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            All Categories ({categories.length})
          </h2>

          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No categories found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {category.category_image && (
                        <img
                          src={category.category_image}
                          alt={category.category_name}
                          className="w-12 h-12 rounded-full object-cover border border-gray-300"
                        />
                      )}
                      <h3 className="font-semibold text-gray-800 flex-1">
                        {category.category_name}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => startEdit(category)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        title="Edit Category"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        title="Delete Category"
                      >
                        🗑️ Delete
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

export default CategoriesManagement;