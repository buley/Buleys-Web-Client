function post_feedback(a,b,c,d){jQuery(document).trigger("post_feedback");$.post("http://api.buleys.com/feedback/",{event:a,item:b,context:c,type:d},function(){},dataType="json")};
