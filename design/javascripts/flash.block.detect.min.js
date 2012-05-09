/*
Flash Blocker Detector
v0.1 of 2010-03-12

This script detects whether popular Flash blocking extensions are installed
and active on the current page. It is highly sensitive to the inner workings
of the extensions themselves, and it can only detect the current version
(at time of writing) of the following extensions:

* FlashBlock for Chromium / Google Chrome (#1)
  https://chrome.google.com/extensions/detail/cdngiadmnkhgemkimkhiilgffbjijcie
* FlashBlock for Chromium / Google Chrome (#2)
  https://chrome.google.com/extensions/detail/gofhjkjmkpinhpoiabjplobcaignabnl
* FlashBlock for Firefox
  https://addons.mozilla.org/en-US/firefox/addon/433
* ClickToFlash for Mac/Safari
  http://rentzsch.github.com/clicktoflash/

BEGIN LICENSE BLOCK

Copyright (c) 2010 Mark Pilgrim

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

END LICENSE BLOCK
*/
var FBD = {
  has_flash_blocker: false,
  callback_func: null,
  fake_embed_1: null,
  fake_embed_2: null,
  fake_embed_watcher: null,

  dom_node_inserted: function(ev) {
    var target = ev.target;
    if (target.nodeType != 1) { return; }
    if (target.nodeName.toLowerCase() != 'div') { return; }
    if (target.className == 'ujs_flashblock_placeholder') {
      /* Chrome FlashBlock extension #1 */
      FBD.has_flash_blocker = true;
      if (target.title == '') {
	  /* one of ours */
          target.style.position = 'absolute';
          target.style.left = '-5000px';
      }
      window.setTimeout(FBD.cleanup, 0);
    } else if (target.hasAttribute('bgactive')) {
      /* Firefox FlashBlock extension */
      FBD.has_flash_blocker = true;
      if (target.title == document.location.href) {
	  /* one of ours */
          target.style.position = 'absolute';
          target.style.left = '-5000px';
      }
      window.setTimeout(FBD.cleanup, 0);
    } else if (target.hasAttribute('style') && target.getAttribute('style').indexOf('gofhjkjmkpinhpoiabjplobcaignabnl') != -1) {
      /* Chrome FlashBlock extension #2 */
      FBD.has_flash_blocker = true;
      target.style.position = 'absolute';
      target.style.left = '-5000px';
      window.setTimeout(FBD.cleanup, 0);
    }
  },

  check_embed_type: function() {
    /* ClickToFlash on Mac/Safari takes control of the Flash MIME type ('application/x-shockwave-flash'),
       then changes the type attribute (to 'application/futuresplash', which is also registered by the
       Flash plugin but NOT overridden by ClickToFlash) when you want to actually see a Flash object.
       By default, ClickToFlash with auto-allow very small Flash objects (less than 8x8 pixels),
       since these are hard to click. So we can create two Flash objects (one large and one tiny)
       and check whether their type attributes match. There's some racing conditions involved, so this
       function is called every 100ms for several seconds (until FBD gives up altogether). THIS WOULD
       BE MUCH SIMPLER IF WEBKIT WOULD IMPLEMENT THE DOMATTRMODIFIED EVENT OR HURRY UP AND SPEC OUT A
       PERFORMANT REPLACEMENT.
    */
    if ((FBD.fake_embed_1.type == 'application/x-shockwave-flash') && 
        (FBD.fake_embed_2.type != 'application/x-shockwave-flash')) {
      FBD.has_flash_blocker = true;
      FBD.cleanup();
    }
  },

  cleanup: function() {
    try {
      document.body.removeEventListener('DOMNodeInserted', FBD.dom_node_inserted, false);
    } catch (e) {}
    if (FBD.fake_embed_1) {
      FBD.fake_embed_1.parentNode.removeChild(FBD.fake_embed_1);
    }
    FBD.fake_embed_1 = null;
    if (FBD.fake_embed_2) {
      FBD.fake_embed_2.parentNode.removeChild(FBD.fake_embed_2);
    }
    FBD.fake_embed_2 = null;
    if (FBD.fake_embed_watcher != null) {
      window.clearInterval(FBD.fake_embed_watcher);
      FBD.fake_embed_watcher = null;
    }
    /* Some Flash blockers create placeholder elements that don't get deleted even though
       we just removed the embeds that they're holding a place for. This loop identifies
       them and removes them manually. It will not affect placeholders for other real
       Flash objects, just the 2 fake ones that this script created.
    */
    var overlays = document.getElementsByTagName('div');
    for (var i = 0; i < overlays.length; i++) {
      var o = overlays[i];
      if ((o.hasAttribute('bgactive') && o.title == document.location.href) || 
          (o.className == 'ujs_flashblock_placeholder' && o.title == '')) {
        o.parentNode.removeChild(o);
      }
    }
    FBD.callback_func(FBD.has_flash_blocker);
  },

  initialize: function(callback_function) {
    if (/*@cc_on!@*/false) { callback_function(false); return; } // no IE support
    if (window.opera) { callback_function(false); return; } // no Opera support
    FBD.callback_func = callback_function;
    document.body.addEventListener('DOMNodeInserted', FBD.dom_node_inserted, false);

    /* create one embed to trigger Flash blockers in the first place */
    var e = document.createElement('embed');
    e.style.position = 'absolute';
    e.style.left = '-5000px';
    e.width = 10;
    e.height = 10;
    e.src = '';
    e.type = 'application/x-shockwave-flash';
    FBD.fake_embed_1 = e;
    document.body.appendChild(e);
    
    /* create another embed to test ClickToFlash (see description above) */
    var e2 = document.createElement('embed');
    e2.style.position = 'absolute';
    e2.style.left = '-5000px';
    e2.width = 1;
    e2.height = 1;
    e2.src = '';
    e2.type = 'application/x-shockwave-flash';
    FBD.fake_embed_2 = e2;
    document.body.appendChild(e2);
    FBD.fake_embed_watcher = window.setInterval(FBD.check_embed_type, 100);
    window.setTimeout(FBD.cleanup, 5000);
  }
}
