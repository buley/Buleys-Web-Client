#/bin/bash
sudo /ImageMagick-6.6.7/bin/convert 1percenttransparency.png 2percenttransparency.png 5percenttransparency.png 10percenttransparency.png  20percenttransparency.png 50percenttransparency.png 80percenttransparency.png +append transparencies.png
sudo /ImageMagick-6.6.7/bin/convert heart.png heart-empty.png heart-break.png star.png star-empty.png star-small-empty.png sort-alphabet-descending.png sort-alphabet.png heart-small-empty.png +append actions_1.png
sudo /ImageMagick-6.6.7/bin/convert mail.png mail-send.png inbox.png inbox-document.png sort-date.png sort-number-descending.png sort-price.png fire.png heart-small.png +append actions_2.png
sudo /ImageMagick-6.6.7/bin/convert thumb.png thumb-empty.png thumb-up.png thumb-up-empty.png sort-number.png sort-price-descending.png sort-quantity.png slash.png slash-small.png +append actions_3.png
sudo /ImageMagick-6.6.7/bin/convert cross.png cross-circle.png question.png magnifier.png magnifier-small.png xfn-sweetheart.png sort-date-descending.png star-small.png star-small-empty.png +append actions_4.png
sudo /ImageMagick-6.6.7/bin/convert 154.png 158.png 159.png 160.png door-open.png door-open-in.png sort-rating-descending.png sort-rating.png sort.png +append circles.png
sudo /ImageMagick-6.6.7/bin/convert facebook.png twitter.png reddit.png digg.png sort-small.png edit-code.png edit-size-down.png edit-size-up.png wall.png +append social.png
sudo /ImageMagick-6.6.7/bin/convert actions_1.png actions_2.png actions_3.png circles.png social.png actions_4.png -append sprite.png
sudo rm transparencies.png actions_1.png actions_2.png actions_3.png actions_4.png circles.png social.png
