var Buleys={};Buleys.db={};Buleys.version=7;Buleys.database_name="Buleys-320";Buleys.database_description="www.buleys.com";Buleys.on_complete=function(a){console.log("indexeddb request completed");console.log(a)};Buleys.on_error=function(a){console.log("indexeddb request errored");console.log(a)};Buleys.on_abort=function(a){console.log("indexeddb request aborted");console.log(a)};Buleys.queues={};Buleys.settings={};Buleys.profile={};Buleys.mouse={};Buleys.shortcuts={};Buleys.history={};
Buleys.session={};Buleys.view={};Buleys.view.scripts=[];Buleys.loader={};Buleys.loader.loaded_scripts=0;Buleys.loader.total_scripts=0;Buleys.debug={};Buleys.debug.database=false;Buleys.debug.ajax=false;Buleys.debug.items=false;Buleys.settings.mini_inbox_topic_count=5;Buleys.shortcuts.s_depressed=false;Buleys.shortcuts.d_depressed=false;Buleys.shortcuts.shift_depressed=false;Buleys.settings.crawl_speed=1E4;Buleys.settings.crawl_deincrement=0.5;Buleys.settings.crawl_increment=0.2;
Buleys.settings.crawl_max=6E6;Buleys.settings.crawl_min=1E4;Buleys.settings.hotkeys={};Buleys.settings.hotkeys.disabled=true;Buleys.queues.pending_crawls=[];Buleys.queues.new_items={};Buleys.mouse.mouse_y=0;Buleys.mouse.mouse_x=0;Buleys.mouse.mouse_y_snapshot=0;Buleys.mouse.mouse_x_snapshot=0;Buleys.store=window.localStorage;Buleys.session.database_is_open=false;var session_token="",debug;
$(document).ready(function(){set_page_vars();check_login_status();if(typeof Buleys.db==="object")open_database(Buleys.database_name,Buleys.database_description,function(a){Buleys.db=a.request.result;jQuery(document).trigger("database_loaded")},Buleys.on_error,Buleys.on_abort);else typeof Buleys.db==="IDBDatabase"&&jQuery(document).trigger("database_loaded")});jQuery(document).bind("database_open",function(){Buleys.session.database_is_open=true;load_current_page()});
