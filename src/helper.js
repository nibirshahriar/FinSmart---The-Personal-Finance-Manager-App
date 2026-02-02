import { CATEGORIES } from "./constant";

export const getId = () => {
  return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
};

export const getDate = () => {
  return new Date().toISOString().split("T")[0];
};

export const getCategoryColor = (color) => {
  const category = CATEGORIES.find((cat) => cat.color === color);
  return category ? category.color : "#808080";
};
