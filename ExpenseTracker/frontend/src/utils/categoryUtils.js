export const defaultCategoryValues = [
  "Food",
  "Shopping",
  "Travel",
  "Education",
  "Entertainment",
  "Bills",
  "Health",
  "Other",
];

const categoryTranslationKeys = {
  Food: "food",
  Shopping: "shopping",
  Travel: "travel",
  Education: "education",
  Entertainment: "entertainment",
  Bills: "bills",
  Health: "health",
  Other: "otherCategory",
};

export const getStoredCategories = () => {
  try {
    const saved =
      JSON.parse(
        localStorage.getItem(
          "spendmate_categories"
        )
      ) || [];

    const customCategories = saved
      .map((category) => category?.name)
      .filter(Boolean);

    return [
      ...defaultCategoryValues,
      ...customCategories.filter(
        (name) =>
          !defaultCategoryValues.some(
            (defaultName) =>
              defaultName.toLowerCase() ===
              name.toLowerCase()
          )
      ),
    ];
  } catch {
    return [...defaultCategoryValues];
  }
};

export const getCategoryLabel = (
  category,
  t
) => {
  if (!category) {
    return "";
  }

  const translationKey =
    categoryTranslationKeys[category];

  if (translationKey) {
    return t(translationKey);
  }

  // Custom categories are user-created,
  // so keep their original name.
  return category;
};

export const getCategoryTranslationKey = (
  category
) => {
  return categoryTranslationKeys[category];
};