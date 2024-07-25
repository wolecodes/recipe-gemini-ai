const prompt = `
I have uploaded an image. You are a chef. Identify the food in this image,.

If food is present, please provide a JSON object containing the following information:
1. name (string): The common name of the dish.
2. ingredients (list of strings): A list that describe it, and suggest a recipe for this dish by specifying the ingredients explain step by step with detail.
3. Instruction (list of strings): A list containing high-level cooking instructions on how to make it.

If food is not present, please provide a JSON object, notifying the error.

Example:
Input: (Image of a pizza)

Output:
 {  
    "name": "Pizza",
    "ingredients": [
      "Dough",
      "Tomato sauce",
      "Cheese",
    ],
    "instructions": [
      "Prepare pizza dough",
      "Spread tomato sauce",
      "Add cheese and desired toppings",
      "Bake until golden brown"
    ],}

Input: (image of a house)

Output: 
{
"error": "No food detected in the image"
}

Input: 
`;

export default prompt;
