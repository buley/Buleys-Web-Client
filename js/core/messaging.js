function post_feedback(a,b,c,d){$.post("/feedback/index.php",{event:a,item:b,context:c,type:d},function(){},dataType="json")};
