
    var t;
    var g;
    window.addEventListener('message', (e) => {
      g = e.ports[0];
      switch (e.data.name) {
        case 'darkmode':
          t.dm(e.data.res);
          break;
        case 'permdenied':
            t.ex();
          break;
        default:
          ok();
      }
    });

    function ok() {
      var port2 = g;
      t = {
        dm: function(d) {
          if (d == 'true') {
            document.body.style.backgroundColor = '#212121';
            document.body.style.color = 'white';
            document.querySelector('#dm').checked = true;
          } else {
            document.body.style.backgroundColor = 'white';
            document.body.style.color = 'black';
            document.querySelector('#dm').checked = false;
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
          port2.postMessage({ name: 'getdarkmode' });
        }
      };
      
      document.querySelector('#wp').onclick = () => {
        port2.postMessage({name: 'openapp', value: 'wallpaperthing'});
      }

      document.querySelector('#dm').addEventListener('change', t.dmh);
      port2.postMessage({ name: 'getdarkmode' });
    }