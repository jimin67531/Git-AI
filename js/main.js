(function () {
  var root = document.documentElement;

  // 테마: 저장된 값이 있으면 적용
  function readTheme() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }
  function saveTheme(value) {
    try { localStorage.setItem('theme', value); } catch (e) { /* 저장 실패는 무시 */ }
  }

  var saved = readTheme();
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);

  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      saveTheme(next);
    });
  }

  // 필터와 정렬
  var list = document.querySelector('.planet-list');
  var controls = document.querySelector('.controls');
  if (!list || !controls) return;

  var planets = Array.prototype.slice.call(list.querySelectorAll('.planet'));
  var buttons = controls.querySelectorAll('[data-filter]');
  var sortSelect = document.getElementById('sort');
  var countText = document.querySelector('.result-count');
  controls.hidden = false;

  function applyFilter(type) {
    var shown = 0;
    planets.forEach(function (planet) {
      var match = type === 'all' || planet.dataset.type === type;
      planet.hidden = !match;
      if (match) shown++;
    });
    countText.textContent = type === 'all' ? '' : '행성 ' + shown + '개를 보여 줍니다.';
  }

  function applySort(key) {
    planets
      .slice()
      .sort(function (a, b) {
        var av = Number(a.dataset[key]);
        var bv = Number(b.dataset[key]);
        return key === 'diameter' ? bv - av : av - bv;
      })
      .forEach(function (planet) { list.appendChild(planet); });
  }

  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener('click', function () {
      Array.prototype.forEach.call(buttons, function (b) {
        b.setAttribute('aria-pressed', String(b === button));
      });
      applyFilter(button.dataset.filter);
    });
  });

  sortSelect.addEventListener('change', function () {
    applySort(sortSelect.value);
  });
})();
