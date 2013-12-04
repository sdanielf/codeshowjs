/*
 * Copyright (C) 2013 Daniel Francis <francis@sugarlabs.org>
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA  02110-1301, USA.
 */

function khandle (e) {
    e = e || event;
    var evt = e.type;
    code = e.keyCode;
    if (code == 39) {
        next()
    } else if (code == 37) {
        previous()
    }
}

document.body.onkeyup = khandle;

function findPos(obj) {
  var curtop = 0;
  if (obj.offsetParent) {
    do {
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
  return curtop - 100;
}}

currentstep = 0;
var steps = document.body.getElementsByTagName('efect');

dostep = {'typing': function (origin, dest) {
    var text = origin.innerHTML;

    var timeout = setInterval(function () {
        window.scroll(0, findPos(dest))

        var to_add = origin.innerHTML[0];
        var to_stay = origin.innerHTML.substr(1) || '';
        if (to_add == '<') {
          while (to_add[to_add.length - 1] != '>') {
            to_add += to_stay[0];
            to_stay = to_stay.substr(1) || '';
          }
        }
        if (to_add == '&') {
          while (to_add[to_add.length - 1] != ';') {
            to_add += to_stay[0];
            to_stay = to_stay.substr(1) || '';
          }
        }
        dest.innerHTML += to_add;
        origin.innerHTML = to_stay;

        if (origin.innerHTML == ''){
          window.clearInterval(timeout)
          dest.innerHTML = text;
      }}, 10)
    },

    'remove': function (origin, dest) {
      origin.innerHTML = dest.innerHTML;
      dest.innerHTML = '';
    },

    'highlight': function (origin, dest) {
      dest.innerHTML = '<span style="background:#CCCCCC;"><b>' + dest.innerHTML + '</b></span>'
    },
    
    'darken': function (origin, dest) {
        var original = dest.innerHTML.substr(37)
        var re = '/</b></span>$/';
        original = original.replace(re, "");
        dest.innerHTML = original
    }
}

opposites = {'typing': 'remove',
             'remove': 'typing',
             'highlight': 'darken',
             'darken': 'highlight'}

next = function () {
    var step = currentstep;
    currentstep++;
    var origin = steps[step];
    var dest = document.getElementById(origin.getAttribute('dest'));
    window.scroll(0, findPos(dest));
    dostep[origin.className](origin, dest);
}

previous = function () {
    currentstep--;
    var origin = steps[currentstep];
    var dest = document.getElementById(origin.getAttribute('dest'));
    window.scroll(0, findPos(dest));
    dostep[opposites[origin.className]](origin, dest);
}