console.log('%cNothing', 'padding: 8px; background-color: #007bff; color: white; border: 2px solid #00a1ff; font-size: 35px;');

// Load settings
var db = new Dexie('stgdb');
db.version(1).stores({
  settings: 'sets, val'
});

var favapps = new Dexie('favapps');
db.version(1).stores({
  apps: 'id'
});

db.settings.get('timeformat', (v) => {
  if (v === undefined) {
    db.settings.put({
      sets: 'timeformat',
      val: '24'
    }, 'timeformat');
  } else {
    core.stg.timeformat = v.val;
  }
});
db.settings.get('lang', (v) => {
  if (v === undefined) {
    db.settings.put({
      sets: 'lang',
      val: 'en'
    }, 'lang');
    core.stg.lang = 'en';
  } else {
    core.stg.lang = v.val;
  }
});

favapps.apps.get('aps', (v) => {
  if (v === undefined) {
    favapps.apps.put({
      id: []
    }, 'aps');
  }
});

if(localStorage.getItem('wrong') === null) localStorage.setItem('wrong', CryptoJS.AES.encrypt('0', 'wrong'));

var core = {
  root: document.documentElement,
  currentno: 0,
  homeOpen: false,
  openHome: function() {
    document.querySelector('#home').parentElement.removeAttribute('onclick');
    document.querySelector('#overlay').style.zIndex = 6;
    document.querySelector('#overlay').style.opacity = 0.85;
    document.querySelector('#sapp').value = '';
    filt();
    document.querySelector('#home').parentElement.style.transform = 'scale(0, 0)';
    document.querySelector('#home').parentElement.title = 'Close';
    document.querySelector('#home').parentElement.setAttribute('onclick', 'core.closeHome();');
    core.homeOpen = true;
    setTimeout(function() {
      $('#home').attr('class', 'bx bx-x');
      document.querySelector('#home').parentElement.style.transform = 'scale(1, 1)';
    }, 500);
  },
  closeHome: function() {
    core.homeOpen = false;
    document.querySelector('#home').parentElement.removeAttribute('onclick');
    document.querySelector('#overlay').style.opacity = 0;
    document.querySelector('#overlay').style.zIndex = 0;
    document.querySelector('#home').parentElement.style.transform = 'scale(0, 0)';
    document.querySelector('#home').parentElement.title = 'Home';
    document.querySelector('#home').parentElement.setAttribute('onclick', 'core.openHome();');
    setTimeout(function() {
      $('#home').attr('class', 'bx bx-circle');
      document.querySelector('#home').parentElement.style.transform = 'scale(1, 1)';
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
    thatNewWindow.style.top = '75px';
    thatNewWindow.style.left = '85px';
    thatNewWindow.setAttribute('data-minimized', 'false');
    thatNewWindow.setAttribute('data-allow-modify-sys', 'false')
    thatNewWindow.style.zIndex = 4;
    thatNewWindow.setAttribute('data-name', app.name);
    thatNewWindow.setAttribute('onclick', 'core.bringWindowToFront(this)');
    let thatNewTop = document.createElement('div');
    thatNewTop.className = 'top';
    thatNewTop.title = app.name;
    thatNewTop.ondblclick = 'core.maximizeWindow(this.parentElement);';
    thatNewTop.innerHTML = '<i class="bx bx-x" title="Close" onclick="core.closeWindow(this);" style="margin-right: 6px; padding: 3px; background-color: #ff0000; color: white; border-radius: 30px; cursor: pointer;"></i><i class="bx bx-expand" title="Expand" style="margin-right: 5px; border-radius: 30px; cursor: pointer; color: white; background-color: #5cce00; padding: 3px;" onclick="core.maximizeWindow(this.parentElement.parentElement, this.parentElement.parentElement.getAttribute(\'data-bar-id\'));"></i><i class="bx bx-minus" style="padding: 3px; margin-right: 6px; background-color: #0094ff; color: white; border-radius: 30px; cursor: pointer;" onclick="core.hideWindow(' + core.currentno + ');" title="Hide"></i>' + app.name;
    let thatNewFrame = document.createElement('div');
    thatNewFrame.style.paddingRight = '10px';
    thatNewFrame.style.paddingLeft = '10px';
    thatNewFrame.style.height = '85%';
    thatNewFrame.innerHTML = '<iframe src="' + app.file + '"></iframe>';
    let channel = new MessageChannel();
    let port1 = channel.port1;
    thatNewFrame.children[0].addEventListener("load", () => {
      port1.onmessage = (e) => {
        core.onMessage(e, thatNewWindow);
      };
      thatNewFrame.children[0].contentWindow.postMessage({ name: 'init' }, '*', [channel.port2]);
      thatNewFrame.children[0].contentWindow.postMessage({ name: 'ready' });
    });
    setTimeout(() => {
      thatNewFrame.children[0].contentWindow.addEventListener('click', () => {
        core.bringWindowToFront(thatNewWindow);
      });
    }, 90);
    thatNewWindow.addEventListener('click', () => {
      thatNewFrame.children[0].contentWindow.postMessage({ name: 'windowfocused' });
    });
    thatNewTop.addEventListener('click', () => {
      thatNewFrame.children[0].contentWindow.postMessage({ name: 'windowfocused' });
    });
    thatNewWindow.appendChild(thatNewTop);
    thatNewWindow.appendChild(thatNewFrame);
    document.querySelector('#desktop').appendChild(thatNewWindow);
    let barel = document.createElement('span');
    barel.style.display = 'inline-flex';
    barel.innerHTML = `<span style="background-image: url(${app.icon}); width: 30px; height: 30px; background-repeat: no-repeat; background-size: cover;"></span><span style="margin-top: auto; margin-bottom: auto;">${(app.name.length > 9) ? app.name.slice(0, 10) + '...' : app.name}</span>`;
    barel.style.transition = '.4s'
    barel.style.width = '10em';
    barel.style.overflow = 'hidden';
    barel.style.opacity = 0;
    barel.style.userSelect = 'none';
    barel.style.WebkitUserSelect = 'none';
    barel.style.MsUserSelect = 'none';
    let nnm = tippy(barel, {
      followCursor: true,
      content: app.name,
      delay: 1000,
      offset: [0, 20]
    });
    barel.onclick = () => {
      core.showWindow(thatNewWindow.getAttribute('data-bar-id'));
    }
    setTimeout(() => {
      barel.style.opacity = 1;
    }, 90);
    barel.title = app.name;
    barel.id = thatNewWindow.getAttribute('data-bar-id');
    let brctx = document.createElement('div');
    brctx.style.display = 'none';
    brctx.style.position = 'fixed';
    brctx.innerHTML = `<div style="width: 92%; padding: .6em;" onclick="core.hmm(${thatNewWindow.getAttribute('data-bar-id')}); this.parentElement.remove();">Close</div><div style="width: 92%; padding: .6em;" onclick="core.hmm2(${thatNewWindow.getAttribute('data-bar-id')}); this.parentElement.style.display = 'none';">Hide</div><div style="padding: .6em; width: 92%;" onclick="core.idk(${thatNewWindow.getAttribute('data-bar-id')}); this.parentElement.style.display = 'none';">Expand</div><div onclick="core.closeAll('${app.id}'); this.parentElement.style.display = 'none';" style="padding: .6em; width: 92%;">Close all ${app.name}</div>`;
    brctx.setAttribute('data-ctxmn-id', core.currentno);
    brctx.style.zIndex = 1001;
    brctx.style.borderRadius = '4px';
    brctx.style.width = '9em';
    brctx.className = 'contextmenu';
    brctx.style.padding = '.6em';
    brctx.style.paddingLeft = 0;
    brctx.style.backgroundColor = 'white';
    document.body.appendChild(brctx);
    barel.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      brctx.style.top = e.clientY + 'px';
      brctx.style.left = e.clientX + 'px';
      brctx.style.display = 'block';
      nnm.hide();
    });
    $(brctx).on('click', (e) => {
      e.stopPropagation();
    })
    $(document).on('click', (e) => {
      brctx.style.display = 'none';
    });
    document.querySelector('#bar').appendChild(barel);
    core.calculateRunningApps();
    core.currentno += 1;
    let position = { x: 75, y: 85 };

    interact(thatNewWindow).draggable({
      allowFrom: '.top',
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: false
        })
      ],
      listeners: {
        start(event) {
          core.bringWindowToFront(thatNewWindow);
        },
        move(event) {
          position.x += event.dx
          position.y += event.dy

          event.target.style.left = `${position.x}px`;
          event.target.style.top = `${position.y}px`;
        },
      },
      cursorChecker() {
        return null;
      }
    })

    interact(thatNewWindow).resizable({
      edges: {
        top: false,
        left: true,
        bottom: true,
        right: true
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
    el.parentElement.parentElement.style.animation = 'closeWindow .4s ease-in-out';
    document.getElementById(el.parentElement.parentElement.getAttribute('data-bar-id')).style.opacity = 0;
    setTimeout(function() {
      document.getElementById(el.parentElement.parentElement.getAttribute('data-bar-id')).remove();
      $(el).parent().parent().remove();
      core.calculateRunningApps();
    }, 400);
  },
  closeAll: function(cl) {
    document.querySelectorAll(`.${cl}`).forEach((v) => {
      core.closeWindow(v.children[0].children[0]);
    });
  },
  maximizeWindow: function(el, attr) {
    el.style.transition = '.4s';
    if (el.getAttribute('data-maximized') == 'false') {
      document.querySelector(`[data-ctxmn-id="${attr}"]`).children[2].innerText = 'Collapse';
      el.setAttribute('data-initial-pos-left', el.style.left);
      el.setAttribute('data-initial-pos-top', el.style.top);
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
      setTimeout(() => {
        el.children[1].children[0].contentWindow.postMessage({ name: 'expand' });
      }, 401);
    } else {
      document.querySelector(`[data-ctxmn-id="${attr}"]`).children[2].innerText = 'Expand';
      el.style.left = el.getAttribute('data-initial-pos-left');
      el.style.top = el.getAttribute('data-initial-pos-top');
      el.children[0].children[1].classList.remove('bx-collapse');
      el.children[0].children[1].classList.add('bx-expand');
      el.style.width = el.getAttribute('data-initial-width');
      el.style.height = el.getAttribute('data-initial-height');
      el.setAttribute('data-maximized', 'false');
      interact(el).draggable(true);
      interact(el).resizable(true);
      el.removeAttribute('data-initial-width');
      el.removeAttribute('data-initial-height');
      el.removeAttribute('data-initial-pos-left');
      el.removeAttribute('data-initial-pos-top');
      setTimeout(() => {
        el.children[1].children[0].contentWindow.postMessage({ name: 'collapse' });
      }, 401);
    }
    setTimeout(function() {
      el.style.transition = 'initial';
    }, 500);
  },
  apps: function(app) {
    let as = document.createElement('span');
    as.oncontextmenu = (e) => {
      core.ctxmnaps(e, app.id)
    };
    as.id = app.id;
    as.setAttribute('data-name', app.name);
    as.className = "app"; 
    as.onclick = () => {
      if(core.homeOpen) core.openApp(app);
    }
    as.innerHTML = '<div style="background-image: url(' + app.icon + '); width: 45px; height: 45px; background-repeat: no-repeat; background-size: cover;"></div><div class="appname">' + app.name + '</div></span>';
    document.querySelector('#apps').appendChild(as);
    $('body').append('<div style="z-index: 5000; background-color: var(--bar-bg); position: fixed; color: var(--text-color); width: max-content; display: none; padding: 10px; border-radius: 8px" class="contextmenu" data-ctx-for="' + app.id + '"><div onclick="addToFavs(\'' + app.id + '\')">Add to Favorites</div></div>');
    document.addEventListener('click', () => {
      document.querySelector('[data-ctx-for="' + app.id + '"]').style.display = 'none';
    })
  },
  ctxmnaps: function(e, id) {
    e.preventDefault();
    document.querySelector('[data-ctx-for="' + id + '"]').style.display = 'block';
    document.querySelector('[data-ctx-for="' + id + '"]').style.left = e.clientX + 'px';
    document.querySelector('[data-ctx-for="' + id + '"]').style.top = e.clientY + 'px';
  },
  addToFavs: function(id) {
    favapps.apps.get('aps', (v) => {
      let jj = v.push(id);
      favapps.apps.put({
        id: jj
      }, 'aps');
    });
    core.refreshFavApps();
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
    if (document.querySelectorAll('.window').length == 0) {
      document.title = 'Running — nothing';
    } else {
      let t = (document.querySelectorAll('.window').length == 1) ? '1 running app' : document.querySelectorAll('.window').length.toString() + ' running apps';
      if (document.querySelectorAll('[data-minimized="true"]').length == 0) {
        document.title = t + ' — nothing';
      } else {
        t += ' (' + document.querySelectorAll('[data-minimized="true"]').length + ' hidden) — nothing';
        document.title = t;
      }
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
  hmm: function(attr) {
    core.closeWindow(document.querySelector(`[data-bar-id="${attr}"]`).children[0].children[0]);
  },
  hideWindow: function(el) {
    if (document.querySelector(`[data-bar-id="${el}"]`).getAttribute('data-minimized') == 'false') {
      document.querySelector(`[data-ctxmn-id="${el}"]`).children[1].innerText = 'Show';
      document.querySelector(`[data-bar-id="${el}"]`).style.transition = '.4s';
      document.querySelector(`[data-bar-id="${el}"]`).style.opacity = 0;
      setTimeout(() => {
        document.querySelector(`[data-bar-id="${el}"]`).style.display = 'none';
        document.querySelector(`[data-bar-id="${el}"]`).setAttribute('data-minimized', 'true');
        document.querySelector(`[data-bar-id="${el}"]`).style.transition = 'initial';
        core.calculateRunningApps();
        el.children[1].children[0].contentWindow.postMessage
      }, 450);
    }
  },
  showWindow: function(el) {
    if (document.querySelector(`[data-bar-id="${el}"]`).getAttribute('data-minimized') == 'true') {
      document.querySelector(`[data-ctxmn-id="${el}"]`).children[1].innerText = 'Hide';
      document.querySelector(`[data-bar-id="${el}"]`).style.transition = '.4s';
      document.querySelector(`[data-bar-id="${el}"]`).style.display = 'block';
      setTimeout(() => {
        document.querySelector(`[data-bar-id="${el}"]`).style.opacity = 1;
        document.querySelector(`[data-bar-id="${el}"]`).setAttribute('data-minimized', 'false');
        setTimeout(() => {
          document.querySelector(`[data-bar-id="${el}"]`).style.transition = 'initial';
          core.calculateRunningApps();
        }, 400);
      }, 90);
    }
  },
  hmm2: function(el) {
    if (document.querySelector(`[data-bar-id="${el}"]`).getAttribute('data-minimized') == 'true') {
      core.showWindow(el);
    } else {
      core.hideWindow(el);
    }
  },
  idk: function(el) {
    core.maximizeWindow(document.querySelector(`[data-bar-id="${el}"]`), el);
  },
  onMessage: function(e, abc) {
    switch (e.data.name) {
      case 'openapp':
        if (e.data.value in JSON.parse(localStorage.getItem('apps'))) {
          core.openApp(JSON.parse(localStorage.getItem('apps'))[e.data.value]);
        }
        break;
      case 'redirect':
        window.location = e.data.value;
        break;
      case 'restartos':
        core.restart(true);
        break;
      case 'sendnotification':
        core.sendNotif(e.data.title, e.data.content);
        break;
      case 'quit':
        core.closeWindow(abc.children[1].children[0]);
        break;
      case 'settings':
        if (abc.getAttribute('data-allow-modify-sys') == 'true') {
          switch (e.data.sets) {
            case 'theme':
              localStorage.setItem('dm', e.data.value);
              a();
              document.querySelectorAll('.window').forEach((v) => {
                core.onMessage('getsettings', v);
              });
              break;
            case 'password':
              core.changePass(e.data.value);
              break;
            case 'timeformat':
              core.stg.timeformat = e.data.value + '';
              core.onstgchg();
              break;
            case 'language':
              if (e.data.value == 'english') {
                core.stg.lang = 'en';
                core.onstgchg();
              } else if (e.data.value == 'undardese') {
                core.stg.lang = 'un';
                core.onstgchg();
              }
          }
        } else {
          core.requestSys(abc, e);
        }
        break;
      case 'getsettings':
        db.settings.get('timeformat', a => {
          db.settings.get('lang', b => {
            abc.children[1].children[0].contentWindow.postMessage({
              name: 'settings',
              value: {
                darkmode: localStorage.getItem('dm'),
                timeformat: a.val,
                language: b.val
              }
            });
          });
        });
        break;
      default:
        console.error(abc.getAttribute('data-name') + ': unknown request');
    }
  },
  restart: function(fromapp) {
    if (fromapp) {
      document.querySelector('#restartcontainer').style.display = 'block';
    }
  },
  realrestart: function() {
    location.reload();
  },
  sendNotif: function(title, content) {
    let ab = document.createElement('div');
    let ac = document.createElement('div');
    ac.className = 'notifTitle';
    ac.innerText = title;
    let ad = document.createElement('div');
    ad.innerText = content;
    ab.appendChild(ac);
    ab.appendChild(ad);
    document.body.appendChild(ab);
    ab.className = 'notif';
    setTimeout(() => {
      ab.style.top = '-6em';
      ab.style.animation = 'hideNotif .5s';
      setTimeout(() => {
        ab.remove();
      }, 501);
    }, 3000);
  },
  requestSys: function(hmm, hm) {
    document.querySelector('#req').children[1].children[0].innerText = hmm.getAttribute('data-name');
    document.querySelector('#req').children[2].children[1].onclick = () => {
      core.allowMod(hmm, hm);
    }
    document.querySelector('#req').children[2].children[0].onclick = () => {
      core.denyMod(hmm, hm);
    }
    document.querySelector('#requestcontainer').style.display = 'block';
  },
  allowMod: function(hmm, hm) {
    document.querySelector('#requestcontainer').style.display = 'none';
    hmm.setAttribute('data-allow-modify-sys', 'true');
    core.onMessage(hm, hmm);
  },
  denyMod: function(hmm, hm) {
    document.querySelector('#requestcontainer').style.display = 'none';
    hmm.setAttribute('data-allow-modify-sys', 'false');
    hmm.children[1].children[0].contentWindow.postMessage({ name: 'permdenied', sets: hm.data.name, value: localStorage.getItem('dm') });
  },
  changePass: function(p) {
    if (confirm('⚠️ An app wants to change your password')) {
      localStorage.setItem('pass', CryptoJS.AES.encrypt(p, 'nothinghhskpwpwueurrueioenxjdufhd'));
    }
  },
  checkPass: function(e) {
    //  if(e.keyCode == 13) {
    if (document.querySelector('#inppass').value == CryptoJS.AES.decrypt(localStorage.getItem('pass'), 'nothinghhskpwpwueurrueioenxjdufhd').toString(CryptoJS.enc.Utf8)) {
      document.querySelector('#password').style.display = 'none';
      localStorage.setItem('wrong', CryptoJS.AES.encrypt('0', 'wrong'));
      //document.querySelector('#inppass').removeEventListener('keyup', core.checkPass);
    } else {
      let kk = parseInt(CryptoJS.AES.decrypt(localStorage.getItem('wrong'), 'wrong').toString(CryptoJS.enc.Utf8)) + 1;
      localStorage.setItem('wrong', CryptoJS.AES.encrypt(kk.toString(), 'wrong'));
      core.chck();
      document.querySelector('#inppass').style.animation = 'wrongpass .5s';
      setTimeout(() => {
        document.querySelector('#inppass').style.animation = 'none';
      }, 501);
    }
  },
  chck: function() {
    if(parseInt(CryptoJS.AES.decrypt(localStorage.getItem('wrong'), 'wrong').toString(CryptoJS.enc.Utf8)) > 9) {
      document.querySelector('#wrongwrong').style.display = 'flex';
      window.stop();
    }
  },
  stg: {
    timeformat: '24'
  },
  onstgchg: function() {
    Object.keys(core.stg).forEach(v => {
      db.settings.put({
        sets: v,
        val: core.stg[v]
      }, v);
    });
  },
  refreshFavApps: function() {
    favapps.apps.get('aps', (v) => {
      alert(v);
    });
  },
  installAppFromUrl: function(u) {
    console.log('nothing app installer alpha 1 | may be buggy');
    console.warn('⚠️ Make sure to pass the raw html file url!');
    console.time('Instalation');
    fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(u)}?t=${new Date().getSeconds()}`)
      .then(response => {
        if (response.ok) return response.text()
        throw new Error('Network response was not ok.')
      })
      .then(data => {
        let parsed = new DOMParser().parseFromString(data, 'text/html');
        console.log('Checking required HTML tags...');
        if (parsed.querySelectorAll('meta[name="nothing-app-name"]').length == 0) {
          console.timeEnd('Instalation');
          console.error('Missing <meta name="nothing-app-name" content="Your App Name">');
          return;
        }
        if (parsed.querySelectorAll('meta[name="nothing-app-id"]').length == 0) {
          console.timeEnd('Instalation');
          console.error('Missing <meta name="nothing-app-id" content="Your App ID (must be unique!)">');
          return;
        }
        if (JSON.parse(localStorage.getItem('apps')).hasOwnProperty(parsed.querySelector('meta[name="nothing-app-id"]').getAttribute('content'))) {
          console.timeEnd('Instalation');
          console.error('An app with the same ID exists!');
          return;
        }
        if (parsed.querySelectorAll('link[rel="nothing-app-icon"]').length == 0) {
          console.timeEnd('Instalation');
          console.error('Missing <link rel="nothing-app-icon" href="Your App Icon URL">');
          return;
        }
        if (!parsed.querySelector('link[rel="nothing-app-icon"]').getAttribute('href').startsWith('https://')) {
          console.timeEnd('Instalation')
          console.error('Invalid icon url: Must be a whole URL, and use HTTPS!');
          return;
        }
        if (parsed.querySelectorAll('link[rel="nothing-app-page"]').length == 0) {
          console.timeEnd('Instalation');
          console.error('Missing <link rel="nothing-app-page" href="Your App Page—users will see this page">');
          return;
        }
        console.timeEnd('Instalation');
        console.log('Adding app to the database...')
        let p = JSON.parse(localStorage.getItem('apps'));
        p[parsed.querySelector('meta[name="nothing-app-id"]').getAttribute('content')] = {
          name: parsed.querySelector('meta[name="nothing-app-name"]').getAttribute('content'),
          icon: `https://api.allorigins.win/raw?url=${encodeURIComponent(parsed.querySelector('link[rel="nothing-app-icon"]').getAttribute('href'))}`,
          file: parsed.querySelector('link[rel="nothing-app-page"]').getAttribute('href'),
          id: parsed.querySelector('meta[name="nothing-app-id"]').getAttribute('content')
        };
        localStorage.setItem('apps', JSON.stringify(p));
        document.querySelector('#apps').innerHTML = '';
        Object.keys(JSON.parse(localStorage.getItem('apps'))).forEach((g) => {
          core.apps(JSON.parse(localStorage.getItem('apps'))[g]);
        });
        console.log('☑️ done—installation complete!');
      });
  },
  langs: {
    en: {
      restartreqtitle: '<div style="margin-bottom: 15px;"><i class="bx bx-refresh" style="font-size: 1.5em;"></i></div> Restart?',
      restartreqcontent: 'An app has requested to restart this OS.',
      cancel: 'Cancel',
      ok: 'OK',
      allow: 'Allow',
      deny: 'Deny',
      modifysysreqtitle: '<div style="margin-bottom: 15px;"><i class="bx bx-shield" style="font-size: 1.5em;"></i></div> Allow this app to modify OS settings?',
      modifysysreqcontent: 'has requested to modify OS settings. Even changing your password.'
    },
    un: {
      cancel: 'Llenrthœ',
      ok: 'Seri',
      allow: 'Wdœ',
      deny: 'Wdādhe',
      restartreqtitle: '<div style="margin-bottom: 15px;"><i class="bx bx-refresh" style="font-size: 1.5em;"></i></div> Maruththodakkanumā?',
      restartreqcontent: 'Orœ scheyyi ndhe iekkamoremeye maruththodakke Xētrkœ',
      modifysysreqtitle: '<div style="margin-bottom: 15px;"><i class="bx bx-shield" style="font-size: 1.5em;"></i></div> Ndhe scheyyiye moremeyōde (m)atsa(m)modeya(r‍)veye (m)āthe wdenumā?',
      modifysysreqcontent: 'iekkamore (m)atsa(m)modeya(r‍)veye (m)āthe Xētrkœ.'
    }
  },
  uninstallApp: function(ap) {
    if (!(ap in JSON.parse(localStorage.getItem('apps')))) {
      console.error('❌ App doesn\'t exist');
      return;
    }
    let u = JSON.parse(localStorage.getItem('apps'))[ap];
    delete u[ap];
    localStorage.setItem('apps', JSON.stringify(u));
    console.log('Done.');
    document.querySelector('#apps').innerHTML = '';
    Object.keys(JSON.parse(localStorage.getItem('apps'))).forEach((g) => {
      core.apps(JSON.parse(localStorage.getItem('apps'))[g]);
    });
  }
};

core.chck();

setInterval(() => {
  document.querySelectorAll('[data-translate]').forEach((v) => {
    v.innerHTML = core.langs[core.stg.lang][v.getAttribute('data-translate')];
  });
}, 10)

if (localStorage.getItem('wp') === null) {
  localStorage.setItem('wp', 'd-1');
  core.root.style.setProperty('--bg-img', "url('images/wallpaper-1.png')");
} else {
  switch (localStorage.getItem('wp')) {
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

if (localStorage.getItem('wprepeat') === null) {
  localStorage.setItem('wprepeat', 'false');
  core.root.style.setProperty('--bg-repeat', 'no-repeat');
} else {
  switch (localStorage.getItem('wprepeat')) {
    case 'false':
      core.root.style.setProperty('--bg-repeat', 'no-repeat');
  }
}

/*db.settings.get('timeformat', (v) => {
  alert(v.val);
});*/


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

setInterval(function() {
  core.fps += 1;
}, 16);

setInterval(function() {
  document.querySelector('#bar #fps').innerText = core.fps;
  core.fpsTooltip.setContent(`${core.fps} FPS; ${ (core.fps < 20) ? 'Bad'
         : (core.fps < 41) ? 'OK'
         : (core.fps < 71) ? 'Very Good'
         : 'Amazing' }`);
  core.fps = 0;
}, 1000);

function a() {
  if (localStorage.getItem('dm') === null || localStorage.getItem('dm') == 'false') {
    localStorage.setItem('dm', 'false');
    core.root.style.setProperty('--bar-bg', '#fff');
    core.root.style.setProperty('--text-color', 'black');
    core.root.style.setProperty('--window-top', '#dbdbdb');
  } else {
    core.root.style.setProperty('--bar-bg', '#212121');
    core.root.style.setProperty('--window-top', '#565656');
    core.root.style.setProperty('--text-color', 'white');
  }
}

a();

window.addEventListener('storage', function() {
  switch (localStorage.getItem('wp')) {
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

setTimeout(() => {
  document.querySelector('#startup').style.opacity = 0;
  setTimeout(() => {
    document.querySelector('#startup').style.display = 'none';
    if (localStorage.getItem('pass') !== null) {
      document.querySelector('#password').style.display = 'block';
      /*document.querySelector('#inppass').addEventListener('keyup', (e) => {
        if(e.key == 'Enter') core.checkPass();
        return false;
      }, false);*/
    }
  }, 90);
}, 4000);

document.addEventListener('DOMContentLoaded', function() {
  document.title = 'Running — nothing';
  core.clockTooltip = tippy(document.querySelector('#bar #clock'), { trigger: 'click', arrow: false });
  core.deviceTooltip = tippy(document.querySelector('#rightinfo #device'), { trigger: 'click', arrow: false, content: navigator.appVersion });
  core.fpsTooltip = tippy(document.querySelector('#bar #fps'), { trigger: 'click', arrow: false });
  core.networkTooltip = tippy(document.querySelector('#bar #network'), { trigger: 'click', arrow: false });
  core.powerOffBtnTooltip = tippy(document.querySelector('#power-off-button'), { trigger: 'click', interactive: true, appendTo: document.body, arrow: false, allowHTML: true, content: '<span onclick="core.powerOff();" style="background-color: #ff4242; color: white; width: 100%; border-radius: 8px; padding: 5px;">Power Off?</span>' });

  new Howl({
    src: ['sounds/startup.mp3']
  }).play();

  setTimeout(() => {
    core.sendNotif('Nothing', 'Welcome! We also recommend switching to a fresh new browser if you\'re using an old browser :)');
  }, 4001);

  if (localStorage.getItem('nothingwelcome') === null) {
    setTimeout(() => {
      core.openApp({ name: 'Welcome!', icon: 'images/nothing.png', file: 'welcome.html' });
      localStorage.setItem('nothingwelcome', 'ok');
    }, 90);
  }

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

  $(document).on('click', function(e) {
    if (core.rightinfo) {
      core.closr();
    }
  });

  // test


  setInterval(function() {
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let date = new Date();
    let minute = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
    let hour = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
    let year = date.getFullYear();
    let month = months[date.getMonth()];
    let day = date.getDate();
    let x = date.getHours() % 12;
    if (x == 0) x = 12;
    db.settings.get('timeformat', v => {
      if (v.val == '12') {
        document.querySelector('#clock').innerText = x + ':' + minute + (date.getHours() < 12 ? ' AM' : ' PM');
        document.querySelector('#rclck').innerText = x + ':' + minute + (date.getHours() < 12 ? ' AM' : ' PM');
        document.querySelector('#realOverlayClock').innerText = x + ':' + minute + (date.getHours() < 12 ? ' AM' : ' PM');
      } else {
        document.querySelector('#clock').innerText = hour + ':' + minute;
        document.querySelector('#rclck').innerText = hour + ':' + minute;
        document.querySelector('#realOverlayClock').innerText = hour + ':' + minute;
      }
    });
    if (date.getHours() != 0 && date.getHours() < 11 && date.getHours() > 3) {
      document.querySelector('#overlayGreeting').innerText = (core.stg.lang == 'en') ? 'Good morning!' : 'Nangāle!';
    } else if (date.getHours() > 10 && date.getHours() < 17) {
      document.querySelector('#overlayGreeting').innerText = (core.stg.lang == 'en') ? 'Good afternoon!' : 'Nammadhyāno(m)!';
    } else if (date.getHours() < 20 && date.getHours() > 16) {
      document.querySelector('#overlayGreeting').innerText = (core.stg.lang == 'en') ? 'Good evening!' : 'Nanjaendhro(m)!';
    } else if (date.getHours() != 0 && date.getHours() < 24 && date.getHours() > 19) {
      document.querySelector('#overlayGreeting').innerText = (core.stg.lang == 'en') ? 'Good night 🌃' : 'Nanrāthri 🌃';
    } else {
      document.querySelector('#overlayGreeting').innerText = (core.stg.lang == 'en') ? 'Dude it\'s midnight' : 'Dēi nadrāthri āwdhœ';
    }
    core.clockTooltip.setContent(hour + ':' + minute + ' | ' + month + ' ' + day + ', ' + year);
  }, 10);

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.querySelector('#device').innerHTML = '<i class="bx bx-mobile-alt"></i>';
  } else {
    document.querySelector('#device').innerHTML = '<i class="bx bx-laptop"></i>';
  }

  if (localStorage.getItem('apps') === null) {
    let aps = {
      CHEINSTTROARLY: {
        name: 'CHEINSTTROARLY',
        file: 'minusone.html',
        id: 'CHEINSTTROARLY',
        icon: 'images/minusone.png',
        nothinglang: false
      },
      wallpaperthing: {
        name: 'Desktop Wallpaper Settings',
        file: 'wallpaperthing.html',
        id: 'wallpaperthing',
        icon: 'images/wpthingicon.png',
        nothinglang: false
      },
      oof: {
        name: 'Endless OOF',
        file: 'oof.html',
        id: 'oof',
        icon: 'images/oof.png',
        nothinglang: false
      },
      terminal: {
        name: 'Terminal (Beta)',
        file: 'uselessterminal.html',
        id: 'terminal',
        icon: 'images/terminal.png'
      },
      settings: {
        name: 'Settings',
        file: 'settings.html',
        id: 'settings',
        icon: 'images/settings.png'
      }
    }
    localStorage.setItem('apps', JSON.stringify(aps));
    let ia = JSON.parse(localStorage.getItem('apps'));
    for (let l = 0; l < Object.keys(ia).length; l++) {
      (ia[Object.keys(ia)[l]]);
    }
    document.querySelector('#sapp').oninput = filt;
  } else {
    let ia = JSON.parse(localStorage.getItem('apps'));
    if (!('CHEINSTTROARLY' in ia)) {
      ia.CHEINSTTROARLY = {
        name: 'CHEINSTTROARLY',
        file: 'minusone.html',
        id: 'CHEINSTTROARLY',
        nothinglang: false,
        icon: 'images/minusone.png'
      };
      localStorage.setItem('apps', JSON.stringify(ia));
    }
    if (!('settings' in ia)) {
      ia.settings = {
        name: 'Settings',
        file: 'settings.html',
        id: 'settings',
        nothinglang: false,
        icon: 'images/settings.png'
      };
      localStorage.setItem('apps', JSON.stringify(ia));
    }
    if (!('terminal' in ia)) {
      ia.terminal = {
        name: 'Terminal (Beta)',
        file: 'uselessterminal.html',
        id: 'terminal',
        icon: 'images/terminal.png'
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
        icon: 'images/oof.png',
        nothinglang: false
      }
      localStorage.setItem('apps', JSON.stringify(ia));
    }
    Object.keys(ia).forEach(function(key) {
      core.apps(ia[key]);
    });
  }
  document.querySelector('#sapp').oninput = filt;
});

document.addEventListener('keyup', function(event) {
  event.preventDefault();
  if (event.metaKey) {
    if (core.homeOpen) {
      core.closeHome();
    } else {
      core.openHome();
    }
  } else if (event.keyCode == 17 && event.keyCode == 18 && event.keyCode == 72) {
    document.querySelectorAll('.window').forEach((v) => {
      core.hideWindow(v);
    });
  }
});

function filt() {
  let txtValue;
  for (let i = 0; i < document.querySelectorAll('.app').length; i++) {
    txtValue = document.querySelectorAll('.app')[i].getAttribute('data-name').toUpperCase();
    if (txtValue.toUpperCase().indexOf(document.querySelector('#sapp').value.toUpperCase()) > -1) {
      document.querySelectorAll('.app')[i].style.display = "";
    } else {
      document.querySelectorAll('.app')[i].style.display = "none";
    }
  }
}