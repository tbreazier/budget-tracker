let db;

//Connect to indexDb and set version to 1
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store (table) called `new_transaction`
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

//successful connection
request.onsuccess = function(event) {
    db = event.target.result;
  
    if (navigator.onLine) {
      uploadTransaction();
    }
};
  
  request.onerror = function(event) {
    console.log(event.target.errorCode);
};

