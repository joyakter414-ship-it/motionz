/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("portfolio_videos");
  
  const videoFileField = collection.fields.getByName("video_file");
  if (videoFileField) {
    videoFileField.maxSize = 524288000;
    videoFileField.mimeTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska", "video/ogg"];
  }

  const videoUrlField = collection.fields.getByName("video_url");
  if (videoUrlField) {
    videoUrlField.required = false;
  }

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("portfolio_videos");
    const videoFileField = collection.fields.getByName("video_file");
    if (videoFileField) {
      videoFileField.maxSize = 20971520;
    }
    const videoUrlField = collection.fields.getByName("video_url");
    if (videoUrlField) {
      videoUrlField.required = true;
    }
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
});
