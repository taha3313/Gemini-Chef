import React from "react";
import IngredientsList from "./components/IngredientsList";
import ClaudeRecipe from "./components/ClaudeRecipe";
import { getRecipeFromGemini } from "./ai";
import { useNavigate } from "react-router-dom";

export default function Main() {
    const [ingredients, setIngredients] = React.useState([]);
    const [recipe, setRecipe] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [input, setInput] = React.useState("");
    const [suggestions, setSuggestions] = React.useState([]);
    const recipeSection = React.useRef(null);
    const [title, setTitle] = React.useState("Generated Recipe");
    const [isFavoriteModalVisible, setIsFavoriteModalVisible] = React.useState(false);
    const navigate = useNavigate();
    const [isLoginWarningVisible, setIsLoginWarningVisible] = React.useState(false);
    React.useEffect(() => {
        if (recipe !== "" && recipeSection.current !== null) {
            recipeSection.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [recipe]);

    React.useEffect(() => {
        const controller = new AbortController();

        async function fetchSuggestions() {
            if (input.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const res = await fetch(`https://localhost:7155/api/ingredient/search?query=${input}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    signal: controller.signal
                });
                const data = await res.json();
                setSuggestions(data);
            } catch (err) {
                if (err.name !== "AbortError") console.error(err);
            }
        }

        fetchSuggestions();
        return () => controller.abort();
    }, [input]);
    function removeIngredient(name) {
        setIngredients((prev) => prev.filter((i) => i !== name));
      }
      
    async function addIngredientToDatabase(name) {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsLoginWarningVisible(true);
            setTimeout(() => {
                setIsLoginWarningVisible(false);
                navigate("/login");
            }, 2000); // show for 2 seconds before redirecting
            return;
        }
        const response = await fetch("https://localhost:7155/api/ingredient", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ name })
        });

        if (!response.ok && response.status !== 409) {
            const text = await response.text();
            alert("Error adding ingredient: " + text);
        }
    }

    async function addIngredient(name) {
        if (!ingredients.includes(name)) {
            setIngredients(prev => [...prev, name]);
            await addIngredientToDatabase(name);
        }
        setInput("");
        setSuggestions([]);
    }
     function extractTitleFromHtml(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
    
        const titleElement = doc.querySelector('.recipetitle');
        return titleElement ? titleElement.textContent.trim() : null;
    }
    
    async function getRecipe() {
        setLoading(true);
        try {
            const recipeMarkdown = await getRecipeFromGemini(ingredients);
            setRecipe(recipeMarkdown);
            const extractedTitle = extractTitleFromHtml(recipeMarkdown);
            setTitle(extractedTitle || "Generated Recipe");
        } catch (error) {
            console.error("Error fetching recipe:", error);
        } finally {
            setLoading(false);
        }
    }

    async function addToFavorites() {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsLoginWarningVisible(true);
            setTimeout(() => {
                setIsLoginWarningVisible(false);
                navigate("/login");
            }, 2000); 
            return;
        }
        
    
        try {
            const response = await fetch("https://localhost:7155/api/recipe/favorites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,         // Replace with your actual title variable if needed
                    content: recipe,                   // `recipe` should be your generated recipe text
                    ingredients: ingredients           // Array of ingredient names: ["Egg", "Milk", "Flour"]
                })
            });
    
            if (response.ok) {
                setIsFavoriteModalVisible(true);
                setTimeout(() => setIsFavoriteModalVisible(false), 2000); // Hide modal after 2 seconds
            } else {
                const errorText = await response.text();
                alert("Failed to add to favorites: " + errorText);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    }

    return (
        <main className="px-6 py-8 bg-orange-50 min-h-screen">
            <div className="max-w-xl mx-auto">
                <div className="flex flex-col gap-2 mb-6">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Search or add ingredient"
                        className="px-4 py-2 border border-lime-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
                    />
                    {input && suggestions.length > 0 && (
                        <ul className="bg-white border border-gray-200 rounded-md shadow-md divide-y">
                            {suggestions.map(s => (
                                <li
                                    key={s.id}
                                    onClick={() => addIngredient(s.name)}
                                    className="px-4 py-2 hover:bg-lime-100 cursor-pointer text-lime-800"
                                >
                                    {s.name}
                                </li>
                            ))}
                        </ul>
                    )}
                    {input && suggestions.length === 0 && (
                        <div className="text-sm text-gray-600">
                            <p>
                                No match.{" "}
                                <button
                                    onClick={() => addIngredient(input)}
                                    className="text-lime-700 font-semibold hover:underline"
                                >
                                    Add "{input}"
                                </button>
                            </p>
                        </div>
                    )}
                </div>

                {ingredients.length > 0 && (
                    <div ref={recipeSection} className="mt-6">
                        <IngredientsList ingredients={ingredients} getRecipe={getRecipe} removeIngredient={removeIngredient} />
                    </div>
                )}

                {loading && (
                    <div className="mt-6 text-center text-gray-600 text-sm">
                        <p>Loading recipe...</p>
                    </div>
                )}

                {recipe && !loading && (
                    <div className="mt-6 relative">
                        <button
                            onClick={addToFavorites}
                            className="absolute top-4 right-2 bg-gray-700 text-white px-3 py-1.5 text-sm rounded-md hover:bg-gray-800 transition z-10"
                        >
                            <span role="img" aria-label="heart" className="text-red-500">❤️</span> Save to Favorites
                        </button>
                        <ClaudeRecipe recipe={recipe} />
                    </div>
                )}

                {/* Favorite modal */}
                {isFavoriteModalVisible && (
                    <div className="fixed bottom-4 right-4 p-4 bg-white shadow-lg rounded-full flex items-center space-x-2">
                        <span role="img" aria-label="heart" className="text-red-500 text-2xl">❤️</span>
                        <span className="text-gray-700 text-sm">Recipe added to favorites!</span>
                    </div>
                )}
                {isLoginWarningVisible && (
                    <div className="fixed bottom-4 right-4 p-4 bg-red-100 text-red-800 border border-red-300 rounded-lg shadow-md flex items-center space-x-2 animate-fade-in-out">
                        <span className="text-lg">⚠️</span>
                        <span className="text-sm">You must be logged in to perform this action.</span>
                    </div>
)}

            </div>
        </main>
    );
}
