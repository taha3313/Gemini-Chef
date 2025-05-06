    import { GoogleGenerativeAI } from "@google/generative-ai";

    const SYSTEM_PROMPT = `
    You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in HTML, and use Tailwind CSS classes to style the content appropriately for a web page. Avoid using markdown formatting.
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
