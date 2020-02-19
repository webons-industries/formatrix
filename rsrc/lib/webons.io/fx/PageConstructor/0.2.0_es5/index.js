'use strict';/*!
*  formatrix 0.4.4 (http://formatrix.org)
*  >> PageConstructor 0.2.0
*
*  Copyright (c) 2016-2020 Germo Moeller / webons.industries
*
*  This source code is licensed under the MIT license found in the
*  LICENSE file in the root directory of this source tree.
*
*////***************************************************************************>
(function(fx){var $=new fx(fx.vbind('lib://webons.io/fx/PageConstructor/','0.2.0','~?/'),{parent:'sys://formatrix-0.4.4/',called:'page'});$.prv={$:{instance:null,config:{prefix:'fx_'},events:{}}},Array.from||$.use({polyfill:'lib://webons.io/fx/PageConstructor/0.2.0/polyfill'}),$.use({evt:fx.vbind('lib://webons.io/fx/PageConstructor/')+'events::generator',lib:fx.vbind('lib://webons.io/fx/PageConstructor/')+'library'}),$.pub({get setup(){return $.prv.$.instance?null:{start:function start(config){$.prv.$.config=$.fx.object_merge($.prv.$.config,config),$.prv.$.events=new $.evt({singleton:!0}),$.prv.$.events.register('window::scroll',window,'scroll'),$.prv.$.events.register('window::resize',window,'resize'),$.fx.dom.ready(function(){$.lib.init()}),$.fx.pointer.register($.fx.pointer.current($.$.id).called,$.lib.$.provided),$.prv.$.instance=!1},close:function close(){$.prv.$.instance=!0}}},$:{get prefix(){return $.prv.$.config.prefix},get events(){return $.prv.$.events}},get dom(){return $.fx.dom},get api(){return $.lib.api},get tools(){return $.lib.tools}})})(Formatrix);