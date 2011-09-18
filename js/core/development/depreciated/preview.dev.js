function open_preview(  item_to_preview  ) {
	jQuery(document).trigger('open_preview');

		var item_to_work_from = jQuery("#" + item_to_preview);
		console.log(item_to_work_from);
                if (item_to_work_from.hasClass('unseen')) {
                    item_to_work_from.removeClass('unseen');
                    item_to_work_from.addClass('seen');
                }
                url_to_preview = item_to_work_from.children('a').attr('href');
		console.log(url_to_preview);
		console.log(Buleys.view.slug);
		console.log(Buleys.view.type);
                mark_item_as_seen(url_to_preview, Buleys.view.slug, Buleys.view.type);
                load_item_to_overlay(url_to_preview);

                jQuery("#overlay").stop(true).animate({
                    opacity: 1
                }, 100, function (    ) {

		});
}
