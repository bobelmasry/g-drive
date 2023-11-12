/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1pzitg3bfo2qwx7")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "41bnprn2",
    "name": "folders",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "1pzitg3bfo2qwx7",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1pzitg3bfo2qwx7")

  // remove
  collection.schema.removeField("41bnprn2")

  return dao.saveCollection(collection)
})
