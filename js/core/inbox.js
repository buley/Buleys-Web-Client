function add_topics_to_mini_inbox(){jQuery("#mini_inbox_list").html("");var b=0;getKeys(Buleys.queues.new_items)>0?$.each(Buleys.queues.new_items,function(c,a){if(b<=Buleys.settings.mini_inbox_topic_count){add_topic_to_mini_inbox(c,a);b++}}):jQuery("#mini_inbox_list").html("<li>No new items</li>")}
function add_topic_to_mini_inbox(b,c){new_topics_transaction();var a=Buleys.objectStore.get(b);a.onsuccess=function(){if(typeof a.result=="undefined"||a.result==""){var d=b.split("_",1),e=d[0];d=b.replace(d[0]+"_","");jQuery("#mini_inbox_list").append("<li><a href='/"+e+"/"+d+"' class='topic_name'>"+b+"</a> ("+c+")</li>")}else typeof a.result.name!="undefined"&&jQuery("#mini_inbox_list").append("<li><a href='/"+a.result.type+"/"+a.result.key+"' class='topic_name'>"+a.result.name+"</a> ("+c+")</li>")};
a.onerror=function(){}};