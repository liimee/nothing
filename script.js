console.log('%cNothing WIP', 'padding: 8px; background-color: #007bff; color: white; border: 2px solid #00a1ff; font-size: 35px;');

var core = {
  root: document.documentElement,
  currentno: 0,
  homeOpen: false,
  openHome: function() {
    document.querySelector('#home').removeAttribute('onclick');
    document.querySelector('#overlay').style.zIndex = 6;
    document.querySelector('#overlay').style.opacity = 0.85;
    document.querySelector('#home').style.transform = 'scale(0, 0)';
    document.querySelector('#home').title = 'Close';
    $('#home').attr('onclick', 'core.closeHome();');
    core.homeOpen = true;
    setTimeout(function() {
      $('#home').attr('class', 'bx bx-x');
      document.querySelector('#home').style.transform = 'scale(1, 1)';
    }, 500);
  },
  closeHome: function() {
    core.homeOpen = false;
    document.querySelector('#home').removeAttribute('onclick');
    document.querySelector('#overlay').style.opacity = 0;
    document.querySelector('#overlay').style.zIndex = 0;
    document.querySelector('#home').style.transform = 'scale(0, 0)';
    document.querySelector('#home').title = 'Home';
    $('#home').attr('onclick', 'core.openHome();');
    setTimeout(function() {
      $('#home').attr('class', 'bx bx-circle');
      document.querySelector('#home').style.transform = 'scale(1, 1)';
    }, 500);
  },
  openApp: function(app) {
    core.closeHome();
    $('.window').css('z-index', 3);
    let thatNewWindow = document.createElement('div');
    thatNewWindow.classList.add('window');
    thatNewWindow.classList.add(app.id);
    thatNewWindow.setAttribute('data-maximized', 'false');
    thatNewWindow.setAttribute('data-bar-id', core.currentno);
    core.currentno += 1;
    thatNewWindow.style.width = '450px';
    thatNewWindow.style.top = '75px';
    thatNewWindow.style.left = '85px';
    thatNewWindow.style.height = '310px';
    thatNewWindow.style.zIndex = 4;
    thatNewWindow.setAttribute('onclick', 'core.bringWindowToFront(this)');
    let thatNewTop = document.createElement('div');
    thatNewTop.className = 'top';
    thatNewTop.ondblclick = 'core.maximizeWindow(this.parentElement);';
    thatNewTop.innerHTML = '<i class="bx bx-x" onclick="core.closeWindow(this);" style="margin-right: 6px; background-color: #ff0000; color: white; border-radius: 30px; cursor: pointer;"></i><i class="bx bx-expand" style="margin-right: 5px; border-radius: 30px; cursor: pointer; color: white; background-color: #5cce00;" onclick="core.maximizeWindow(this.parentElement.parentElement);"></i>' + app.name;
    let thatNewFrame = document.createElement('div');
    thatNewFrame.style.paddingRight = '10px';
    thatNewFrame.style.paddingLeft = '10px';
    thatNewFrame.style.height = '85%';
    thatNewFrame.innerHTML = '<iframe src="' + app.file + '"></iframe>';
    thatNewWindow.appendChild(thatNewTop);
    thatNewWindow.appendChild(thatNewFrame);
    document.querySelector('#desktop').appendChild(thatNewWindow);
    let barel = document.createElement('span');
    barel.style.display = 'inline-flex';
    barel.innerHTML = `<img src="${app.icon}" width="30" height="30"><span style="margin-top: auto; margin-bottom: auto;">${(app.name.length > 9) ? app.name.slice(0, 10) + '...' : app.name}</span>`;
    barel.style.transition = '.4s'
    barel.style.width = '10em';
    barel.style.overflow = 'hidden';
    barel.style.opacity = 0;
    setTimeout(() => {
      barel.style.opacity = 1;
    }, 90);
    barel.id = thatNewWindow.getAttribute('data-bar-id');
    let g = tippy(barel, {trigger: 'manual', content: `<div onclick="core.barthing('${barel.id}');">Close</div>`, hideOnClick: false, allowHTML: true});
    barel.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      g.show();
    });
    document.querySelector('#bar').appendChild(barel);
    core.calculateRunningApps();
    let position = { x: 0, y: 0 }

    interact(thatNewWindow).draggable({
      allowFrom: '.top',
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: false
        })
      ],
      listeners: {
        start (event) {
          core.bringWindowToFront(thatNewWindow);
        },
        move (event) {
          position.x += event.dx
          position.y += event.dy

          event.target.style.transform =
            `translate(${position.x}px, ${position.y}px)`
        },
      }
    })

    interact('.window').resizable({
      edges: {
        top   : false,
        left  : true,
        bottom: true,
        right : true
      }
    }).on('resizemove', event => {
      let { x, y } = event.target.dataset;

      Object.assign(event.target.style, {
        width: `${event.rect.width}px`,
        height: `${event.rect.height}px`
      })

      Object.assign(event.target.dataset, { x, y })
    })
  },
  closeWindow: function(el) {
    el.parentElement.parentElement.style.transition = '.4s';
    el.parentElement.parentElement.style.opacity = 0;
    document.getElementById(el.parentElement.parentElement.getAttribute('data-bar-id')).style.opacity = 0;
    setTimeout(function() {
      document.getElementById(el.parentElement.parentElement.getAttribute('data-bar-id')).remove();
      $(el).parent().parent().remove();
      core.calculateRunningApps();
    }, 400);
  },
  maximizeWindow: function(el) {
    el.style.transition = '.4s';
    if(el.getAttribute('data-maximized') == 'false') {
      el.setAttribute('data-initial-pos', el.style.transform);
      el.style.transform = 'none';
      el.children[0].children[1].classList.remove('bx-expand');
      el.children[0].children[1].classList.add('bx-collapse');
      el.setAttribute('data-initial-width', el.style.width);
      el.setAttribute('data-initial-height', el.style.height);
      el.style.top = 'calc(25px + 8px + 12px)';
      el.style.left = '12px';
      el.style.width = '95%';
      el.style.height = '93%';
      interact(el).draggable(false);
      interact(el).resizable(false);
      el.setAttribute('data-maximized', 'true');
    } else {
      el.style.top = '75px';
      el.style.left = '85px';
      el.style.transform = el.getAttribute('data-initial-pos');
      el.children[0].children[1].classList.remove('bx-collapse');
      el.children[0].children[1].classList.add('bx-expand');
      el.style.width = el.getAttribute('data-initial-width');
      el.style.height = el.getAttribute('data-initial-height');
      el.setAttribute('data-maximized', 'false');
      interact(el).draggable(true);
      interact(el).resizable(true);
      el.removeAttribute('data-initial-width');
      el.removeAttribute('data-initial-height');
      el.removeAttribute('data-initial-pos');
    }
    setTimeout(function() {
      el.style.transition = 'initial';
    }, 500);
  },
  apps: function(app) {
    $('#apps').append('<span id="' + app.id + '" class="app" onclick=\'if(core.homeOpen) {core.openApp(' + JSON.stringify(app) + ');}\'><div class="icon"><img alt="' + app.name + ' Icon" src="' + app.icon + '" width="45" height="45"></div><div class="appname">' + app.name + '</div></span>');
  },
  fps: 0,
  powerOff: function() {
    document.title = 'Shutting down — nothing';
    document.querySelector('#bar').style.top = '-45px';
    core.powerOffBtnTooltip.hide();
    setTimeout(function() {
      document.title = 'Powered off — nothing';
      document.querySelector('#power-off').style.zIndex = 1001;
      document.querySelector('#power-off').style.opacity = 1;
      setTimeout(function() {
        window.close();
      }, 725);
    }, 800);
  },
  bringWindowToFront: function(el) {
    $('.window').not(el).css('z-index', 3);
    el.style.zIndex = 4;
  },
  calculateRunningApps: function() {
    if(document.querySelectorAll('.window').length == 0) {
      document.title = 'Running — nothing';
    } else {
      document.title = (document.querySelectorAll('.window').length == 1) ? '1 running app — nothing' : document.querySelectorAll('.window').length.toString() + ' running apps — nothing';
    }
  },
  openr: function() {
    document.querySelector('#rightinfo').style.right = 0;
    setTimeout(() => { core.rightinfo = true; }, 550);
  },
  closr: function() {
    document.querySelector('#rightinfo').style.right = '-999px';
    core.rightinfo = false;
  },
  rightinfo: false,
  barthing: function(el) {
    core.closeWindow(document.querySelector(`.window[data-bar-id=${el}]`));
  }
};

if(localStorage.getItem('wp') === null) {
  localStorage.setItem('wp', 'd-1');
  core.root.style.setProperty('--bg-img', "url('images/wallpaper-1.png')");
} else {
  switch(localStorage.getItem('wp')) {
    case 'd-1':
    core.root.style.setProperty('--bg-img', "url('images/wallpaper-1.png')");
    break;
    case 'd-2':
    core.root.style.setProperty('--bg-img', "url('images/wallpaper-2.png')");
    break;
    case 'd-3':
    core.root.style.setProperty('--bg-img', "url('images/wallpaper-3.png')");
    break;
    case 'd-4':
    core.root.style.setProperty('--bg-img', "url('images/wallpaper-4.png')");
    break;
    case 'd-5':
    core.root.style.setProperty('--bg-img', "url('images/wallpaper-5.png')");
    break;
    case 'd-6':
    core.root.style.setProperty('--bg-img', "url('images/wallpaper-6.png')");
  }
}

if(localStorage.getItem('wprepeat') === null) {
  localStorage.setItem('wprepeat', 'false');
  core.root.style.setProperty('--bg-repeat', 'no-repeat');
} else {
  switch(localStorage.getItem('wprepeat')) {
    case 'false':
    core.root.style.setProperty('--bg-repeat', 'no-repeat');
  }
}

function networkThing() {
  let ty = navigator.connection.type;
  switch (ty) {
    case 'bluetooth':
      document.querySelector('#bar #network').innerHTML = '<i class="bx bx-bluetooth"></i>';
      core.networkTooltip.setContent('This device is connected to a Bluetooth device; downlink: ' + navigator.connection.downlink + ' MB/s; rtt: ' + navigator.connection.rtt + 'ms; effective type: ' + navigator.connection.effectiveType);
      break;
    case 'cellular':
      document.querySelector('#bar #network').innerHTML = '<i class="bx bx-bar-chart"></i>';
      core.networkTooltip.setContent('This device is connected to a celullar network; downlink: ' + navigator.connection.downlink + ' MB/s; rtt: ' + navigator.connection.rtt + 'ms\n effective type: ' + navigator.connection.effectiveType);
      break;
    case 'ethernet':
      document.querySelector('#bar #network').innerHTML = '<i class="bx bx-plug"></i>';
      core.networkTooltip.setContent('This device is connected to an ethernet network; downlink: ' + navigator.connection.downlink + ' MB/s; rtt: ' + navigator.connection.rtt + 'ms; effective type: ' + navigator.connection.effectiveType);
      break;
    case 'none':
      document.querySelector('#bar #network').innerHTML = '<i class="bx bx-wifi-off"></i>';
      core.networkTooltip.setContent('This device is not connected to a network.');
      break;
    case 'wifi':
      document.querySelector('#bar #network').innerHTML = '<i class="bx bx-wifi"></i>';
      core.networkTooltip.setContent('This device is connected to a Wi-Fi network; downlink: ' + navigator.connection.downlink + ' MB/s; rtt: ' + navigator.connection.rtt + 'ms; effective type: ' + navigator.connection.effectiveType);
      break;
    default:
      document.querySelector('#bar #network').innerHTML = '<i class="bx bx-question-mark"></i>';
      core.networkTooltip.setContent('This device is connected to an unknown network type; downlink: ' + navigator.connection.downlink + ' MB/s; rtt: ' + navigator.connection.rtt + 'ms; effective type: ' + navigator.connection.effectiveType);
  }
}

setInterval(function(){
  core.fps += 1;
}, 16);

setInterval(function(){
  document.querySelector('#bar #fps').innerText = core.fps;
  core.fpsTooltip.setContent(`${core.fps} FPS; ${ (core.fps < 20) ? 'Bad'
         : (core.fps < 41) ? 'OK'
         : (core.fps < 71) ? 'Very Good'
         : 'Amazing' }`);
  core.fps = 0;
}, 1000);

if(localStorage.getItem('dm') === null || localStorage.getItem('dm') == 'false') {
  localStorage.setItem('dm', 'false');
  core.root.style.setProperty('--bar-bg', '#fff');
  core.root.style.setProperty('--text-color', 'black');
  core.root.style.setProperty('--window-top', '#dbdbdb');
} else {
  core.root.style.setProperty('--bar-bg', '#212121');
  core.root.style.setProperty('--window-top', '#212121');
  core.root.style.setProperty('--text-color', 'white');
}

window.addEventListener('storage', function() {
  switch(localStorage.getItem('wp')) {
    case 'd-1':
    core.root.style.setProperty('--bg-img', "url('images/wallpaper-1.png')");
    break;
    case 'd-2':
    core.root.style.setProperty('--bg-img', "url('images/wallpaper-2.png')");
    break;
    case 'd-3':
    core.root.style.setProperty('--bg-img', "url('images/wallpaper-3.png')");
    break;
    case 'd-4':
    core.root.style.setProperty('--bg-img', "url('images/wallpaper-4.png')");
    break;
    case 'd-5':
    core.root.style.setProperty('--bg-img', "url('images/wallpaper-5.png')");
    break;
    case 'd-6':
    core.root.style.setProperty('--bg-img', "url('images/wallpaper-6.png')");
  }
});

document.addEventListener('DOMContentLoaded', function() {
document.title = 'Running — nothing';
core.clockTooltip = tippy(document.querySelector('#bar #clock'), { trigger: 'click', arrow: false });
core.deviceTooltip = tippy(document.querySelector('#rightinfo #device'), {trigger: 'click', arrow: false, content: navigator.appVersion });
core.fpsTooltip = tippy(document.querySelector('#bar #fps'), { trigger: 'click', arrow: false });
core.networkTooltip = tippy(document.querySelector('#bar #network'), {trigger: 'click', arrow: false});
core.powerOffBtnTooltip = tippy(document.querySelector('#power-off-button'), { trigger: 'click', interactive: true, arrow: false, allowHTML: true, content: '<span onclick="core.powerOff();" style="background-color: #ff4242; color: white; width: 100%; border-radius: 8px; padding: 5px;">Power Off?</span>' });

if (navigator.connection) {
  networkThing();
  navigator.connection.addEventListener('change', networkThing);
} else {
  document.querySelector('#bar #network').innerHTML = '<i class="bx bx-question-mark"></i><i class="bx bx-question-mark"></i>';
  core.networkTooltip.setContent('It seems like this browser does not support the JavaScript Network Information API.');
}

$('#rightinfo').on('click', function(e) {
    e.stopPropagation();
});

$(document).on('click', function (e) {
  if(core.rightinfo) {
    core.closr();
  }
});

setInterval(function(){
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let date = new Date();
  let minute = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
  let hour = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
  let year = date.getFullYear();
  let month = months[date.getMonth()];
  let day = date.getDate();
  document.querySelector('#clock').innerText = hour + ':' + minute;
  document.querySelector('#rclck').innerText = hour + ':' + minute;
  document.querySelector('#realOverlayClock').innerText = hour + ':' + minute;
  if (date.getHours() != 0 && date.getHours() < 11 && date.getHours() > 3) {
    document.querySelector('#overlayGreeting').innerText = 'Good morning!';
  } else if (date.getHours() > 10 && date.getHours() < 17) {
    document.querySelector('#overlayGreeting').innerText = 'Good afternoon!';
  } else if (date.getHours() < 20 && date.getHours() > 16) {
    document.querySelector('#overlayGreeting').innerText = 'Good evening!';
  } else if (date.getHours() != 0 && date.getHours() < 24 && date.getHours() > 19) {
    document.querySelector('#overlayGreeting').innerText = 'Good night 🌃';
  } else {
    document.querySelector('#overlayGreeting').innerText = 'Dude it\'s midnight';
  }
  core.clockTooltip.setContent(hour + ':' + minute + ' | ' + month + ' ' + day + ', ' + year);
}, 10);

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  document.querySelector('#device').innerHTML = '<i class="bx bx-mobile-alt"></i>';
} else {
  document.querySelector('#device').innerHTML = '<i class="bx bx-laptop"></i>';
}

if(localStorage.getItem('apps') === null) {
  let aps = {
    CHEINSTTROARLY: {
      name: 'CHEINSTTROARLY',
      file: 'minusone.html',
      id: 'CHEINSTTROARLY',
      icon: 'images/minusone.png'
    },
    wallpaperthing: {
      name: 'Desktop Wallpaper Settings',
      file: 'wallpaperthing.html',
      id: 'wallpaperthing',
      icon: 'images/wpthingicon.png'
    },
    oof: {
      name: 'Endless OOF',
      file: 'oof.html',
      id: 'oof',
      icon: 'images/oof.png'
    }
  }
  localStorage.setItem('apps', JSON.stringify(aps));
  let ia = JSON.parse(localStorage.getItem('apps'));
  for (let l = 0; l < Object.keys(ia).length; l++) {
    core.apps(ia[Object.keys(ia)[l]]);
  }
} else {
  let ia = JSON.parse(localStorage.getItem('apps'));
  if (!('CHEINSTTROARLY' in ia)) {
    ia.CHEINSTTROARLY = {
      name: 'CHEINSTTROARLY',
      file: 'minusone.html',
      id: 'CHEINSTTROARLY',
      icon: 'images/minusone.png'
    };
    localStorage.setItem('apps', JSON.stringify(ia));
  }
  if (!('wallpaperthing' in ia)) {
    ia.wallpaperthing = {
      name: 'Desktop Wallpaper Settings',
      file: 'wallpaperthing.html',
      id: 'wallpaperthing',
      icon: 'images/wpthingicon.png'
    };
    localStorage.setItem('apps', JSON.stringify(ia));
  }
  if (!('oof' in ia)) {
    ia.oof = {
      name: 'Endless OOF',
      file: 'oof.html',
      id: 'oof',
      icon: 'images/oof.png'
    }
    localStorage.setItem('apps', JSON.stringify(ia));
  }
  if (('helloworld' in ia)) {
    delete ia.helloworld;
    localStorage.setItem('apps', JSON.stringify(ia));
  }
  if(('notiftest' in ia)) {
    delete ia.notiftest;
    localStorage.setItem('apps', JSON.stringify(ia));
  }
  Object.keys(ia).forEach(function(key) {
    core.apps(ia[key]);
  });
}
});

document.addEventListener('keydown', function(event) {
  event.preventDefault();
  if (event.metaKey) {
    if(core.homeOpen) {
      core.closeHome();
    } else {
      core.openHome();
    }
  }
});
