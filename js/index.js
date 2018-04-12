$(document).on('ready', function (e) {
    console.log('on device ready called');
    databaseHandler.createDatabase(database.name, database.version, database.displayName);

});