//serverRequest stuff goes here
//for reference https://www.npmjs.com/package/mongodb
exports.fetch = function(db, aSearchField, aValue, aCollection, callback) {
    //set custom search fields
    var fetchedData;
    var field = aSearchField;
    var value = aValue;
    var query = {};
    query[field] = value;

    //possible collections are whiteboards and whiteboardUsers
    var collection = db.collection(aCollection);
    collection.find(query).toArray(function(err, docs) {
            if (err != null) {
                    console.log("Error on attempting to find: " + err);
                    callback("error"); //error on trying to query the db
            }
            else callback(docs); //the docs object is null if the name doesn't exist
    });

}
