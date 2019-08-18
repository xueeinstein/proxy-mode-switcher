/* Proxy mode switcher applet
 * Switch proxy mode for gnome desktop
 *
 * Version 1.0
*/
const Applet = imports.ui.applet;
const Lang = imports.lang;
const PopupMenu = imports.ui.popupMenu;
const GLib = imports.gi.GLib;

const AppletDir = imports.ui.appletManager.appletMeta['proxy-mode-switcher@shadowthink'].path;
global.log(AppletDir);

const ProxyHelper = 'gproxy.sh';
const UUID = "proxy-mode-switcher@shadowthink";

const ProxyModeOptions = ["none", "auto", "manual"];

function MyApplet(orientation) {
  this._init(orientation);
}

MyApplet.prototype = {
  __proto__: Applet.IconApplet.prototype,

  _init: function(orientation) {
    Applet.IconApplet.prototype._init.call(this, orientation);

    try {
      let [res, out] = GLib.spawn_sync(null, ['/bin/bash', GLib.build_filenamev([AppletDir, ProxyHelper])], null, 0, null);
      this._proxyMode = out.toString().slice(1, -2);
      this.set_applet_tooltip("Proxy mode: " + this._proxyMode);
      this.set_applet_icon_name('proxy-' + this._proxyMode);

      this.menuManager = new PopupMenu.PopupMenuManager(this);
      this.menu = new Applet.AppletPopupMenu(this, orientation);
      this.menuManager.addMenu(this.menu);

      for (var n = 0; n < ProxyModeOptions.length; n++) {
        let menuItem = new PopupMenu.PopupMenuItem(ProxyModeOptions[n]);
        menuItem.connect('activate', Lang.bind(this, function(menuItem, event) {
          this._proxyMode = menuItem.label.text;
          let [res, out] = GLib.spawn_sync(null, ['/bin/bash', GLib.build_filenamev([AppletDir, ProxyHelper]), this._proxyMode], null, 0, null);
          this.set_applet_tooltip("Proxy mode: " + this._proxyMode);
          this.set_applet_icon_name('proxy-' + this._proxyMode);
        }));

        this.menu.addMenuItem(menuItem);
      }
    }
    catch (e) {
      global.logError(e);
    }
  },

  on_applet_clicked: function(event) {
    this.menu.toggle();
  },

};

function main(metadata, orientation) {
  let myApplet = new MyApplet(orientation);
  return myApplet;
}
