document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
      let mouseX = 0, mouseY = 0, ticking = false;
      document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!ticking) {
          requestAnimationFrame(() => {
            cursor.style.left = mouseX + 'px';
            cursor.style.top  = mouseY + 'px';
            ticking = false;
          });
          ticking = true;
        }
      });
      document.querySelectorAll('.js-invert-trigger, .headline, .author .name, .menu-dots')
        .forEach(el => {
          el.addEventListener('mouseenter', () => cursor.classList.add('invert'));
          el.addEventListener('mouseleave', () => cursor.classList.remove('invert'));
        });
    }
  
    const sections = Array.from(document.querySelectorAll('section'));
    const dots     = document.querySelectorAll('.menu-dots span');
  
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target);
            dots.forEach((d,i) => d.classList.toggle('active', i === idx));
          }
        });
      }, { threshold: 0.5 });
  
      sections.forEach(sec => io.observe(sec));
    } else {
      // Fallback
      const onScroll = () => {
        const mid = window.scrollY + window.innerHeight/2;
        sections.forEach((sec,i) => {
          if (mid >= sec.offsetTop && mid < sec.offsetTop + sec.offsetHeight) {
            dots.forEach(d => d.classList.remove('active'));
            dots[i]?.classList.add('active');
          }
        });
      };
      window.addEventListener('scroll', onScroll);
      onScroll();
    }
  
    window.addEventListener('wheel', e => {
      e.preventDefault(); 
      const delta = e.deltaY;
      const currIndex = sections.findIndex(sec => {
        const r = sec.getBoundingClientRect();
        return r.top >= -window.innerHeight/2 && r.top < window.innerHeight/2;
      });
  
      let targetIndex = currIndex;
      if (delta > 0 && currIndex < sections.length - 1) targetIndex++;
      if (delta < 0 && currIndex > 0)                  targetIndex--;
  
      if (targetIndex !== currIndex) {
        sections[targetIndex].scrollIntoView({ behavior: 'smooth' });
        dots.forEach((d,i) => d.classList.toggle('active', i === targetIndex));
      }
    }, { passive: false });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const bento = document.getElementById('bento');
  
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          bento.classList.add('in-view');
          obs.unobserve(bento);
        }
      });
    }, { threshold: 0.2 });
  
    observer.observe(bento);
  });

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('bento');
    const boxes     = Array.from(container.querySelectorAll('.bento-box'));
    const MOVE      = 15;
  
    boxes.forEach(box => {
      box.addEventListener('mouseenter', () => {
        const br = box.getBoundingClientRect();
        const cx = br.left + br.width/2;
        const cy = br.top  + br.height/2;
  
        boxes.forEach(other => {
          if (other === box) {
            other.classList.add('hovered');
            other.style.transform = '';
          } else {
            const or = other.getBoundingClientRect();
            const ox = or.left + or.width/2;
            const oy = or.top  + or.height/2;
  
            let dx = ox - cx;
            let dy = oy - cy;
            const dist = Math.hypot(dx, dy) || 1;
            dx = (dx / dist) * MOVE;
            dy = (dy / dist) * MOVE;
  
            other.style.transform = `translate(${dx}px, ${dy}px)`;
          }
        });
      });
  
      box.addEventListener('mouseleave', () => {
        // alles zurücksetzen
        boxes.forEach(b => {
          b.classList.remove('hovered');
          b.style.transform = '';
        });
      });
    });
  });

  
  function updateBerlinClock() {
    const now = new Date();
    // Deutsche Zeit holen
    const [h, m, s] = new Intl.DateTimeFormat('de-DE', {
      timeZone: 'Europe/Berlin',
      hour12: false,
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(now).split(':').map(Number);
  
    // Winkel berechnen
    const hourAngle   = (h % 12) * 30 + m * 0.5;
    const minuteAngle = m * 6   + s * 0.1;
    const secondAngle = s * 6;
  
    const root = document.querySelector('.bento-box.custom-watch');
    if (!root) return;
    const clk = root.querySelector('.clock');
    clk.querySelector('.hand.hour')  .style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
    clk.querySelector('.hand.minute').style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
    clk.querySelector('.hand.second').style.transform = `translateX(-50%) rotate(${secondAngle}deg)`;
  
    // Digitale Zeit
    const digital = root.querySelector('.digital-time');
    const pad = n => String(n).padStart(2,'0');
    digital.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    updateBerlinClock();
    setInterval(updateBerlinClock, 1000);
  });
  



document.addEventListener('DOMContentLoaded', () => {
  const box      = document.querySelector('.bento-box.weather');
  const locEl    = box.querySelector('.weather__location');
  const iconEl   = box.querySelector('.weather__icon');
  const tempEl   = box.querySelector('.weather__temp');
  const descEl   = box.querySelector('.weather__desc');

  // ganz oben im script.js, wo du weatherMap definierst:
const weatherMap = {
  0:  ['☀️','clear sky'],
  1:  ['🌤️','mainly clear'],
  2:  ['⛅️','partly cloudy'],
  3:  ['☁️','overcast'],
  45: ['🌫️','fog'],
  48: ['🌫️','depositing rime fog'],
  51: ['🌦️','light drizzle'],
  53: ['🌧️','moderate drizzle'],
  55: ['🌧️','dense drizzle'],
  56: ['🌧️','light freezing drizzle'],
  57: ['🌧️','dense freezing drizzle'],
  61: ['🌧️','light rain'],
  63: ['🌧️','moderate rain'],
  65: ['🌧️','heavy rain'],
  66: ['🌧️','light freezing rain'],       // neu
  67: ['🌧️','heavy freezing rain'],      // neu
  71: ['🌨️','light snow'],
  73: ['🌨️','moderate snow'],
  75: ['🌨️','heavy snow'],
  77: ['🌨️','snow grains'],              // neu
  80: ['🌧️','rain showers'],
  81: ['🌧️','moderate showers'],
  82: ['🌧️','violent showers'],
  85: ['🌨️','light snow showers'],       // neu
  86: ['🌨️','heavy snow showers'],       // neu
  95: ['⛈️','thunderstorm'],
  96: ['⛈️','thunderstorm w/ hail'],
  99: ['⛈️','thunderstorm w/ heavy hail']
};

  function showError(msg) {
    box.classList.add('error');
    locEl.textContent = msg;
    iconEl.textContent = '⚠️';
    tempEl.textContent = '--°C';
    descEl.textContent = '';
  }

  if (!navigator.geolocation) {
    return showError('Geolocation unsupported');
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude: lat, longitude: lon } }) => {

      // 1) Reverse-Geocode über Nominatim (ohne API-Key)
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`)
        .then(r => r.ok ? r.json() : Promise.reject(`Geo HTTP ${r.status}`))
        .then(data => {
          const addr = data.address;
          // city oder town oder village oder fallbacks
          const city = addr.city || addr.town || addr.village || addr.county || addr.state;
          locEl.textContent = city || data.display_name || 'Unknown';
        })
        .catch(err => {
          console.warn('Reverse geocode failed:', err);
          locEl.textContent = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
        });

      // 2) Wetterdaten holen
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=Europe%2FBerlin`)
        .then(r => r.ok ? r.json() : Promise.reject(`Weather HTTP ${r.status}`))
        .then(data => {
          const cw = data.current_weather;
          const [ico, txt] = weatherMap[cw.weathercode] || ['❔','unknown'];
          iconEl.textContent = ico;
          tempEl.textContent = `${Math.round(cw.temperature)}°C`;
          descEl.textContent = txt;
        })
        .catch(err => {
          console.error('Weather fetch failed:', err);
          showError('Weather error');
        });
    },
    err => {
      console.error('Geolocation error:', err);
      showError('Location denied');
    }
  );
});




document.addEventListener('DOMContentLoaded', () => {
  const iconEl  = document.querySelector('.battery__icon');
  const levelEl = document.querySelector('.battery__level');

  // Fallback, falls nicht unterstützt
  if (!navigator.getBattery) {
    iconEl.textContent  = '❔';
    levelEl.textContent = 'n/a';
    return;
  }

  navigator.getBattery().then(battery => {
    function update() {
      const pct = Math.round(battery.level * 100);
      levelEl.textContent = pct + '%';
      iconEl.textContent  = battery.charging ? '⚡️' : '🔋';
    }

    // initial und bei Änderungen updaten
    update();
    battery.addEventListener('levelchange', update);
    battery.addEventListener('chargingchange', update);
  }).catch(err => {
    console.error('Battery API error:', err);
    iconEl.textContent  = '❓';
    levelEl.textContent = 'err';
  });
});





document.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById('med-map');

  if (!navigator.geolocation) {
    // Fallback: Weltkarte
    iframe.src = 'https://www.openstreetmap.org/export/embed.html?bbox=-180,-90,180,90&layer=mapnik';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude: lat, longitude: lon } }) => {
      const zoom = 14;  // Stadtviertel-Ansicht
      const lat6 = lat.toFixed(6);
      const lon6 = lon.toFixed(6);
      // OSM-Embed zentriert mit Marker
      iframe.src =
        `https://www.openstreetmap.org/export/embed.html` +
        `?layer=mapnik` +
        `&map=${zoom}/${lat6}/${lon6}` +
        `&marker=${lat6},${lon6}`;
    },
    err => {
      console.error('Geolocation error:', err);
      // Fallback: Weltkarte
      iframe.src = 'https://www.openstreetmap.org/export/embed.html?bbox=-180,-90,180,90&layer=mapnik';
    }
  );
});






document.addEventListener('DOMContentLoaded', () => {
  const ids = ['bitcoin','ethereum','solana','ripple'];
  const vs  = 'eur';
  const url = `https://api.coingecko.com/api/v3/simple/price`
            + `?ids=${ids.join(',')}`
            + `&vs_currencies=${vs}`
            + `&include_24hr_change=true`;

  fetch(url)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => {
      ids.forEach(id => {
        const item   = document.querySelector(`.crypto__item[data-id="${id}"]`);
        const price  = data[id][vs];
        const change = data[id][`${vs}_24h_change`];

        // Preis in € formatieren
        item.querySelector('.crypto__price').textContent =
          price.toLocaleString('de-DE', { style:'currency', currency:'EUR' });

        // Change formatieren und Farbstil setzen
        const chEl = item.querySelector('.crypto__change');
        const sign = change >= 0 ? '+' : '';
        chEl.textContent = `${sign}${change.toFixed(2)}%`;
        chEl.classList.toggle('up', change >= 0);
        chEl.classList.toggle('down', change < 0);
      });
    })
    .catch(err => {
      console.error('Crypto fetch error:', err);
      document.querySelectorAll('.crypto__price')
              .forEach(el => el.textContent = '–');
    });
});




document.addEventListener('DOMContentLoaded', () => {
  const listEl  = document.querySelector('.bento-box.skills.news .news__list');
  const proxy   = 'https://api.allorigins.win/get?url=';
  const feedUrl = encodeURIComponent('https://www.tagesschau.de/xml/rss2/');

  fetch(proxy + feedUrl)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      // data.contents enthält das XML als String
      const parser = new DOMParser();
      const xml    = parser.parseFromString(data.contents, 'text/xml');
      const items  = Array.from(xml.querySelectorAll('item')).slice(0, 4);

      if (items.length === 0) {
        throw new Error('No items in feed');
      }

      listEl.innerHTML = '';
      items.forEach(item => {
        const title = item.querySelector('title')?.textContent.trim() || 'No title';
        const link  = item.querySelector('link')?.textContent.trim()  || '#';
        const li    = document.createElement('li');
        li.className = 'news__item';
        li.innerHTML = `<a href="${link}" target="_blank" rel="noopener">${title}</a>`;
        listEl.appendChild(li);
      });
    })
    .catch(err => {
      console.error('RSS fetch error:', err);
      listEl.innerHTML = '<li class="news__item">Unable to load RSS news.</li>';
    });
});



// Debounce-Helfer
function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const editor  = document.getElementById('playground-editor');
  const preview = document.getElementById('playground-preview');

  // 1) Beispiel-Code
  const initialCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { margin:0; padding:1rem; font-family:sans-serif; background:#f5f5f5; }
    h1 { color:#4FACFE; }
  </style>
</head>
<body>
  <h1>Live Preview</h1>
  <p>Change the Code</p>
</body>
</html>`;

  editor.value = initialCode;

  // 2) Update-Funktion
  const updatePreview = () => {
    preview.srcdoc = editor.value;
  };

  // 3) Debounced auf Input
  editor.addEventListener('input', debounce(updatePreview, 300));

  // 4) Initiales Rendern
  updatePreview();
});
