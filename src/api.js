const BASE = "https://www.themealdb.com/api/json/v1/1";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Recipe service returned ${response.status}`);
  return response.json();
}

export function normaliseIngredient(value) {
  return value.toLowerCase().trim()
    .replace(/[.,]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\b(tomatoes)\b/g, "tomato")
    .replace(/\b(potatoes)\b/g, "potato")
    .replace(/\b(onions)\b/g, "onion")
    .replace(/\b(eggs)\b/g, "egg")
    .replace(/\b(chillies|chilis)\b/g, "chilli");
}

export function parseMealDbMeal(meal) {
  if (!meal) return null;
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim();
    if (name) ingredients.push([name, measure || "as needed"]);
  }
  return {
    id: `mealdb-${meal.idMeal}`,
    mealDbId: meal.idMeal,
    source: "themealdb",
    status: "verified-source",
    name: meal.strMeal || "Untitled recipe",
    region: meal.strArea || "International",
    category: meal.strCategory || "Recipe",
    diet: "Unknown",
    minutes: null,
    servings: 2,
    image: meal.strMealThumb || "",
    ingredients,
    steps: (meal.strInstructions || "").split(/\r?\n/).map(s => s.trim()).filter(Boolean),
    video: meal.strYoutube || "",
    sourceUrl: meal.strSource || "",
    tags: meal.strTags ? meal.strTags.split(",").map(s => s.trim()).filter(Boolean) : []
  };
}

export async function searchMealDbByName(query) {
  const data = await getJson(`${BASE}/search.php?s=${encodeURIComponent(query)}`);
  return (data.meals || []).map(parseMealDbMeal).filter(Boolean);
}

export async function getMealDbDetails(id) {
  const data = await getJson(`${BASE}/lookup.php?i=${encodeURIComponent(id)}`);
  return parseMealDbMeal(data.meals?.[0]);
}

export async function getIndianMealDbMeals() {
  const data = await getJson(`${BASE}/filter.php?a=Indian`);
  return (data.meals || []).map(m => ({
    id: `mealdb-${m.idMeal}`,
    mealDbId: m.idMeal,
    source: "themealdb",
    status: "verified-source",
    name: m.strMeal,
    region: "Indian",
    image: m.strMealThumb || "",
    ingredients: [],
    steps: [],
    tags: []
  }));
}

export async function searchMealDbByIngredient(ingredient) {
  const query = normaliseIngredient(ingredient).replace(/\s+/g, "_");
  const data = await getJson(`${BASE}/filter.php?i=${encodeURIComponent(query)}`);
  return (data.meals || []).map(m => ({
    id: `mealdb-${m.idMeal}`,
    mealDbId: m.idMeal,
    source: "themealdb",
    status: "verified-source",
    name: m.strMeal,
    region: "",
    image: m.strMealThumb || "",
    ingredients: [],
    steps: [],
    tags: []
  }));
}

export async function searchIndianMealDbByIngredients(ingredients, onProgress = () => {}) {
  const clean = [...new Set(ingredients.map(normaliseIngredient).filter(Boolean))].slice(0, 6);
  if (!clean.length) return [];
  const all = new Map();
  for (let i = 0; i < clean.length; i++) {
    onProgress(`Searching ${clean[i]} (${i + 1}/${clean.length})…`);
    try {
      const results = await searchMealDbByIngredient(clean[i]);
      results.forEach(recipe => {
        const current = all.get(recipe.mealDbId) || { ...recipe, matchCount: 0, matchedIngredients: [] };
        current.matchCount += 1;
        current.matchedIngredients.push(clean[i]);
        all.set(recipe.mealDbId, current);
      });
    } catch (error) {
      // Keep searching remaining ingredients if one ingredient is not supported by the API.
    }
    if (i < clean.length - 1) await sleep(450);
  }
  const candidates = [...all.values()].sort((a, b) => b.matchCount - a.matchCount).slice(0, 18);
  const detailed = [];
  for (let i = 0; i < candidates.length; i++) {
    onProgress(`Loading recipe details (${i + 1}/${candidates.length})…`);
    try {
      const full = await getMealDbDetails(candidates[i].mealDbId);
      if (full) {
        detailed.push({
          ...full,
          matchCount: candidates[i].matchCount,
          matchedIngredients: candidates[i].matchedIngredients,
          // Area is not always supplied consistently; keep unknown entries visible with an explicit source label.
          isIndianArea: normaliseIngredient(full.region || "") === "indian"
        });
      }
    } catch (error) {}
    if (i < candidates.length - 1) await sleep(250);
  }
  return detailed.sort((a, b) => b.matchCount - a.matchCount);
}
