#/bin/bash
sudo /ImageMagick-6.6.7/bin/convert 1percenttransparency.png 2percenttransparency.png 5percenttransparency.png 10percenttransparency.png  20percenttransparency.png 50percenttransparency.png 80percenttransparency.png +append transparencies.png
sudo /ImageMagick-6.6.7/bin/convert heart.png heart-empty.png heart-break.png star.png star-empty.png star-small-empty.png sort-alphabet-descending.png sort-alphabet.png heart-small-empty.png +append actions_1.png
sudo /ImageMagick-6.6.7/bin/convert mail.png mail-send.png inbox.png inbox-document.png sort-date.png sort-number-descending.png sort-price.png fire.png heart-small.png +append actions_2.png
sudo /ImageMagick-6.6.7/bin/convert thumb.png thumb-empty.png thumb-up.png thumb-up-empty.png sort-number.png sort-price-descending.png sort-quantity.png slash.png slash-small.png +append actions_3.png
sudo /ImageMagick-6.6.7/bin/convert cross.png cross-circle.png question.png magnifier.png magnifier-small.png xfn-sweetheart.png sort-date-descending.png star-small.png star-small-empty.png +append actions_4.png
sudo /ImageMagick-6.6.7/bin/convert 154.png 158.png 159.png 160.png door-open.png door-open-in.png sort-rating-descending.png sort-rating.png sort.png +append circles.png
sudo /ImageMagick-6.6.7/bin/convert facebook.png twitter.png reddit.png digg.png sort-small.png edit-code.png edit-size-down.png edit-size-up.png wall.png +append social.png
sudo /ImageMagick-6.6.7/bin/convert actions_1.png actions_2.png actions_3.png circles.png social.png actions_4.png -append sprite.png
sudo /ImageMagick-6.6.7/bin/convert big-inbox.png big-inbox-document.png big-briefcase.png big-magnifier.png -append big-sprite1.png
sudo /ImageMagick-6.6.7/bin/convert big-thumb-up.png big-thumb.png big-star.png big-star-empty.png -append big-sprite2.png
sudo /ImageMagick-6.6.7/bin/convert big-sprite1.png big-sprite2.png +append big-sprite.png
sudo /ImageMagick-6.6.7/bin/convert sprite.png big-sprite.png +append sprite-combined-pre-1.png

sudo /ImageMagick-6.6.7/bin/convert hacker-news.png techmeme.png balloon-facebook-left.png balloon-facebook.png balloon-twitter-left.png balloon-twitter-retweet.png balloon-twitter.png balloon-buzz.png balloon-buzz-left.png +append row_1_9_icons.png

sudo /ImageMagick-6.6.7/bin/convert big-bin-metal.png big-bell.png +append row_2_2_big_icons.png

sudo /ImageMagick-6.6.7/bin/convert row_1_9_icons.png row_2_2_big_icons.png +append sprite-combined-bottom.png

sudo /ImageMagick-6.6.7/bin/convert sprite-combined-pre-1.png  sprite-combined-bottom.png -append sprite-combined-pre-2.png 

sudo /ImageMagick-6.6.7/bin/convert big-balloon-facebook.png big-balloon-twitter.png big-database-export.png big-database-import.png big-database.png -append column_1_5_big_icons.png

sudo /ImageMagick-6.6.7/bin/convert big-fire.png big-soap.png big-thumb-empty.png big-thumb-up-empty.png big-wooden-box.png -append column_2_5_big_icons.png

sudo /ImageMagick-6.6.7/bin/convert sprite-combined-pre-2.png column_1_5_big_icons.png column_2_5_big_icons.png +append sprite-combined.png




sudo rm transparencies.png actions_1.png actions_2.png actions_3.png actions_4.png circles.png social.png big-sprite1.png big-sprite.png big-sprite2.png sprite-combined-bottom.png sprite-combined-pre-2.png row_2_2_big_icons.png column_2_5_big_icons.png column_1_5_big_icons.png row_1_9_icons.png sprite-combined-pre-1.png
