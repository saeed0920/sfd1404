(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    // navbar
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var isOpen = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    // faq
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        q.parentElement.classList.toggle('open');
      });
    });

    // attendees



    const attendeesSection = document.querySelector('.attendees-section');
    if (attendeesSection) {
      const container = attendeesSection.querySelector('.attendees-container');
      const apiUrl = 'https://api.evand.com/events/birjandlug-sfd1404/attendees/public?per_page=100';
      fetch(apiUrl)
        .then(res => res.json())
        .then(body => {
          const attendees = body.data;
          console.log("Total attendees:", attendees.length);
          const MAX_VISIBLE = 32;
          attendees.reverse().forEach((attendee, index) => {
            const div = document.createElement('div');
            div.className = 'attendee';
            div.setAttribute('data-name', `${attendee.first_name} ${attendee.last_name || ''}`);
            const img = document.createElement('img');
            img.src = `https://gravatar.com/avatar/${attendee.email_md5}?s=60&d=retro`;
            img.alt = `${attendee.first_name} ${attendee.last_name || ''}`;
            div.appendChild(img);

            if (index >= MAX_VISIBLE) {
              div.classList.add('hidden');
            }
            container.appendChild(div);
          });

          if (attendees.length > MAX_VISIBLE) {
            let expanded = false;
            const hiddenCount = attendees.length - MAX_VISIBLE;

            const btn = document.createElement('button');
            btn.textContent = `+${hiddenCount} نفر دیگر`;
            btn.className = 'show-more-btn';

            btn.addEventListener('click', () => {
              expanded = !expanded;
              const allAttendees = container.querySelectorAll('.attendee');
              allAttendees.forEach((el, i) => {
                if (i >= MAX_VISIBLE) {
                  if (expanded) {
                    el.classList.remove('hidden');
                  } else {
                    el.classList.add('hidden');
                  }
                }
              });
              btn.textContent = expanded ? `${attendees.length} نفر شرکت کرده‌اند` : `${hiddenCount}+ نفر دیگه`;
            });
            attendeesSection.appendChild(btn);
          }
        })
        .catch(err => {
          container.innerHTML = '<p>خطا در بارگذاری.</p>';
        });
    }



    // countdown
    const countdownEl = document.querySelector('.countdown-bar');
    if (!countdownEl) return;
    const targetDate = new Date(countdownEl.getAttribute('data-target-date'));
    const liveBadge = document.getElementById('liveBadge');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function padFa(n) {
      return n.toLocaleString('fa-IR', { minimumIntegerDigits: 2 });
    }

    function updateCountdown() {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        document.getElementById('timer').style.display = 'none';
        liveBadge.style.display = 'flex';
        return;
      }

      const d = Math.floor(diff / 864e5);
      const h = Math.floor(diff / 36e5) % 24;
      const m = Math.floor(diff / 6e4) % 60;
      const s = Math.floor(diff / 1e3) % 60;

      daysEl.textContent = padFa(d);
      hoursEl.textContent = padFa(h);
      minutesEl.textContent = padFa(m);
      secondsEl.textContent = padFa(s);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  });
})();

function copyToClipboard(el) {
  const text = el.getAttribute('data-copy');
  navigator.clipboard.writeText(text).then(() => {
    alert('کپی شد!');
  });
}
