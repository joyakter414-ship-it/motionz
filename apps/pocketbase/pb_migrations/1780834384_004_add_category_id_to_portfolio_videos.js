/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const categoriesCollection = app.findCollectionByNameOrId("categories");
  const collection = app.findCollectionByNameOrId("portfolio_videos");

  const existing = collection.fields.getByName("category_id");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("category_id"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "category_id",
    required: false,
    collectionId: categoriesCollection.id
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("portfolio_videos");
    collection.fields.removeByName("category_id");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})