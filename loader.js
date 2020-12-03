async function loadApp(ur) {
  var res = await fetch(ur);
      var g = await res.json();
      var b = [];
      if('config' in g && 'scripts' in g.config) {
        g.config.scripts.forEach((v) => {
          var m = document.createElement('script');
          m.src = v;
          document.head.appendChild(m);
        })
      }
      g.elements.forEach((v) => {
        switch(v.element) {
          case 'button':
            var s = document.createElement('button');
            s.innerHTML = v.text;
            if('onclick' in v) {
              s.addEventListener('click', () => { eval(v.onclick) });
            }
            b.push(s);
        }
      });
      return b;
}