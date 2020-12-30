
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
        },
        dmh: function() {
          if (document.querySelector('#dm').checked) {
            port2.postMessage({ name: 'settings', sets: 'theme', value: 'true' });
          } else {
            port2.postMessage({ name: 'settings', sets: 'theme', value: 'false' });
          }
        },
        ex: function() {
          port2.postMessage({ name: 'getdarkmode' });
          port2.postMessage({ name: 'sendnotification', title: 'Permission Error — Settings', content: 'Permission denied :('});
        },
        tf: function() {
          port2.postMessage({ name: 'settings', sets: 'timeformat', value: document.querySelector('#timef').value });
        }
      };
      
      document.querySelector('#wp').onclick = () => {
        port2.postMessage({name: 'openapp', value: 'wallpaperthing'});
      }
      
      document.querySelector('#timef').onchange = t.tf;
      
      document.querySelector('#pass').addEventListener('keyup', (e) => {
        if(e.keyCode == 13) {
          if(document.querySelector('#pass').value.length < 8) {
            alert('❌ You need to enter at least 8 characters!');
            return;
          }
          port2.postMessage({ name: 'settings', sets: 'password', value: document.querySelector('#pass').value });
        }
      })

      document.querySelector('#dm').addEventListener('change', t.dmh);
      port2.postMessage({ name: 'getsettings' });
    }