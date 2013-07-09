/* ===========================================================
Carousel code
*/
var BackgroundSlider = function (options) {
  _.extend(this.options, options);
  this.$el = options.$el;
  this.initialize();
};

_.extend(BackgroundSlider.prototype, {
  initialize: function () {
    _.bindAll(this);

    this.model = new BaseModel();
    this.$backgroundHolder = this.$el.find('.js-background-slider');

    if (this.$backgroundHolder.length <= 0) {
      this.$backgroundHolder = this.createBackgroundElement();
      this.$el.prepend(this.$backgroundHolder);
    }

    this.bindEvents();
  },

  bindEvents: function () {

    this.model.on('change', this.modelChangedHandler);
  },

  modelChangedHandler: function () {
    if (this.model.isChanged('sliding')) {
      if (this.model.get('sliding') === true) {
        this.changeBackground();
      } else if (this.queue.length > 0) {
        this.model.set(this.queue.shift());
      }
    }
  },

  changeBackground: function () {
    var self = this,
    $newBackgroundHolder = this.createNewBackgroundElementFromUrl(this.model.get('backgroundUrl'), this.model.get("addMarkup")),
    callback = self.model.get('callback'),
    onFinish = function () {
      self.$backgroundHolder.remove();
      self.$backgroundHolder = $newBackgroundHolder;

      if (typeof callback === 'function') {
        callback.call();
      }

      self.model.set('sliding', false);
    };

    if (this.model.get('direction')) {
      this.slideToNewBackground(this.$backgroundHolder, $newBackgroundHolder, this.model.get('direction'), onFinish);
    } else {
      self.$backgroundHolder.after($newBackgroundHolder);
      onFinish();
    }
  },

  createNewBackgroundElementFromUrl: function (url, addMarkup) {
    return this.applyBackgroundImageToElement(url, this.createBackgroundElement(addMarkup));
  },

  slideToNewBackground: function ($fromBackground, $toBackground, slideDirection, callback) {

    var toBackgroundStartPosition = '100%',
    fromBackgroundEndPosition = '-100%';

    $fromBackground.after($toBackground);

    if (slideDirection === 'previous') {
      toBackgroundStartPosition = fromBackgroundEndPosition;
      fromBackgroundEndPosition = '100%';
    }      

    $fromBackground.css({
      right: 'auto',
      left: 0
    });

    $toBackground.css({
      right: 'auto',
      left: toBackgroundStartPosition
    });

    $fromBackground.animate({
      left: fromBackgroundEndPosition
    }, 'slow');

    $toBackground.animate({
      left: 0
    }, 'slow', callback);

  },

  applyBackgroundImageToElement: function (url, $element) {
    return $element.css({
      backgroundImage: 'url(' + url + ')'
    });
  },

  createBackgroundElement: function (addMarkup) {
    var $base = $('<div class="js-background-slider background-slider" style="width:100%" />');

    if (addMarkup) {
      $base.html('<div class="container section"><div class="row"><div class="col twelve mobile-full valign"><div>' + addMarkup + '</div></div></div></div>');
    }
    return $base;
  },

  slideToNewBackgroundImage: function (direction, url, addMarkup, callback, index) {
    var slideData = {
      direction: direction,
      backgroundUrl: url,
      sliding: true,
      callback: callback,
      addMarkup: addMarkup
    };

    if (this.model.get('sliding') !== true) {
      this.model.set(slideData);
    } else if (this.options.enableQueue === true) {
      this.queue.push(slideData);
    }
  },

  queue: [],
  options: {}
}); 
