import { Trash2 } from "lucide-react";

export default function IngredientsList(props) {
  const ingredientsListItems = props.ingredients.map((ingredient) => (
    <li key={ingredient} className="py-1 text-amber-800 flex items-center justify-between">
      <span>🥕 {ingredient}</span>
      <button
        onClick={() => props.removeIngredient(ingredient)}
        className="ml-4 text-sm text-red-600 hover:text-red-800"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  ));

  return (
    <section className="bg-orange-50 border border-orange-200 rounded-xl shadow-md p-4 md:p-6 mb-4">
      <h2 className="text-xl font-semibold text-amber-800 mb-3">Your Ingredients:</h2>
      <ul className="list-disc list-inside space-y-1" aria-live="polite">
        {ingredientsListItems}
      </ul>
      {props.ingredients.length > 3 && (
        <div className="mt-6 p-4 bg-orange-100 rounded-md">
          <div ref={props.ref}>
            <h3 className="text-lg font-semibold text-amber-700">Ready for a recipe?</h3>
            <p className="text-sm text-amber-600">Generate a recipe from your list of ingredients.</p>
          </div>
          <button
            onClick={props.getRecipe}
            className="mt-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition"
          >
            🍳 Get a Recipe
          </button>
        </div>
      )}
    </section>
  );
}
