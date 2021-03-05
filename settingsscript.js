
    var t;
    var g;
    window.addEventListener('message', (e) => {
      g = e.ports[0];
      switch (e.data.name) {
        case 'settings':
          t.dm(e.data.value);
          break;
        case 'permdenied':
            t.ex();
          break;
        case 'windowfocused':
          break;
        case 'ready':
          break;
        case 'expand':
          break;
        case 'collapse':
          break;
        default:
          ok();
      }
    });

    function ok() {
      var port2 = g;
      t = {
        dm: function(d) {
          if (d.darkmode == 'true') {
            document.body.style.backgroundColor = '#212121';
            document.body.style.color = 'white';
            document.querySelector('#dm').checked = true;
          } else {
            document.body.style.backgroundColor = 'white';
            document.body.style.color = 'black';
            document.querySelector('#dm').checked = false;
          }
          document.querySelector('#timef').value = d.timeformat;
          if(d.language == 'en') {
            document.querySelector('#langf').value = 'english';
          } else {
            document.querySelector('#langf').value = 'undardese';
          }
        },
        dmh: function() {
          if (document.querySelector('#dm').checked) {
            port2.postMessage({ name: 'settings', sets: 'theme', value: 'true' });
          } else {
            port2.postMessage({ name: 'settings', sets: 'theme', value: 'false' });
          }
        },
        ex: function() {
          port2.postMessage({ name: 'getsettings' });
          port2.postMessage({ name: 'sendnotification', title: 'Permission Error — Settings', content: 'Permission denied :('});
        },
        tf: function() {
          port2.postMessage({ name: 'settings', sets: 'timeformat', value: document.querySelector('#timef').value });
        },
        lng: function() {
          port2.postMessage({ name: 'settings', sets: 'language', value: document.querySelector('#langf').value });
        }
      };
      
      document.querySelector('#langf').onchange = t.lng;
      
      document.querySelector('#wp').onclick = () => {
        port2.postMessage({name: 'openapp', value: 'wallpaperthing'});
      }
      
      document.querySelector('#timef').onchange = t.tf;

      document.querySelector('#dm').addEventListener('change', t.dmh);
      port2.postMessage({ name: 'getsettings' });
    }