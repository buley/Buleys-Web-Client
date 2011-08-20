function post_feedback(a,b,c,d){$.post("http://api.buleys.com/feedback/",{event:a,item:b,context:c,type:d},function(){},dataType="json")};
