var databaseHandler = {
    db: null,
    createDatabase: function (dbname, version, display_name) {
        this.db = window.openDatabase(dbname, version, display_name, 100000000);
        this.db.transaction(
            function (transaction) {
                transaction.executeSql(
                    "CREATE TABLE IF NOT EXISTS life_lighters (_id INTEGER PRIMARY KEY , lighter_id INTEGER UNIQUE, name VARCHAR(30) UNIQUE, icon VARCHAR(255), published BOOLEAN)",
                    [],
                    function (transaction, resultSet) {
                        console.log('life lighters table created');
                        console.log(resultSet);
                    },
                    function (transaction, error) {
                        console.log("Error when creating table : " + error.message)
                    }
                );
                transaction.executeSql(
                    "CREATE TABLE IF NOT EXISTS lighter_dates (_id INTEGER PRIMARY KEY , lighter_id INTEGER, _date INTEGER, title VARCHAR(255), main_verse VARCHAR(255) NULL, main_reading VARCHAR(255), body TEXT, prayer TEXT, declaration TEXT, further_reading VARCHAR(255), author VARCHAR(255))",
                    [],
                    function (transaction, resultSet) {
                        console.log('life lighters dates table created');
                        console.log(resultSet);
                    },
                    function (transaction, error) {
                        console.log("Error when creating table : " + error.message)
                    }
                );
            },
            function (error) {
                console.log('Error :' + error.message);
            },
            function () {
                console.log("Database has been created");
            }
        );
    },
    addLifeLighter: function (lifeligter, insertDates, data) {
        return this.db.transaction(
            function (transaction) {
                transaction.executeSql(
                    "INSERT INTO life_lighters(lighter_id, name, icon, published) VALUES (?, ?, ?, ?)",
                    [
                        lifeligter.id,
                        lifeligter.name,
                        "icon.png",
                        false
                    ],
                    function (transaction, resultSet) {
                        console.log('life lighter added');
                        insertDates(true, data);
                        return true;
                    },
                    function (transaction, error) {
                        console.log('Error :' + error.message);
                        insertDates(false);
                        return false;
                    }
                );
            }, function (error) {
                return false;
            }, function () {

            }
        );
    },
    addDate: function (date) {
        this.db.transaction(
            function (transaction) {
                transaction.executeSql(
                    "INSERT INTO lighter_dates (lighter_id, _date, title, main_verse, main_reading, body, prayer, declaration, further_reading, author) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        date.life_lighter_id,
                        date.date,
                        date.title,
                        date.main_verse,
                        date.main_reading,
                        date.body,
                        date.prayer,
                        date.declaration,
                        date.further_reading,
                        date.author
                    ],
                    function (transaction, resultSet) {
                        return true;
                    },
                    function (transaction, error) {
                        return false;
                    }
                );
            },
            function (error) {

            },
            function () {

            }
        );
    },
    getLifeLighters: function (populateLighters) {
        this.db.readTransaction(
            function (transaction) {
                transaction.executeSql(
                    "SELECT * FROM life_lighters WHERE published = ? ORDER BY lighter_id DESC",
                    [
                        true
                    ],
                    function (transaction, resultSet) {
                        populateLighters(resultSet.rows);
                        console.log(resultSet);
                    },
                    function (transaction, error) {
                        console.log('failed to populate life lighters: ' + error.message);
                    }
                );
            },
            function (error) {
                console.log('failed to start up read transaction');
            }
        );
    },
    publishLifeLighter: function (lighter_id) {
        this.db.transaction(
            function (transaction) {
                transaction.executeSql(
                    "UPDATE life_lighters SET published = ? WHERE lighter_id = ?",
                    [
                        true,
                        lighter_id
                    ],
                    function (transaction, resultSet) {
                        console.log('life lighter published');
                    },
                    function (transaction, error) {
                        console.log('life lighter publishing failed');
                    }
                );
            },
            function (error) {
                console.log('failed to publish life lighter');
            },
            function () {

            }
        );
    },
    getDates: function (lighter_id, fillDates) {
        this.db.readTransaction(
            function (transaction) {
                transaction.executeSql(
                    "SELECT * FROM lighter_dates WHERE lighter_id = ? ORDER BY _date ASC",
                    [
                        lighter_id
                    ],
                    function (transaction, resultSet) {
                        console.log(resultSet);
                        fillDates(resultSet.rows);
                    },
                    function (transaction, error) {
                        console.log(error.message);
                    }
                );
            }, function (error) {
                console.log(error.message);
            }, function () {

            }
        );
    },
    getDate: function (id, fillDate) {
        this.db.readTransaction(
            function (transaction) {
                transaction.executeSql(
                    "SELECT * FROM lighter_dates WHERE _id = ?",
                    [
                        id
                    ],
                    function (transaction, resultSet) {
                        console.log(resultSet);
                        fillDate(resultSet);
                    },
                    function (transaction, error) {
                        console.log(error.message);
                    }
                );
            },
            function (error) {
                console.log(error.message);
            },
            function () {

            }
        );
    },
    deleteLifeLighter: function (id) {
        this.db.transaction(
            function (transaction) {
                transaction.executeSql(
                    "DELETE FROM life_lighters WHERE lighter_id = ?",
                    [
                        id
                    ],
                    function (transaction, resultSet) {
                        console.log(resultSet);
                        console.log("life lighter deleted");
                        transaction.executeSql(
                            "DELETE FROM lighter_dates WHERE lighter_id = ?",
                            [
                                id
                            ],
                            function (transaction2, resultSet2) {
                                console.log(resultSet2);
                                console.log('dates deleted');
                            },
                            function (transaction2, error) {
                                console.log(error.message);
                            }
                        );
                    },
                    function (transaction, error) {
                        console.log(error.message);
                    }
                );
            },
            function (error) {
                console.log(error.message);
            },
            function () {
                console.log('delete transaction open');
            }
        );
    }
};
var results = {
    inserted: false
};
