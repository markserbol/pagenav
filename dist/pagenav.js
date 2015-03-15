(function($) {
  
  var self = this;
  
  self.defaults = {
    totalItems: 15,
    visibleItems: 10,
    href: 'page-{{number}}.html',
    hrefPattern: '**number**',
    currentItem: 3,
    itemClass: 'pagenav__item',
    currentItemClass: 'pagenav__item--current',
    itemLinkClass: 'pagenav__item-link',
    itemPrevClass: 'pagenav__item-prev',
    itemNextClass: 'pagenav__item-next',
    itemPrevContent: 'Previous',
    itemNextContent: 'Next',
    itemDisabledClass: 'pagenav__item--disabled'
  };
  
  self.options = {};
  
  $.fn.addHref = function(itemIndex) {
    $(this).prop('href', self.options.href.replace('***', itemIndex));
  };
  
  var methods = {
    
    init: function(settings) {
       
      return this.each(function() {
        
        var $container = $(this), link, data, listItem, items = [], $item, $next, $prev;
        
        // get the options data in HTML
        data = {
          items: $container.data('items'),
          visibleItems: $container.data('visible-items'),
          href: $container.data('url-pattern'),
          currentItem: $container.data('current')
        };
        
        //
        settings = $.extend(self.options, self.defaults, settings, data);
           
        // build the nav item <li> and <a> HTML structure   
        link = '<a class=" ' + settings.itemLinkClass + ' "></a>';
        
        listItem = '<li class=" ' + settings.itemClass + ' ">' + link + '</li>';

    
        // Get the current item
        // Set the first item which is the previous of the current item
        // Set the last item base on the visibleItems
        var current = settings.currentItem,
            first = current > 1 ? current - 1 : 1,
            end = settings.totalItems - (end = first + settings.visibleItems) < 0 ? settings.totalItems : end; 
        
        
        // Appending to the DOM multiple times causes mass redraws,      
        // so we need to add all the nav items in an array... 
        for(var i = first; i <= end; i++) {
          
          $item = $(listItem);
          $item.children('a').html(i).addHref(i);
          
          if(i === current) {
            $item.addClass(settings.currentItemClass);
          }
          
          items.push($item.prop('outerHTML'));
        }
        
        // ... including the previous and next nav items...
        $prev = $(listItem).addClass(settings.itemPrevClass);
        
        $prev.find('a').html(settings.itemPrevContent);
        
        if(current > 1) {
          $prev.find('a').addHref(current - 1);
        } else {
          $prev.addClass(settings.itemDisabledClass);
        }
        
        items.splice(0, 0, $prev.prop('outerHTML'));
        
        $next = $(listItem).addClass(settings.itemNextClass);
        
        $next.find('a').html(settings.itemNextContent);  
        
        if(current < settings.totalItems) {
          $next.find('a').addHref(current + 1);
        } else {
          $next.addClass(settings.itemDisabledClass);
        }
        
        items.push($next.prop('outerHTML'));
        
        // ... and append them to the DOM at once.
        $container.append(items.join(''));
        
        // On browser resize check which item overflows outside the $container
        // 
        $(window).on('resize.pagenav', function() {
          
          var $containerWidth = $container.width(),
              prev = $container.find('.'+settings.itemPrevClass),
              prevWidth = prev.outerWidth(true),
              next = $container.find('.'+settings.itemNextClass),
              nextWidth = next.outerWidth(true),
              items = $container.find('.'+settings.itemClass).not(prev).not(next),
              widths = prevWidth + nextWidth,
              lastItemIndex = 0;
          
          // loop through each item 
          // to get the index of last item that needs to be shown
          items.each(function(index) {
            var item = $(this),
                itemWidth = item.outerWidth(true);
            window.console.log(lastItemIndex);
            
            // add up the item's width and compare it to the $container's width
            // to determine if it will overflow outside the $container
            if(widths + itemWidth <= $containerWidth) {
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