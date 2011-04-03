function new_subscriptions_transaction(){try{var a=Buleys.db.transaction(["subscriptions"],1,1E3);a.oncomplete=function(){delete Buleys.objectStore};a.onabort=function(){};Buleys.objectStore=a.objectStore("subscriptions")}catch(b){a=Buleys.db.setVersion(parseInt(Buleys.db.version)+1);a.onsuccess=function(){Buleys.objectStore=Buleys.db.createObjectStore("subscriptions",{keyPath:"key"},true);Buleys.objectStore.createIndex("modified","modified",{unique:false})};a.onerror=function(){}}}
function add_subscription_to_subscriptions_database(a,b){new_subscriptions_transaction();var c={key:a+"_"+b,modified:(new Date).getTime()},d=Buleys.objectStore.add(c);d.onsuccess=function(){Buleys.objectId=d.result};d.onerror=function(){}}
function get_page_subscription_status(a,b){new_subscriptions_transaction();var c=Buleys.objectStore.get(a+"_"+b);c.onsuccess=function(){typeof c.result=="undefined"||c.result==""?jQuery("#page_subscription_status").html("<div class='subscribe_topic empty_mail_icon'></div>"):jQuery("#page_subscription_status").html("<div class='unsubscribe_topic mail_icon'></div>")};c.onerror=function(){}}
function remove_subscription(a,b){new_subscriptions_transaction();var c=Buleys.objectStore["delete"](a+"_"+b);c.onsuccess=function(){delete Buleys.objectId};c.onerror=function(){}}function add_subscription_if_doesnt_exist(a,b){if(typeof a!=="undefined"&&typeof b!=="undefined"){new_subscriptions_transaction();var c=Buleys.objectStore.get(a+"_"+b);c.onsuccess=function(){typeof c.result=="undefined"&&add_subscription_to_subscriptions_database(a,b)};c.onerror=function(){}}}
function get_subscriptions(){new_subscriptions_transaction();try{new_categories_transaction();Buleys.index=Buleys.objectStore.index("id");var a=Buleys.index.getAll();a.onsuccess=function(){var c=a.result;c&&c.length>=0&&jQuery.each(c,function(){})};request.onerror=function(){}}catch(b){}}
$(".subscribe_topic").live("click",function(a){a.preventDefault();a=$(this).attr("key");var b=$(this).attr("type");if(typeof a=="undefined"||a=="")a=Buleys.view.slug;if(typeof b=="undefined"||b=="")b=Buleys.view.type;add_subscription_if_doesnt_exist(b,a);post_feedback("subscribe","",a,b);$(this).removeClass("empty_mail_icon").addClass("mail_icon");$(this).removeClass("subscribe_topic");$(this).addClass("unsubscribe_topic")});
$(".unsubscribe_topic").live("click",function(a){a.preventDefault();a=$(this).attr("key");var b=$(this).attr("type");if(typeof a=="undefined"||a=="")a=Buleys.view.slug;if(typeof b=="undefined"||b=="")b=Buleys.view.type;remove_subscription(b,a);post_feedback("unsubscribe","",a,b);$(this).removeClass("mail_icon").addClass("empty_mail_icon");$(this).removeClass("unsubscribe_topic");$(this).addClass("subscribe_topic")});
