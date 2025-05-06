# Gemeni Chef

Gemeni Chef is a React application that leverages the Gemeni API to generate delicious recipes based on a given list of ingredients. Simply enter the ingredients you have, and let the app suggest creative and tasty dishes!

## Features

- User-friendly interface for inputting ingredients
- Integration with the Gemeni API for recipe generation
- Display of detailed recipes with instructions
- Uses **React Markdown** to format the API response
- Google Fonts for enhanced typography
- Responsive design for seamless use across devices

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/gemeni-chef.git
   cd gemeni-chef
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the root directory
   - Add your Gemeni API key:
     ```env
     REACT_APP_GEMENI_API_KEY=your_api_key_here
     ```

4. Start the development server:

   ```sh
   npm run dev
   ```

## Usage

1. Enter a list of ingredients in the input field.
2. Click the "Generate Recipe" button.
3. View the suggested recipe, including ingredients and step-by-step instructions.
4. The response is formatted using **React Markdown** for better readability.

## Technologies Used

- React
- Vite
- Gemeni API
- React Markdown
- Google Fonts

## Deployment

To deploy the application, you can use platforms like Vercel or Netlify:

```sh
npm run build
```

Then, follow the hosting provider's instructions to deploy your build folder.

## Contributing

Feel free to fork the repository and submit pull requests to improve the project.


---

Happy cooking with **Gemeni Chef**! 🍽️

