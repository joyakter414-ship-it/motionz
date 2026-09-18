/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("team_members");
  const field = collection.fields.getByName("video");
  field.maxSize = 104857600;
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("team_members");
  const field = collection.fields.getByName("video");
  if (!field) { console.log("Field not found, skipping revert"); return; }
  field.maxSize = 20971520;
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection or field not found, skipping revert");
      return;
    }
    throw e;
  }
})