InDB={};InDB.factory={};InDB.db={};InDB.database={};InDB.store={};InDB.index={};InDB.range={};InDB.row={};InDB.cursor={};InDB.events={};InDB.transaction={};InDB.database.version=1;InDB.events.onComplete=function(a){console.log("IndexedDB request completed");console.log(a)};InDB.events.onSuccess=function(a){console.log("IndexedDB request successful");console.log(a)};InDB.events.onError=function(a){console.log("IndexedDB request errored");console.log(a)};
InDB.events.onAbort=function(a){console.log("IndexedDB request aborted");console.log(a)};InDB.browserSupported=function(){jQuery(document).trigger("doing_browserSupported");var a=-1;if(window.webkitIndexedDB||window.mozIndexedDB)a=0;else if(window.indexedDB)a=1;jQuery(document).trigger("InDB_did_browserSupported",{result:a});return a};
InDB.assert=function(a,b,f){b=b?b:"False assertion";result=false;switch(f){case "log":a?result=true:console.log(b);break;case "alert":a?result=true:alert(b);break;default:if(a)result=true;else throw Error(b);}return result};InDB.isEmpty=function(a){var b;if(a===""||a===0||a==="0"||a===null||a===false||typeof a==="undefined")return true;if(typeof a=="object"){for(b in a)return false;return true}return false};
InDB.fixBrowser=function(){jQuery(document).trigger("doing_fixBrowser");if(typeof window.webkitIndexedDB!=="undefined"){window.IDBCursor=window.webkitIDBCursor;window.IDBDatabase=window.webkitIDBDatabase;window.IDBDatabaseError=window.webkitIDBDatabaseError;window.IDBDatabaseException=window.webkitIDBDatabaseException;window.IDBErrorEvent=window.webkitIDBErrorEvent;window.IDBEvent=window.webkitIDBEvent;window.IDBFactory=window.webkitIDBFactory;window.IDBIndex=window.webkitIDBIndex;window.IDBKeyRange=
window.webkitIDBKeyRange;window.IDBObjectStore=window.webkitIDBObjectStore;window.IDBRequest=window.webkitIDBRequest;window.IDBSuccessEvent=window.webkitIDBSuccessEvent;window.IDBTransaction=window.webkitIDBTransaction;window.indexedDB=window.webkitIndexedDB}else if("mozIndexedDB"in window)window.indexedDB=window.mozIndexedDB};
InDB.database.create=function(a,b,f,c,d,e){var g={};if("undefined"===typeof b){g={keyPath:"key"};f=true}else if("undefined"===auto_increment)auto_incrementint_key=false;else g={keyPath:b};if("undefined"===typeof c)c=InDB.events.onSuccess;if("undefined"===typeof d)d=InDB.events.onError;if("undefined"===typeof e)e=InDB.events.onAbort;b=window.indexedDB.setVersion(parseInt(InDB.version,10));b.onsuccess=function(h){window.indexedDB.createObjectStore(a,g,f);jQuery(document).trigger("database_created_success",
{name:a,keyPath:g,auto_incrementing_key:f});c(h)};b.onerror=function(h){jQuery(document).trigger("database_created_error",{name:a,keyPath:g,auto_incrementing_key:f});d(h)};b.onabort=function(h){jQuery(document).trigger("database_created_abort",{name:a,keyPath:g,auto_incrementing_key:f});e(h)}};
InDB.index.create=function(a,b,f,c,d,e,g){if("undefined"===typeof c)c=false;if("undefined"===typeof e)e=InDB.events.onSuccess;if("undefined"===typeof on_error)on_error=InDB.events.onError;if("undefined"===typeof g)g=InDB.events.onAbort;var h=InDB.store.transaction(a);d=window.indexedDB.setVersion(parseInt(InDB.version,10));d.onsuccess=function(){h.createIndex(f,b,{unique:c});h.onsuccess=function(i){jQuery(document).trigger("index_created_success",{database:a,property:b,name:f,unique:c});e(i)};h.onerror=
function(i){jQuery(document).trigger("index_created_error",{database:a,property:b,name:f,unique:c});on_error(i)};h.onabort=function(i){jQuery(document).trigger("index_created_abort",{database:a,property:b,name:f,unique:c});g(i)}};d.onerror=function(i){on_error(i)};d.onabort=function(i){g(i)}};
InDB.database.open=function(a,b,f,c,d){jQuery(document).trigger("InDB_open_database",{name:a,description:b,on_complete:on_complete,on_error:c,on_abort:d});if("undefined"===typeof f)f=InDB.events.onSuccess;if("undefined"===typeof c)c=InDB.events.onError;if("undefined"===typeof d)d=InDB.events.onAbort;window.indexedDB.open(a,b);database_open_request.onsuccess=function(e){jQuery(document).trigger("InDB_open_database_success",{name:a,description:b,on_complete:on_complete,on_error:c,on_abort:d});f(e)};
database_open_request.onerror=function(e){jQuery(document).trigger("InDB_open_database_error",{name:a,description:b,on_complete:on_complete,on_error:c,on_abort:d});c(e)};database_open_request.onabort=function(e){jQuery(document).trigger("InDB_open_database_abort",{name:a,description:b,on_complete:on_complete,on_error:c,on_abort:d});d(e)}};InDB.transaction.read=function(){return IDBTransaction.READ_ONLY};InDB.transaction.read_write=function(){return IDBTransaction.READ_WRITE};
InDB.transaction.write=function(){return IDBTransaction.READ_WRITE};
InDB.transaction.create=function(a,b,f,c,d){jQuery(document).trigger("InDB_create_transaction",{name:name,type:b,on_complete:f,on_error:c,on_abort:d});if("undefined"===typeof b)b=IDBTransaction.READ_WRITE;if("undefined"===typeof timeout)timeout=1E3;if("undefined"===typeof f)f=InDB.events.onComplete;if("undefined"===typeof c)c=InDB.events.onError;if("undefined"===typeof d)d=InDB.events.onAbort;try{var e=Buleys.db.transaction([a],b,timeout);e.oncomplete=function(h){jQuery(document).trigger("transaction_complete",
{database:a,type:b,timeout:timeout});f(h)};e.onerror=function(h){jQuery(document).trigger("transaction_error",{database:a,type:b,timeout:timeout});c(h)};e.onabort=function(h){jQuery(document).trigger("transaction_abort",{database:a,type:b,timeout:timeout});d(h)};return e.objectStore(a)}catch(g){return g}};InDB.result=function(a){return"undefined"!==typeof a.result?a.result:null};InDB.value=function(a){return"undefined"!==typeof a.result&&"undefined"!==typeof a.result.value?a.result.value:null};
InDB.row.get=function(a,b,f,c,d,e){jQuery(document).trigger("InDB_get_record",{database:a,key:b,index:f,on_complete:c,on_error:d,on_abort:e});if("undefined"===typeof c)c=InDB.events.onSuccess;if("undefined"===typeof d)d=InDB.events.onError;if("undefined"===typeof e)e=InDB.events.onAbort;a=InDB.store.transaction(a,InDB.transaction.read());var g={};g="undefined"!==typeof f||null===f?a.index(f).get(b):a.get(b);g.onsuccess=function(h){jQuery(document).trigger("get_success",{event:h,database:database_name,
key:b,index:f,on_success:c,on_error:d,on_abort:e});c(h)};g.onerror=function(h){jQuery(document).trigger("get_error",{event:h,database:database_name,key:b,index:f,on_success:c,on_error:d,on_abort:e});d(h)};g.onabort=function(h){jQuery(document).trigger("get_abort",{event:h,database:database_name,key:b,index:f,on_success:c,on_error:d,on_abort:e});e(h)}};
InDB.row.remove=function(a,b,f,c,d,e){jQuery(document).trigger("set_record",{database:a,key:b,index:f,on_complete:c,on_error:d,on_abort:e});if("undefined"===typeof c)c=InDB.events.onSuccess;if("undefined"===typeof d)d=InDB.events.onError;if("undefined"===typeof e)e=InDB.events.onAbort;InDB.store.transaction(a,InDB.transaction.write())["delete"](b);get_request.onsuccess=function(g){jQuery(document).trigger("set_success",{event:g,database:database_name,key:b,index:f,on_success:c,on_error:d,on_abort:e});
c(g)};get_request.onerror=function(g){jQuery(document).trigger("set_error",{event:g,database:database_name,key:b,index:f,on_success:c,on_error:d,on_abort:e});d(g)};get_request.onabort=function(g){jQuery(document).trigger("set_abort",{event:g,database:database_name,key:b,index:f,on_success:c,on_error:d,on_abort:e});e(g)}};
InDB.row.add=function(a,b,f,c,d,e){jQuery(document).trigger("set_record",{database:a,key:b,index:f,on_complete:c,on_error:d,on_abort:e});if("undefined"===typeof c)c=InDB.events.onSuccess;if("undefined"===typeof d)d=InDB.events.onError;if("undefined"===typeof e)e=InDB.events.onAbort;InDB.store.transaction(a,InDB.transaction.write()).add(b);get_request.onsuccess=function(g){jQuery(document).trigger("set_success",{event:g,database:database_name,key:b,index:f,on_success:c,on_error:d,on_abort:e});c(g)};
get_request.onerror=function(g){jQuery(document).trigger("set_error",{event:g,database:database_name,key:b,index:f,on_success:c,on_error:d,on_abort:e});d(g)};get_request.onabort=function(g){jQuery(document).trigger("set_abort",{event:g,database:database_name,key:b,index:f,on_success:c,on_error:d,on_abort:e});e(g)}};InDB.range.only=function(a){return InDB.range.get(a,null,null,null,null)};InDB.range.left=function(a){return InDB.range.get(null,a,null,false,null)};
InDB.range.left_open=function(a){return InDB.range.get(null,a,null,true,null)};InDB.range.right=function(a){return InDB.range.get(null,null,a,null,false)};InDB.range.right_open=function(a){return InDB.range.get(null,null,a,null,true)};InDB.range.get=function(a,b,f,c,d){return b&&f&&c&&d?IDBKeyRange.bound(b,f,c,d):b&&c?IDBKeyRange.leftBound(b,c):f&&d?IDBKeyRange.rightBound(f,d):a?IDBKeyRange.only(a):false};
InDB.cursor.get=function(a,b,f,c,d,e,g){jQuery(document).trigger("InDB_get_rows",{database:a,key:key,index:b,map:c,on_complete:d,on_error:e,on_abort:g});if("undefined"===typeof d)d=InDB.events.onSuccess;if("undefined"===typeof e)e=InDB.events.onError;if("undefined"===typeof g)g=InDB.events.onAbort;var h=InDB.store.transaction(a,InDB.transaction.read()),i={};i="undefined"!==typeof b||null===b?h.index(b).openCursor(f):h.openCursor(f);i.onsuccess=function(j){jQuery(document).trigger("InDB_get_rows_success",
{event:j,database:a,key:key,index:b,map:c,on_complete:d,on_error:e,on_abort:g});d(j);j=j.target.result;c(j.value);try{j["continue"]()}catch(k){}};i.onerror=function(j){jQuery(document).trigger("InDB_get_rows_error",{event:j,database:a,key:key,index:b,map:c,on_complete:d,on_error:e,on_abort:g});e(j)};i.onabort=function(j){jQuery(document).trigger("InDB_get_rows_abort",{event:j,database:a,key:key,index:b,map:c,on_complete:d,on_error:e,on_abort:g});g(j)}};