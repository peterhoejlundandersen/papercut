// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require cocoon
//= require rails-ujs
//= require_tree .


// Open or hide search window
openOrHide = function(page_id, btn_id) {
  var page = document.getElementById(page_id);
  var button = document.getElementById(btn_id);
  if (page.classList.contains('hide-it')) { // OPENING IT
    page.classList.remove('hide-it');
    if (btn_id == "menuBtnMobile") {
      button.classList.add('close-icon');
      document.getElementById('closeArea').classList.remove('hide-it');
    }
    if (btn_id == "searchButton") {document.querySelector('[data-search="input"]').focus();} // Kun for search
    button.classList.add('active');
  } else { // CLOSING IT
    page.classList.add('hide-it');
    if (btn_id == "menuBtnMobile") {
      button.classList.remove('close-icon');
      document.getElementById('closeArea').classList.add('hide-it');
    }
    button.classList.remove('active');
  }
};

// Newsline
animateLeft = function(obj, from, to){
  if(from < to){
     animateLeft(obj, screen.width, to);
   }
   else {
       var box = obj;
       box.style.left = from + "px";
       setTimeout(function(){
           animateLeft(obj, from - 3, to);
       }, 25)
   }
}

window.onload = function() {

  var cookiesMessage = document.getElementById('cookieMessage');
  if (document.cookie.indexOf('allow_cookies_now') < 0) { // Hvis cookien ikke er der - vis besked
    cookiesMessage.classList.remove('hide-it');
    document.getElementById('acceptCookies').addEventListener('click', function() {
      cookiesMessage.classList.add('hide-it');
      var expiryDate = new Date(); expiryDate.setMonth(expiryDate.getMonth() + 2);
      document.cookie = 'allow_cookies_now=true; expires=' + expiryDate.toGMTString();
      return false;
    });
  } 

  // Menuen skal vises på desktop, men ikke på mobil
  if (screen.width > 850) {
    var menuWrapper = document.getElementById('menuWrapper');
    if (menuWrapper.classList.contains('for-js-show-menu-on-root')) {
      menuWrapper.classList.remove('hide-it');
      document.getElementById('menuBtn').classList.add('active');
    }
  } 
  document.querySelectorAll('[data-openpage]').forEach(function(item) {
    item.addEventListener('click', function() {
      openOrHide(item.dataset.openpage, item.dataset.btn);
    });
  });

// Newsline
  newsline_obj = document.querySelector('[data-newsline="moving"]');
  if (newsline_obj) {
    obj_width = newsline_obj.clientWidth;
    animateLeft(newsline_obj, screen.width, 0 - obj_width);
  }
  

// Theme overview div adapts to image size
  var images = document.querySelectorAll('[data-size="image"]');
    images.forEach(function(image) {
      div_id = image.dataset.div;
      var box = document.getElementById('box' + div_id);
      if ((screen.width > 850) && (box.clientHeight < image.height + 100)) {
        box.style.minHeight = (image.height + 140) + 'px';
      }
        box.classList.add("theme-show");
    });
};
