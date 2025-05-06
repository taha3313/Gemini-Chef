/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { logout } from "../services/auth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Favorites() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    async function fetchRecipes() {
      try {
        const res = await fetch("https://localhost:7155/api/recipe/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          logout();
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch recipes");

        const data = await res.json();
        setRecipes(data);
      } catch (err) {
        alert("Failed to load recipes.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedRecipe) return;

    try {
      const res = await fetch(
        `https://localhost:7155/api/recipe/favorites/${selectedRecipe.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete favorite");

      setRecipes(recipes.filter((r) => r.id !== selectedRecipe.id));
      setShowModal(false);
    } catch (err) {
      alert("Error deleting recipe");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-lime-700">Loading recipes...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold text-lime-800 mb-6">
        🍲 My Favorite Recipes
      </h2>

      {recipes.length === 0 ? (
        <p className="text-gray-600">No recipes found.</p>
      ) : (
        <ul className="space-y-6">
          {recipes.map((recipe) => (
            <li
              key={recipe.id}
              className="p-5 bg-orange-50 border border-orange-200 rounded-lg shadow"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-amber-800">{recipe.title}</h3>
                <button
                  className="text-red-600 hover:text-red-800 font-bold"
                  onClick={() => {
                    setSelectedRecipe(recipe);
                    setShowModal(true);
                  }}
                >
                  Delete
                </button>
              </div>

              <div>
                <pre className="whitespace-pre-wrap mt-2 text-sm text-gray-700">
                <div
        className="prose prose-amber prose-sm sm:prose lg:prose-lg dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: recipe.content.slice(0, 100) }}
      />
                  ...
                </pre>

                <button
                  className="mt-2 text-lime-600 hover:text-lime-800 font-semibold"
                  onClick={() => {
                    const newRecipes = [...recipes];
                    const index = newRecipes.findIndex((r) => r.id === recipe.id);
                    newRecipes[index].showFullContent = !newRecipes[index].showFullContent;
                    setRecipes(newRecipes);
                  }}
                >
                  {recipe.showFullContent ? "Show Less" : "Show More"}
                </button>

                {recipe.showFullContent && (
                  <div className="mt-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {recipe.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {showModal && selectedRecipe && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Delete Recipe
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to remove "{selectedRecipe.title}" from your
              favorites?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
