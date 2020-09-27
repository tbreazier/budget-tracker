let db;

//Connect to indexDb and set version to 1
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store (table) called `new_transaction`
    db.createObjectStore('new_transaction', { autoIncrement: true });
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

//save offline transaction to indexDb
function saveTransaction(record) {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
  
    const transactionObjectStore = transaction.objectStore('new_transaction');
  
    transactionObjectStore.add(record);
};

//upload offline transactions
function uploadTransaction() {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
  
    const transactionObjectStore = transaction.objectStore('new_transaction');
  
    const getAllTransactions = transactionObjectStore.getAll();

    getAllTransactions.onsuccess = function() {
        if (getAllTransactions.result.length > 0) {
          fetch('/api/transaction', {
            method: 'POST',
            body: JSON.stringify(getAllTransactions.result),
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          })
            .then(response => response.json())
            .then(serverResponse => {
              if (serverResponse.message) {
                throw new Error(serverResponse);
              }
              const transaction = db.transaction(['new_transaction'], 'readwrite');
              const transactionObjectStore = transaction.objectStore('new_transaction');
              transactionObjectStore.clear();
    
              alert('All transactions have been submitted!');
            })
            .catch(err => {
              console.log(err);
            });
        }
    };

};

//listen for app coming back online
window.addEventListener('online', uploadTransaction);

