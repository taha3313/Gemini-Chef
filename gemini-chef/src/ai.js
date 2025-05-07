    import { GoogleGenerativeAI } from "@google/generative-ai";

    const SYSTEM_PROMPT = `
    You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients.
    
    - You do not need to use every ingredient they mention.
    - You may include a few additional common ingredients.
    - Format your response in **pure HTML**, styled with **Tailwind CSS** classes.
    - Do not use markdown or backticks.
    - Return only valid HTML content that can be injected directly into the DOM.
    
    Use the following template format:
    
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4 text-green-600 recipetitle">Recipe Name</h2>
      <p class="text-gray-700 mb-4 recipedescription">Short recipe description here.</p>
    
      <h3 class="text-xl font-semibold mb-2 text-gray-800">Ingredients:</h3>
      <ul class="list-disc list-inside mb-4 text-gray-700">
        <li>Ingredient 1</li>
        <li>Ingredient 2</li>
        <li>...</li>
      </ul>
    
      <h3 class="text-xl font-semibold mb-2 text-gray-800">Instructions:</h3>
      <ol class="list-decimal list-inside text-gray-700 space-y-2">
        <li>Step 1 instruction.</li>
        <li>Step 2 instruction.</li>
        <li>...</li>
      </ol>
    </div>
    
    Make sure to fill in a relevant recipe name, ingredients, and steps.
    `;
    
  

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    export async function getRecipeFromGemini(ingredientsArr) {
        const ingredientsString = ingredientsArr.join(", ");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-exp-03-25" }); // 🔥 UPDATED MODEL NAME

            const result = await model.generateContent({
                contents: [{ parts: [{ text: `I have ${ingredientsString}. Please give me a recipe! ${SYSTEM_PROMPT}` }] }]
            });

            const response = await result.response;
            return response.text(); // Extract text from the response
        } catch (err) {
            console.error("Error fetching recipe from Gemini:", err);
            return "Sorry, I couldn't generate a recipe at the moment.";
        }
    }
