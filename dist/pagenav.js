/*! pagenav.js v0.0.1 | MIT License | https://github.com/markserbol/pagenav */

(function($) {
  
  var self = this;
  
  self.defaults = {
    totalItems: 15,
    visibleItems: 10,
    href: '?page-{{number}}.html',
    hrefPattern: '{{number}}',
    currentItem: 3,
    showFirstLast: true,
    showPrevNext: true,
    itemClass: 'pagenav__item',
    currentItemClass: 'pagenav__item--current',
    itemLinkClass: 'pagenav__item-link',
    itemPrevClass: 'pagenav__item-prev',
    itemNextClass: 'pagenav__item-next',
    itemFirstClass: 'pagenav__item-first',
    itemLastClass: 'pagenav__item-last',
    itemPrevContent: 'Previous',
    itemNextContent: 'Next',
    itemFirstContent: 'First',
    itemLastContent: 'Last',
    itemDisabledClass: 'pagenav__item--disabled'
  };
  
  self.options = {};
  
  $.fn.addHref = function(itemIndex) {
    $(this).attr('href', self.options.href.replace(self.options.hrefPattern, itemIndex));
  };
  
  var methods = {
    
    init: function(settings) {
       
      return this.each(function() {
        
        var container = $(this), itemLink, data, listItem, items = [], item, next, prev, first, last;
        
        // get the options data from HTML
        data = {
          totalItems: container.data('items'),
          visibleItems: container.data('visible-items'),
          href: container.data('url-pattern'),
          hrefPattern: container.data('href-pattern'),
          currentItem: container.data('current')
        };
        
        // merge all the settings objects
        settings = $.extend(self.options, self.defaults, settings, data);
           
        // build the nav item <li> and <a> HTML structure   
        itemLink = '<a class=" ' + settings.itemLinkClass + ' "></a>';
        
        listItem = '<li class=" ' + settings.itemClass + ' ">' + itemLink + '</li>';

    
        // Get the current item
        // Set the first item which is the previous of the current item
        // Set the last item base on the visibleItems
        var current = settings.currentItem,
            start = current > 1 ? current - 1 : 1,
            end = settings.totalItems - (end = start + settings.visibleItems) < 0 ? settings.totalItems : end; 
        
        
        // Appending to the DOM multiple times causes mass redraws,      
        // so we need to add all the nav items in an array... 
        for(var i = start; i <= end; i++) {
          
          item = $(listItem);
          item.children('a').html(i).addHref(i);
          
          if(i === current) {
            item.addClass(settings.currentItemClass);
          }
          
          items.push(item.prop('outerHTML'));
        }
        
        // ... including the previous and next nav items...
        if(settings.showPrevNext) {
          prev = $(listItem).addClass(settings.itemPrevClass);

          prev.find('a').html(settings.itemPrevContent);

          if(current > 1) {
            prev.find('a').addHref(current - 1);
          } else {
            prev.addClass(settings.itemDisabledClass);
          }

          items.splice(0, 0, prev.prop('outerHTML'));

          next = $(listItem).addClass(settings.itemNextClass);

          next.find('a').html(settings.itemNextContent);  

          if(current < settings.totalItems) {
            next.find('a').addHref(current + 1);
          } else {
            next.addClass(settings.itemDisabledClass);
          }

          items.push(next.prop('outerHTML'));
        }
        
        // ... and the fist and last nav items...
        if(settings.showFirstLast) {
          first = $(listItem).addClass(settings.itemFirstClass);
          
          first.find('a').html(settings.itemFirstContent);
          
          if(current === 1) {
            first.addClass(settings.itemDisabledClass);
          } else {
            first.find('a').addHref(1);
          }
          
          items.splice(0, 0, first.prop('outerHTML'));
          
          last = $(listItem).addClass(settings.itemLastClass);
          
          last.find('a').html(settings.itemLastContent);
          
          if(current === settings.totalItems) {
            last.addClass(settings.itemDisabledClass);
          } else {
            last.find('a').addHref(settings.totalItems);
          }
          
          items.push(last.prop('outerHTML'));
        }
        
        // ... then append them to the DOM at once.
        container.append(items.join(''));
        
        // On browser resize check which item overflows outside the container
        // 
        $(window).on('resize.pagenav', function() {
          
          var prev = '', next = '', first = '', last = '', 
              containerWidth = container.width(), 
              widths = 0,
              lastItemIndex = 0;
          
          if(settings.showPrevNext) {
            prev = container.find('.'+settings.itemPrevClass);
            next = container.find('.'+settings.itemNextClass);
            
            widths += prev.outerWidth(true) + next.outerWidth(true);
          }
          
          if(settings.showFirstLast) {
            first = container.find('.'+settings.itemFirstClass);
            last = container.find('.'+settings.itemLastClass);
            
            widths += first.outerWidth(true) + last.outerWidth(true);
          }
          
          // loop through each item 
          // to get the index of last item that needs to be shown
          var items = container.find('.'+settings.itemClass).not(prev).not(next).not(first).not(last);
          
          items.each(function(index) {
            var item = $(this),
                itemWidth = item.outerWidth(true);
            window.console.log(lastItemIndex);
            
            // add up the item's width and compare it to the container's width
            // to determine if it will overflow outside the container
            if(widths + itemWidth <= containerWidth) {
              widths += itemWidth;
              lastItemIndex = index;
            } else {
              // if the current item starts to overflow break the loop
              return false;
            }
          });
          
          // show all items which were previously hidden due to browser resize
          // hide the rest of the items that overflow
          items.show().slice(lastItemIndex + 1).hide();
                
        }).trigger('resize.pagenav');
 
      });    
      
    },
    
    destroy: function() {
      
      // remove the contents and unbind the window resize function
      $(this).empty();
      $(window).off('resize.pagenav');
      
      return this;
    },
    
    updateCurrent: function(current) {
      
      // first, call the destroy method
      // set the new current item on the elements data attribute
      // and on the stored data memory
      // then reapply init
      $(this).pagenav('destroy')
        .attr('data-current', current).data('current', current)
        .pagenav(self.options);
      
      return this;
    }
    
  };
  
  
  $.fn.pagenav = function(method) {
    if(methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method "' + method + '" does not exist on folio');
    }
  };
  
})(jQuery);