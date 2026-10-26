import React, { useEffect, useMemo, useState } from "react";
import {
  ChefHat, Search, Plus, X, Heart, Clock3, Users, CookingPot, ShoppingBasket,
  Sparkles, Leaf, Beef, Globe2, Languages, ChevronRight, ChevronLeft, Timer,
  Bookmark, SlidersHorizontal, RotateCcw, ExternalLink, Menu, CheckCircle2,
  CircleHelp, Flame, Camera, Utensils, ArrowRight
} from "lucide-react";
import { curatedRecipes, regionOptions } from "./curatedRecipes";
import {
  searchIndianMealDbByIngredients, searchMealDbByName, getMealDbDetails,
  getIndianMealDbMeals, normaliseIngredient
} from "./api";

const copy = {
  en: {
    navHome:"Discover", navIngredients:"My ingredients", navSaved:"Saved recipes",
    heroEyebrow:"LESS WASTE. MORE FLAVOUR.", heroTitle:"What’s in your fridge?", heroText:"Turn everyday ingredients into something delicious with recipes inspired by kitchens across India.",
    ingredientPlaceholder:"Try rice, tomato, onion, eggs…", add:"Add", find:"Find recipes", browse:"Explore Indian recipes",
    popular:"Popular in Indian kitchens", curated:"Curated for your kitchen", seeAll:"Browse all",
    all:"All", veg:"Vegetarian", nonveg:"Non-vegetarian", region:"Region", search:"Search recipes",
    match:"ingredient match", ingredients:"Ingredients", instructions:"Instructions", cook:"Start cooking",
    minutes:"min", servings:"servings", missing:"You may need", have:"You have", save:"Save recipe",
    saved:"Saved", source:"Recipe source", verified:"Source recipe", curatedStatus:"Curated starter recipe",
    aiStatus:"AI-generated suggestion", next:"Next step", previous:"Previous", step:"Step", done:"Finish cooking",
    shopping:"Shopping list", noResults:"No matching recipes found", tryAgain:"Try another ingredient or browse all recipes.",
    loading:"Finding recipes…", apiNote:"Live recipes load from TheMealDB when available. The starter collection works offline.",
    allRegions:"All regions", cuisine:"Indian cuisine", collection:"A growing collection of Indian favourites",
    results:"recipes", reset:"Clear ingredients", searchTitle:"Find something to cook",
    howTitle:"Made for real kitchens", howText:"Practical recipes, familiar ingredients, and simple step-by-step guidance.",
    footer:"Built for curious home cooks.", noImage:"Image unavailable", timeUnknown:"Time varies",
    servingsLabel:"Servings", ingredientCount:"ingredients", sourceLink:"Original source",
    apiError:"The online recipe service could not be reached. You can still explore the built-in recipes.",
    photoSoon:"Photo ingredient recognition is a future feature.", mode:"Cooking mode", stepOf:"of",
    noSteps:"No structured steps available for this recipe.", back:"Back to recipes", allRecipes:"All recipes",
    filter:"Filters", dietary:"Diet", searchHint:"Search by dish, region or ingredient"
  },
  kn: {
    navHome:"ಅನ್ವೇಷಿಸಿ", navIngredients:"ನನ್ನ ಪದಾರ್ಥಗಳು", navSaved:"ಉಳಿಸಿದ ಪಾಕವಿಧಾನಗಳು",
    heroEyebrow:"ಕಡಿಮೆ ವ್ಯರ್ಥ. ಹೆಚ್ಚು ರುಚಿ.", heroTitle:"ನಿಮ್ಮ ಫ್ರಿಜ್‌ನಲ್ಲಿ ಏನಿದೆ?", heroText:"ನಿಮ್ಮಲ್ಲಿರುವ ಪದಾರ್ಥಗಳಿಂದ ಭಾರತದ ವಿವಿಧ ಭಾಗಗಳ ರುಚಿಕರ ಪಾಕವಿಧಾನಗಳನ್ನು ಹುಡುಕಿ.",
    ingredientPlaceholder:"ಅಕ್ಕಿ, ಟೊಮೇಟೊ, ಈರುಳ್ಳಿ…", add:"ಸೇರಿಸಿ", find:"ಪಾಕವಿಧಾನ ಹುಡುಕಿ", browse:"ಭಾರತೀಯ ಪಾಕವಿಧಾನಗಳು",
    popular:"ಜನಪ್ರಿಯ ಭಾರತೀಯ ತಿನಿಸುಗಳು", curated:"ನಿಮ್ಮ ಅಡುಗೆಮನೆಗಾಗಿ", seeAll:"ಎಲ್ಲವನ್ನೂ ನೋಡಿ",
    all:"ಎಲ್ಲ", veg:"ಸಸ್ಯಾಹಾರಿ", nonveg:"ಮಾಂಸಾಹಾರಿ", region:"ಪ್ರದೇಶ", search:"ಪಾಕವಿಧಾನ ಹುಡುಕಿ",
    match:"ಪದಾರ್ಥ ಹೊಂದಾಣಿಕೆ", ingredients:"ಪದಾರ್ಥಗಳು", instructions:"ಮಾಡುವ ವಿಧಾನ", cook:"ಅಡುಗೆ ಪ್ರಾರಂಭಿಸಿ",
    minutes:"ನಿಮಿಷ", servings:"ಸರ್ವಿಂಗ್‌ಗಳು", missing:"ಬೇಕಾಗಬಹುದು", have:"ನಿಮ್ಮಲ್ಲಿದೆ", save:"ಉಳಿಸಿ",
    saved:"ಉಳಿಸಲಾಗಿದೆ", source:"ಪಾಕವಿಧಾನದ ಮೂಲ", verified:"ಮೂಲ ಪಾಕವಿಧಾನ", curatedStatus:"ಸಂಪಾದಿತ ಮಾದರಿ ಪಾಕವಿಧಾನ",
    aiStatus:"AI ರಚಿಸಿದ ಸಲಹೆ", next:"ಮುಂದಿನ ಹಂತ", previous:"ಹಿಂದಿನದು", step:"ಹಂತ", done:"ಅಡುಗೆ ಮುಗಿಸಿ",
    shopping:"ಖರೀದಿ ಪಟ್ಟಿ", noResults:"ಹೊಂದುವ ಪಾಕವಿಧಾನ ಸಿಗಲಿಲ್ಲ", tryAgain:"ಬೇರೆ ಪದಾರ್ಥ ಪ್ರಯತ್ನಿಸಿ.",
    loading:"ಪಾಕವಿಧಾನ ಹುಡುಕಲಾಗುತ್ತಿದೆ…", apiNote:"ಲಭ್ಯವಿದ್ದಾಗ TheMealDB ನಿಂದ ಪಾಕವಿಧಾನಗಳು ಲೋಡ್ ಆಗುತ್ತವೆ.",
    allRegions:"ಎಲ್ಲ ಪ್ರದೇಶಗಳು", cuisine:"ಭಾರತೀಯ ಅಡುಗೆ", collection:"ಭಾರತದ ಜನಪ್ರಿಯ ತಿನಿಸುಗಳು",
    results:"ಪಾಕವಿಧಾನಗಳು", reset:"ಪದಾರ್ಥಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ", searchTitle:"ಏನು ಅಡುಗೆ ಮಾಡೋಣ?",
    howTitle:"ನಿಜವಾದ ಅಡುಗೆಮನೆಗಾಗಿ", howText:"ಸರಳ ಪದಾರ್ಥಗಳು ಮತ್ತು ಹಂತ ಹಂತದ ಮಾರ್ಗದರ್ಶನ.",
    footer:"ಮನೆಯ ಅಡುಗೆ ಪ್ರಿಯರಿಗಾಗಿ.", noImage:"ಚಿತ್ರ ಲಭ್ಯವಿಲ್ಲ", timeUnknown:"ಸಮಯ ಬದಲಾಗಬಹುದು",
    servingsLabel:"ಸರ್ವಿಂಗ್‌ಗಳು", ingredientCount:"ಪದಾರ್ಥಗಳು", sourceLink:"ಮೂಲ ಲಿಂಕ್",
    apiError:"ಆನ್‌ಲೈನ್ ಸೇವೆ ಲಭ್ಯವಿಲ್ಲ. ಒಳಗೊಂಡಿರುವ ಪಾಕವಿಧಾನಗಳನ್ನು ಬಳಸಬಹುದು.",
    photoSoon:"ಚಿತ್ರದಿಂದ ಪದಾರ್ಥ ಗುರುತಿಸುವಿಕೆ ಮುಂದಿನ ವೈಶಿಷ್ಟ್ಯ.", mode:"ಅಡುಗೆ ವಿಧಾನ", stepOf:"ರಲ್ಲಿ",
    noSteps:"ಈ ಪಾಕವಿಧಾನಕ್ಕೆ ಹಂತಗಳಿಲ್ಲ.", back:"ಹಿಂತಿರುಗಿ", allRecipes:"ಎಲ್ಲ ಪಾಕವಿಧಾನಗಳು",
    filter:"ಫಿಲ್ಟರ್", dietary:"ಆಹಾರ", searchHint:"ತಿನಿಸು, ಪ್ರದೇಶ ಅಥವಾ ಪದಾರ್ಥ ಹುಡುಕಿ"
  },
  hi: {
    navHome:"खोजें", navIngredients:"मेरी सामग्री", navSaved:"सेव की गई रेसिपी",
    heroEyebrow:"कम बर्बादी। ज़्यादा स्वाद।", heroTitle:"आपके फ्रिज में क्या है?", heroText:"अपने पास मौजूद सामग्री से भारत के अलग-अलग क्षेत्रों की स्वादिष्ट रेसिपी खोजें।",
    ingredientPlaceholder:"चावल, टमाटर, प्याज़, अंडे…", add:"जोड़ें", find:"रेसिपी खोजें", browse:"भारतीय रेसिपी देखें",
    popular:"भारतीय रसोई की पसंदीदा रेसिपी", curated:"आपकी रसोई के लिए", seeAll:"सभी देखें",
    all:"सभी", veg:"शाकाहारी", nonveg:"मांसाहारी", region:"क्षेत्र", search:"रेसिपी खोजें",
    match:"सामग्री मेल", ingredients:"सामग्री", instructions:"बनाने की विधि", cook:"पकाना शुरू करें",
    minutes:"मिनट", servings:"सर्विंग", missing:"आपको चाहिए", have:"आपके पास है", save:"रेसिपी सेव करें",
    saved:"सेव की गई", source:"रेसिपी स्रोत", verified:"स्रोत रेसिपी", curatedStatus:"संपादित शुरुआती रेसिपी",
    aiStatus:"AI द्वारा सुझाई गई", next:"अगला चरण", previous:"पिछला", step:"चरण", done:"पकाना पूरा करें",
    shopping:"खरीदारी सूची", noResults:"कोई मेल खाती रेसिपी नहीं मिली", tryAgain:"कोई दूसरी सामग्री खोजें।",
    loading:"रेसिपी खोज रहे हैं…", apiNote:"उपलब्ध होने पर TheMealDB से रेसिपी लोड होंगी।",
    allRegions:"सभी क्षेत्र", cuisine:"भारतीय व्यंजन", collection:"भारत की पसंदीदा रेसिपी",
    results:"रेसिपी", reset:"सामग्री हटाएँ", searchTitle:"आज क्या पकाएँ?",
    howTitle:"आपकी रसोई के लिए", howText:"आसान सामग्री और चरण-दर-चरण निर्देश।",
    footer:"घर पर खाना बनाने वालों के लिए।", noImage:"तस्वीर उपलब्ध नहीं", timeUnknown:"समय अलग हो सकता है",
    servingsLabel:"सर्विंग", ingredientCount:"सामग्री", sourceLink:"मूल स्रोत",
    apiError:"ऑनलाइन सेवा उपलब्ध नहीं है। आप ऐप की रेसिपी देख सकते हैं।",
    photoSoon:"तस्वीर से सामग्री पहचानना भविष्य का फीचर है।", mode:"कुकिंग मोड", stepOf:"में से",
    noSteps:"इस रेसिपी के लिए चरण उपलब्ध नहीं हैं।", back:"रेसिपी पर लौटें", allRecipes:"सभी रेसिपी",
    filter:"फ़िल्टर", dietary:"आहार", searchHint:"व्यंजन, क्षेत्र या सामग्री खोजें"
  }
};

const initialIngredients = [];
const categoryFilters = ["All","Breakfast","Lunch","Dinner","Snack","Dessert","Quick meals"];
const prettyRegion = (value) => value === "Pan-Indian" ? "Pan-Indian" : value;

function RecipeImage({ recipe, className = "" }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [recipe?.image]);
  if (!recipe?.image || failed) {
    return <div className={`recipe-image-fallback ${className}`}><CookingPot size={34}/><span>Fridge Chef</span></div>;
  }
  return <img className={`recipe-image ${className}`} src={recipe.image} alt={recipe.name} loading="lazy" onError={() => setFailed(true)} />;
}

function RecipeCard({ recipe, onOpen, saved, onSave, t, ingredients = [] }) {
  const matched = recipe.matchCount ?? 0;
  return (
    <article className="recipe-card">
      <button className="image-button" onClick={() => onOpen(recipe)} aria-label={`Open ${recipe.name}`}>
        <RecipeImage recipe={recipe}/>
        <span className="image-tag">{recipe.source === "themealdb" ? "TheMealDB" : "Fridge Chef"}</span>
      </button>
      <button className={`save-button ${saved ? "is-saved" : ""}`} onClick={() => onSave(recipe)} aria-label={saved ? "Remove saved recipe" : "Save recipe"}>
        <Heart size={17} fill={saved ? "currentColor" : "none"}/>
      </button>
      <div className="recipe-card-body">
        <div className="recipe-card-meta"><span>{recipe.region || "Indian cuisine"}</span>{recipe.diet && recipe.diet !== "Unknown" && <span className={recipe.diet === "Vegetarian" ? "veg-dot" : "nonveg-dot"}>{recipe.diet === "Vegetarian" ? "●" : "◆"} {recipe.diet}</span>}</div>
        <button className="recipe-title-button" onClick={() => onOpen(recipe)}>{recipe.name}</button>
        <div className="recipe-card-bottom">
          <span><Clock3 size={14}/> {recipe.minutes ? `${recipe.minutes} ${t.minutes}` : t.timeUnknown}</span>
          {ingredients.length > 0 && <span className="match-pill">{matched} {t.match}</span>}
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [language, setLanguage] = useState("en");
  const t = copy[language];
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [ingredientInput, setIngredientInput] = useState("");
  const [activeTab, setActiveTab] = useState("discover");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All regions");
  const [diet, setDiet] = useState("All");
  const [category, setCategory] = useState("All");
  const [recipes, setRecipes] = useState(curatedRecipes);
  const [onlineRecipes, setOnlineRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [apiError, setApiError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [cookingMode, setCookingMode] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [savedIds, setSavedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fridgechef-saved") || "[]"); } catch { return []; }
  });
  const [shoppingList, setShoppingList] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fridgechef-shopping") || "[]"); } catch { return []; }
  });
  const [servings, setServings] = useState(2);
  const [showFilters, setShowFilters] = useState(false);
  const [showShopping, setShowShopping] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => localStorage.setItem("fridgechef-saved", JSON.stringify(savedIds)), [savedIds]);
  useEffect(() => localStorage.setItem("fridgechef-shopping", JSON.stringify(shoppingList)), [shoppingList]);

  const addIngredient = (value = ingredientInput) => {
    const clean = value.trim().replace(/,$/, "");
    if (!clean) return;
    if (!ingredients.some(item => normaliseIngredient(item) === normaliseIngredient(clean))) {
      setIngredients(prev => [...prev, clean]);
    }
    setIngredientInput("");
  };
  const removeIngredient = (value) => setIngredients(prev => prev.filter(item => item !== value));
  const clearIngredients = () => setIngredients([]);

  const searchIngredients = async () => {
    if (!ingredients.length) {
      setToast("Add at least one ingredient first.");
      setTimeout(() => setToast(""), 2200);
      return;
    }
    setLoading(true); setApiError(""); setOnlineRecipes([]);
    try {
      const found = await searchIndianMealDbByIngredients(ingredients, setLoadingText);
      setOnlineRecipes(found);
      if (!found.length) setApiError("No live matches found. Showing curated Indian recipes instead.");
    } catch (error) {
      setApiError(t.apiError);
    } finally {
      setLoading(false); setLoadingText("");
    }
  };

  const searchOnlineByName = async (query) => {
    if (!query.trim()) return;
    setLoading(true); setApiError("");
    try {
      const found = await searchMealDbByName(query);
      const IndianOnly = found.filter(r => /indian/i.test(r.region || "") || /curry|masala|dosa|biryani|paneer|dal|sambar|roti|chole|rajma|poha|pulao/i.test(r.name));
      setOnlineRecipes(IndianOnly.length ? IndianOnly : found);
    } catch {
      setApiError(t.apiError);
    } finally { setLoading(false); }
  };

  const toggleSaved = (recipe) => {
    setSavedIds(prev => prev.includes(recipe.id) ? prev.filter(id => id !== recipe.id) : [...prev, recipe.id]);
  };

  const allRecipes = useMemo(() => {
    const map = new Map();
    [...curatedRecipes, ...onlineRecipes].forEach(r => {
      const key = r.id || r.name;
      if (!map.has(key)) map.set(key, r);
    });
    return [...map.values()];
  }, [onlineRecipes]);

  const visibleRecipes = useMemo(() => {
    let list = activeTab === "saved" ? allRecipes.filter(r => savedIds.includes(r.id)) : allRecipes;
    if (search.trim()) {
      const q = normaliseIngredient(search);
      list = list.filter(r => normaliseIngredient(`${r.name} ${r.region} ${(r.tags || []).join(" ")} ${(r.ingredients || []).map(i => i[0]).join(" ")}`).includes(q));
    }
    if (region !== "All regions") list = list.filter(r => r.region === region || (region === "South India" && /South India|Tamil Nadu|Kerala|Andhra Pradesh|Telangana|Karnataka|Coastal Karnataka/i.test(r.region || "")));
    if (diet !== "All") {
      if (diet === "Vegetarian") list = list.filter(r => r.diet === "Vegetarian");
      if (diet === "Non-vegetarian") list = list.filter(r => r.diet === "Non-vegetarian" || (r.diet === "Unknown" && /chicken|fish|egg|mutton|prawn|meat/i.test(r.name)));
    }
    if (category !== "All") list = list.filter(r => (r.tags || []).some(tag => tag.toLowerCase() === category.toLowerCase()) || (r.category || "").toLowerCase() === category.toLowerCase());
    if (ingredients.length && onlineRecipes.length) {
      list = list.map(r => {
        if (r.source === "themealdb" && r.matchCount != null) return r;
        const haystack = normaliseIngredient(`${r.name} ${(r.ingredients || []).map(i => i[0]).join(" ")}`);
        const matches = ingredients.filter(item => haystack.includes(normaliseIngredient(item))).length;
        return { ...r, matchCount: matches };
      });
      list.sort((a,b) => (b.matchCount || 0) - (a.matchCount || 0));
    }
    return list;
  }, [allRecipes, activeTab, savedIds, search, region, diet, category, ingredients, onlineRecipes]);

  const openRecipe = async (recipe) => {
    setSelectedRecipe(recipe);
    setCookingMode(false);
    setStepIndex(0);
    setServings(recipe.servings || 2);
    if (recipe.source === "themealdb" && recipe.mealDbId && (!recipe.steps?.length || !recipe.ingredients?.length)) {
      try {
        const details = await getMealDbDetails(recipe.mealDbId);
        if (details) setSelectedRecipe({ ...details, matchCount: recipe.matchCount, matchedIngredients: recipe.matchedIngredients });
      } catch {}
    }
  };

  const addMissingToShopping = (recipe) => {
    const have = ingredients.map(normaliseIngredient);
    const missing = (recipe.ingredients || []).map(i => i[0]).filter(name => !have.some(h => normaliseIngredient(name).includes(h) || h.includes(normaliseIngredient(name))));
    setShoppingList(prev => [...new Set([...prev, ...missing])]);
    setShowShopping(true);
  };

  const changeNav = (tab) => {
    setActiveTab(tab);
    setSelectedRecipe(null);
    setCookingMode(false);
    if (tab === "ingredients") document.getElementById("ingredient-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const quickIngredients = ["Rice","Potato","Tomato","Onion","Egg","Paneer","Chicken","Spinach","Lentils","Green chilli"];
  const featured = visibleRecipes.slice(0, 12);

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => { setSelectedRecipe(null); setCookingMode(false); setActiveTab("discover"); }} aria-label="Fridge Chef home">
          <span className="brand-mark"><ChefHat size={23}/></span>
          <span className="brand-text">fridge<span>chef</span><small>INDIAN KITCHEN</small></span>
        </button>
        <nav className="desktop-nav">
          <button className={activeTab === "discover" ? "nav-active" : ""} onClick={() => changeNav("discover")}>{t.navHome}</button>
          <button className={activeTab === "ingredients" ? "nav-active" : ""} onClick={() => changeNav("ingredients")}>{t.navIngredients}</button>
          <button className={activeTab === "saved" ? "nav-active" : ""} onClick={() => changeNav("saved")}>{t.navSaved}</button>
        </nav>
        <div className="topbar-actions">
          <button className="icon-text-button" onClick={() => setShowShopping(true)}><ShoppingBasket size={17}/><span>{t.shopping}</span>{shoppingList.length > 0 && <b>{shoppingList.length}</b>}</button>
          <label className="language-select"><Languages size={16}/><select value={language} onChange={e => setLanguage(e.target.value)} aria-label="Language"><option value="en">English</option><option value="kn">ಕನ್ನಡ</option><option value="hi">हिन्दी</option></select></label>
        </div>
      </header>

      {!selectedRecipe && (
        <>
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-line"></span>{t.heroEyebrow}</div>
              <h1>{t.heroTitle}<br/><em>let’s make it delicious.</em></h1>
              <p>{t.heroText}</p>
              <div className="ingredient-search" id="ingredient-panel">
                <div className="ingredient-search-top"><Leaf size={18}/><span>YOUR FRIDGE, YOUR RULES</span></div>
                <div className="ingredient-input-row">
                  <input value={ingredientInput} onChange={e => setIngredientInput(e.target.value)} onKeyDown={e => { if(e.key === "Enter" || e.key === ","){ e.preventDefault(); addIngredient(); } }} placeholder={t.ingredientPlaceholder}/>
                  <button className="add-ingredient" onClick={() => addIngredient()}><Plus size={18}/>{t.add}</button>
                </div>
                {ingredients.length > 0 && <div className="ingredient-chips">{ingredients.map(item => <span key={item}>{item}<button onClick={() => removeIngredient(item)} aria-label={`Remove ${item}`}><X size={13}/></button></span>)}</div>}
                <div className="quick-ingredients"><span>QUICK ADD</span>{quickIngredients.map(item => <button key={item} onClick={() => addIngredient(item)}>{item}</button>)}</div>
                <button className="primary-button search-button" onClick={searchIngredients} disabled={loading}><Search size={18}/>{loading ? (loadingText || t.loading) : t.find}<ArrowRight size={17}/></button>
                {ingredients.length > 0 && <button className="text-button clear-button" onClick={clearIngredients}>{t.reset}</button>}
              </div>
              {apiError && <div className="api-message"><CircleHelp size={16}/>{apiError}</div>}
              {loading && <div className="loading-line"><span></span>{loadingText || t.loading}</div>}
            </div>
            <div className="hero-visual">
              <div className="hero-image-frame"><img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1100&q=90" alt="A colourful Indian meal" /></div>
              <div className="hero-sticker"><Sparkles size={17}/><span>GOOD FOOD<br/><b>STARTS HERE</b></span></div>
              <div className="hero-note"><span className="note-icon"><Utensils size={18}/></span><span><b>Made with what you have</b><small>Everyday ingredients, Indian flavours</small></span></div>
            </div>
          </section>

          <section className="quick-stats">
            <div><span className="stat-icon"><CookingPot size={18}/></span><span><b>Indian-first</b><small>Regional flavours</small></span></div>
            <div><span className="stat-icon"><Leaf size={18}/></span><span><b>Veg & non-veg</b><small>Something for everyone</small></span></div>
            <div><span className="stat-icon"><Clock3 size={18}/></span><span><b>Step by step</b><small>Cook with confidence</small></span></div>
          </section>

          <main className="main-content">
            <section className="section-heading">
              <div><div className="eyebrow"><span className="eyebrow-line"></span>{t.cuisine}</div><h2>{activeTab === "saved" ? t.navSaved : ingredients.length && onlineRecipes.length ? t.searchTitle : t.popular}</h2><p>{t.collection}</p></div>
              <div className="section-tools">
                <label className="recipe-search"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchHint}/><button onClick={() => searchOnlineByName(search)} title="Search online"><Globe2 size={16}/></button></label>
                <button className={`filter-toggle ${showFilters ? "selected" : ""}`} onClick={() => setShowFilters(v => !v)}><SlidersHorizontal size={17}/>{t.filter}</button>
              </div>
            </section>
            {showFilters && <div className="filters-panel">
              <label>{t.region}<select value={region} onChange={e => setRegion(e.target.value)}>{regionOptions.map(r => <option key={r} value={r}>{r === "All regions" ? t.allRegions : prettyRegion(r)}</option>)}</select></label>
              <label>{t.dietary}<select value={diet} onChange={e => setDiet(e.target.value)}><option value="All">{t.all}</option><option value="Vegetarian">{t.veg}</option><option value="Non-vegetarian">{t.nonveg}</option></select></label>
              <label>Meal type<select value={category} onChange={e => setCategory(e.target.value)}>{categoryFilters.map(c => <option key={c}>{c}</option>)}</select></label>
              <button className="text-button" onClick={() => {setRegion("All regions");setDiet("All");setCategory("All");setSearch("");}}><RotateCcw size={14}/> Reset filters</button>
            </div>}
            <div className="collection-tabs">
              <button className={category === "All" ? "active" : ""} onClick={() => setCategory("All")}>{t.all}</button>
              <button className={diet === "Vegetarian" ? "active" : ""} onClick={() => setDiet(diet === "Vegetarian" ? "All" : "Vegetarian")}><Leaf size={14}/>{t.veg}</button>
              <button className={diet === "Non-vegetarian" ? "active" : ""} onClick={() => setDiet(diet === "Non-vegetarian" ? "All" : "Non-vegetarian")}><Beef size={14}/>{t.nonveg}</button>
              <span className="results-count">{visibleRecipes.length} {t.results}</span>
            </div>
            {activeTab === "ingredients" && <div className="inline-note">Add ingredients in the search panel above, then select “Find recipes”.</div>}
            {activeTab === "saved" && visibleRecipes.length === 0 && <div className="empty-state"><Heart size={30}/><h3>No saved recipes yet</h3><p>Tap the heart on any recipe to save it here.</p></div>}
            {visibleRecipes.length > 0 ? <div className="recipe-grid">{featured.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} onOpen={openRecipe} saved={savedIds.includes(recipe.id)} onSave={toggleSaved} t={t} ingredients={ingredients}/>)}</div> : activeTab !== "saved" && <div className="empty-state"><Search size={30}/><h3>{t.noResults}</h3><p>{t.tryAgain}</p></div>}
            {visibleRecipes.length > 12 && <button className="secondary-button load-more" onClick={() => setCategory("All")}>{t.seeAll} <ArrowRight size={16}/></button>}
            <section className="how-section">
              <div className="how-photo"><img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=85" alt="Preparing food in a home kitchen"/></div>
              <div className="how-copy"><div className="eyebrow"><span className="eyebrow-line"></span>THE FRIDGE CHEF WAY</div><h2>{t.howTitle}</h2><p>{t.howText}</p><div className="how-point"><span>01</span><div><b>Start with what you have</b><small>Use ingredients already in your kitchen.</small></div></div><div className="how-point"><span>02</span><div><b>Choose your flavour</b><small>Explore regional dishes and family favourites.</small></div></div><div className="how-point"><span>03</span><div><b>Cook one step at a time</b><small>Keep instructions handy while you cook.</small></div></div></div>
            </section>
          </main>
        </>
      )}

      {selectedRecipe && (
        <main className="detail-page">
          <button className="back-link" onClick={() => {setSelectedRecipe(null);setCookingMode(false);}}><ChevronLeft size={17}/>{t.back}</button>
          {!cookingMode ? (
            <>
              <section className="recipe-detail-hero">
                <div className="detail-image"><RecipeImage recipe={selectedRecipe}/><span className="image-tag">{selectedRecipe.source === "themealdb" ? "TheMealDB" : t.curatedStatus}</span></div>
                <div className="detail-intro">
                  <div className="eyebrow"><span className="eyebrow-line"></span>{selectedRecipe.region || t.cuisine}</div>
                  <h1>{selectedRecipe.name}</h1>
                  <p>{selectedRecipe.description || `A ${selectedRecipe.region || "Indian"} kitchen favourite, made with familiar ingredients.`}</p>
                  <div className="detail-metrics"><span><Clock3 size={17}/>{selectedRecipe.minutes ? `${selectedRecipe.minutes} ${t.minutes}` : t.timeUnknown}</span><span><Users size={17}/>{servings} {t.servings}</span><span><CookingPot size={17}/>{selectedRecipe.diet || "Recipe"}</span></div>
                  <div className="servings-control"><span>{t.servingsLabel}</span><button onClick={() => setServings(s => Math.max(1,s-1))}>−</button><b>{servings}</b><button onClick={() => setServings(s => Math.min(20,s+1))}>+</button></div>
                  <div className="detail-actions"><button className="primary-button" onClick={() => {setCookingMode(true);setStepIndex(0);}}><ChefHat size={18}/>{t.cook}</button><button className={`secondary-button ${savedIds.includes(selectedRecipe.id) ? "saved" : ""}`} onClick={() => toggleSaved(selectedRecipe)}><Heart size={17} fill={savedIds.includes(selectedRecipe.id) ? "currentColor" : "none"}/>{savedIds.includes(selectedRecipe.id) ? t.saved : t.save}</button><button className="secondary-button" onClick={() => addMissingToShopping(selectedRecipe)}><ShoppingBasket size={17}/>{t.shopping}</button></div>
                  <div className="source-status"><CheckCircle2 size={16}/><span>{selectedRecipe.source === "themealdb" ? "Imported from TheMealDB. Check recipe details before cooking." : t.curatedStatus}</span></div>
                  {selectedRecipe.sourceUrl && <a className="source-anchor" href={selectedRecipe.sourceUrl} target="_blank" rel="noreferrer">{t.sourceLink} <ExternalLink size={14}/></a>}
                </div>
              </section>
              <div className="detail-columns">
                <section className="ingredients-panel"><div className="panel-title"><span className="panel-icon"><ShoppingBasket size={19}/></span><div><h2>{t.ingredients}</h2><p>{selectedRecipe.ingredients?.length || 0} {t.ingredientCount}</p></div></div>
                  <div className="ingredient-list">{(selectedRecipe.ingredients || []).map(([name, amount], i) => <label key={`${name}-${i}`} className="ingredient-row"><input type="checkbox"/><span>{name}</span><b>{amount}</b></label>)}</div>
                  <button className="text-button" onClick={() => {setShoppingList(prev => [...new Set([...prev, ...(selectedRecipe.ingredients || []).map(i=>i[0])])]);setShowShopping(true);}}><Plus size={15}/> Add all to shopping list</button>
                </section>
                <section className="instructions-panel"><div className="panel-title"><span className="panel-icon"><ChefHat size={19}/></span><div><h2>{t.instructions}</h2><p>Follow along at your own pace</p></div></div>
                  {(selectedRecipe.steps || []).length ? <div className="instruction-list">{selectedRecipe.steps.map((step,i)=><div className="instruction-row" key={i}><span>{String(i+1).padStart(2,"0")}</span><p>{step}</p></div>)}</div> : <p>{t.noSteps}</p>}
                  <button className="primary-button full-width" onClick={() => {setCookingMode(true);setStepIndex(0);}}><ChefHat size={17}/>{t.cook}</button>
                </section>
              </div>
            </>
          ) : (
            <section className="cooking-mode">
              <div className="cooking-topline"><span><ChefHat size={18}/>{t.mode}</span><button onClick={() => setCookingMode(false)}>Exit cooking mode <X size={16}/></button></div>
              <div className="cooking-progress"><span style={{width: `${Math.min(100,((stepIndex+1)/Math.max(1,selectedRecipe.steps.length))*100)}%`}}/></div>
              <div className="cooking-content">
                <div className="cooking-photo"><RecipeImage recipe={selectedRecipe}/></div>
                <div className="cooking-instruction">
                  <div className="eyebrow"><span className="eyebrow-line"></span>{t.step} {Math.min(stepIndex+1, selectedRecipe.steps.length || 1)} {t.stepOf} {selectedRecipe.steps.length || 1}</div>
                  <h1>{selectedRecipe.name}</h1>
                  <p className="step-copy">{selectedRecipe.steps?.[stepIndex] || t.noSteps}</p>
                  <div className="cooking-tip"><Timer size={19}/><span><b>Kitchen tip</b><small>Keep the heat appropriate for the pan and check that meat and eggs are fully cooked.</small></span></div>
                  <div className="cooking-controls"><button className="secondary-button" disabled={stepIndex === 0} onClick={() => setStepIndex(i=>Math.max(0,i-1))}><ChevronLeft size={18}/>{t.previous}</button>{stepIndex < (selectedRecipe.steps?.length || 1)-1 ? <button className="primary-button" onClick={() => setStepIndex(i=>i+1)}>{t.next}<ChevronRight size={18}/></button> : <button className="primary-button" onClick={() => {setCookingMode(false);setSelectedRecipe(null);setToast("Cooking session finished!");setTimeout(()=>setToast(""),2500);}}><CheckCircle2 size={18}/>{t.done}</button>}</div>
                </div>
              </div>
            </section>
          )}
        </main>
      )}

      <footer className="footer"><div className="footer-brand"><span className="brand-mark"><ChefHat size={20}/></span><span>fridge<span>chef</span></span></div><p>{t.footer} Recipe data from TheMealDB and Fridge Chef's editable starter collection.</p><span className="footer-small">© Fridge Chef · Cook thoughtfully</span></footer>

      {showShopping && <div className="drawer-backdrop" onClick={() => setShowShopping(false)}><aside className="shopping-drawer" onClick={e => e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">YOUR KITCHEN</span><h2>{t.shopping}</h2></div><button className="round-icon" onClick={() => setShowShopping(false)}><X size={19}/></button></div><div className="shopping-add"><input id="shopping-input" placeholder="Add an item…" onKeyDown={e=>{if(e.key==="Enter"&&e.target.value.trim()){setShoppingList(p=>[...new Set([...p,e.target.value.trim()])]);e.target.value="";}}}/><button className="primary-button" onClick={()=>{const el=document.getElementById("shopping-input");if(el.value.trim()){setShoppingList(p=>[...new Set([...p,el.value.trim()])]);el.value="";}}}><Plus size={16}/>{t.add}</button></div><div className="shopping-items">{shoppingList.map(item=><label key={item}><input type="checkbox"/><span>{item}</span><button onClick={()=>setShoppingList(p=>p.filter(x=>x!==item))}><X size={15}/></button></label>)}</div><button className="secondary-button full-width" onClick={()=>setShoppingList([])}><RotateCcw size={15}/> Clear list</button></aside></div>}
      {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
    </div>
  );
}
