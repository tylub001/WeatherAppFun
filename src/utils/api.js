import { defaultClothingItems } from "../utils/constants"; // ✅ Import the array

export function getItems() {
  return Promise.resolve(defaultClothingItems); // ✅ No fetch needed, just return local data
}

export function addItem(newItem) {
  const updatedItems = [...defaultClothingItems, newItem]; // ✅ Copy array with new item
  localStorage.setItem("clothingItems", JSON.stringify(updatedItems)); // ✅ Store in localStorage
  return Promise.resolve(newItem);
}

export function deleteItem(id) {
  const updatedItems = defaultClothingItems.filter((item) => item._id !== id);
  localStorage.setItem("clothingItems", JSON.stringify(updatedItems)); // ✅ Store updated list
  return Promise.resolve(updatedItems);
}
