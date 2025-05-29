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

