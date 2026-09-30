const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const accountBtn = document.querySelector('#account-btn');
const loginModal = document.querySelector('#login-modal');
const closeModal = document.querySelector('#close-modal');
const loginForm = document.querySelector('#login-form');
const loginStatus = document.querySelector('#login-status');
const userName = document.querySelector('#user-name');
const accountPanel = document.querySelector('#account-panel');
const logoutBtn = document.querySelector('#logout-btn');
const bagStatus = document.querySelector('#bag-status');
const bagLocation = document.querySelector('#bag-location');
const bagUpdated = document.querySelector('#bag-updated');
const bagBattery = document.querySelector('#bag-battery');
const bagConnection = document.querySelector('#bag-connection');
const refreshBag = document.querySelector('#refresh-bag');
const mapLocationName = document.querySelector('#map-location-name');
const mapLocationMeta = document.querySelector('#map-location-meta');
const mapChipMarker = document.querySelector('#map-chip-marker');
const themeToggle = document.querySelector('#theme-toggle');
const notificationDot = document.querySelector('#notification-dot');
const notificationBox = document.querySelector('#notification-box');
const destinationModal = document.querySelector('#destination-modal');
const destinationTitle = document.querySelector('#destination-title');
const destinationInfo = document.querySelector('#destination-info');
const closeDestination = document.querySelector('#close-destination');
const profileName = document.querySelector('#profile-name');
const profileEmail = document.querySelector('#profile-email');
const recommendedCompany = document.querySelector('#recommended-company');
const recommendedReason = document.querySelector('#recommended-reason');
const mostUsedCompany = document.querySelector('#most-used-company');
const companyUsage = document.querySelector('#company-usage');
const companyHistoryList = document.querySelector('#company-history-list');
const tripCompanyName = document.querySelector('#trip-company-name');
const tripCompanyReason = document.querySelector('#trip-company-reason');
const selectCompany = document.querySelector('#select-company');
const accountSectionBtn = document.querySelector('#account-section-btn');
const accountNameCard = document.querySelector('#account-name-card');
const accountEmailCard = document.querySelector('#account-email-card');

const openNav = () => nav?.classList.toggle('open');
toggle?.addEventListener('click', openNav);
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => nav?.classList.remove('open')));

// Alternância entre tema claro e noturno. A escolha fica salva no navegador.
function applyTheme(theme) {
  const dark = theme === 'dark';
  document.body.classList.toggle('dark-mode', dark);
  if (themeToggle) {
    themeToggle.textContent = dark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo noturno');
    themeToggle.title = dark ? 'Modo claro' : 'Modo noturno';
  }
}
const savedTheme = localStorage.getItem('gj_theme') || 'light';
applyTheme(savedTheme);
themeToggle?.addEventListener('click', () => {
  const next = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
  localStorage.setItem('gj_theme', next);
  applyTheme(next);
});

function goHome(e) {
  e?.preventDefault();
  nav?.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.querySelector('.brand')?.addEventListener('click', goHome);
document.querySelector('.nav a[href="#inicio"]')?.addEventListener('click', goHome);
document.querySelector('.footer-brand')?.addEventListener('click', goHome);
accountSectionBtn?.addEventListener('click', () => showModal(loginModal));

document.querySelectorAll('.reveal').forEach(el => {
  if (!('IntersectionObserver' in window)) { el.classList.add('visible'); return; }
});
const observer = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(e => observer.observe(e));

function showModal(modal) { modal?.classList.add('show'); document.body.classList.add('modal-open'); }
function hideModal(modal) { modal?.classList.remove('show'); if (!document.querySelector('.modal.show')) document.body.classList.remove('modal-open'); }

accountBtn?.addEventListener('click', () => {
  const saved = localStorage.getItem('gj_user');
  if (saved) {
    const user = JSON.parse(saved);
    if (userName) userName.textContent = user.name;
    accountPanel?.classList.add('logged');
  }
  showModal(loginModal);
});
closeModal?.addEventListener('click', () => hideModal(loginModal));
loginModal?.addEventListener('click', e => { if (e.target === loginModal) hideModal(loginModal); });

loginForm?.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.querySelector('#login-name').value.trim() || 'Viajante';
  const email = document.querySelector('#login-email').value.trim();
  if (!email) return;
  const user = { name, email, lastLogin: new Date().toISOString() };
  localStorage.setItem('gj_user', JSON.stringify(user));
  if (userName) userName.textContent = name;
  if (accountPanel) accountPanel.classList.add('logged');
  updateProfile(user);
  loginStatus.textContent = `Olá, ${name}! Sua conta de demonstração está ativa.`;
  sendWelcomeEmail(user);
  setTimeout(() => hideModal(loginModal), 900);
});

logoutBtn?.addEventListener('click', () => {
  localStorage.removeItem('gj_user');
  accountPanel?.classList.remove('logged');
  if (accountNameCard) accountNameCard.textContent = 'Viajante';
  if (accountEmailCard) accountEmailCard.textContent = 'Faça login para visualizar seus dados.';
  loginStatus.textContent = 'Você saiu da conta.';
});

function updateBagMap(location, stateIndex) {
  if (mapLocationName) mapLocationName.textContent = location;
  if (mapLocationMeta) mapLocationMeta.textContent = '📍 Última localização registrada · agora';
  if (mapChipMarker) {
    const transforms = ['translate(0 0)', 'translate(140 63)', 'translate(317 -81)'];
    mapChipMarker.setAttribute('transform', transforms[stateIndex] || transforms[0]);
  }
}

updateBagMap('Aeroporto de Lisboa', 0);

refreshBag?.addEventListener('click', () => {
  const states = [
    ['Em trânsito', 'Aeroporto de Lisboa', 'Agora', '92%', 'Estável'],
    ['No aeroporto', 'Aeroporto de Madrid', 'Há 1 min', '91%', 'Estável'],
    ['Em trânsito', 'Aeroporto de Paris', 'Agora', '90%', 'Estável']
  ];
  const stateIndex = Math.floor(Math.random() * states.length);
  const state = states[stateIndex];
  if (bagStatus) bagStatus.textContent = state[0];
  if (bagLocation) bagLocation.textContent = state[1];
  updateBagMap(state[1], stateIndex);
  if (bagUpdated) bagUpdated.textContent = state[2];
  if (bagBattery) bagBattery.textContent = state[3];
  if (bagConnection) bagConnection.textContent = state[4];
  refreshBag.textContent = '✓ Atualizado';
  setTimeout(() => refreshBag.textContent = 'Atualizar localização', 1500);
});

notificationBox?.addEventListener('click', () => {
  notificationBox.classList.toggle('expanded');
  notificationDot?.classList.remove('active');
});


const companyByDestination = {
  Paris: { name:'Air France', reason:'Companhia francesa com ampla conectividade para Paris.' },
  'Nova York': { name:'American Airlines', reason:'Opção demonstrativa para conexões com Nova York.' },
  Londres: { name:'British Airways', reason:'Companhia britânica com forte presença em Londres.' },
  Tóquio: { name:'Japan Airlines', reason:'Companhia japonesa para uma viagem com destino a Tóquio.' },
  Dubai: { name:'Emirates', reason:'Companhia sediada em Dubai, adequada ao destino selecionado.' },
  Roma: { name:'ITA Airways', reason:'Companhia italiana com conexão para Roma.' }
};

function getCompanyHistory(){
  try { return JSON.parse(localStorage.getItem('gj_company_history') || '{}'); } catch (_) { return {}; }
}
function saveCompanyUse(company){
  const history = getCompanyHistory();
  history[company] = (history[company] || 0) + 1;
  localStorage.setItem('gj_company_history', JSON.stringify(history));
  renderCompanyProfile();
}
function renderCompanyProfile(){
  const history = getCompanyHistory();
  const entries = Object.entries(history).sort((a,b)=>b[1]-a[1]);
  if (mostUsedCompany) mostUsedCompany.textContent = entries[0]?.[0] || 'Ainda não há histórico';
  if (companyUsage) companyUsage.textContent = entries[0] ? `${entries[0][1]} seleção(ões) registrada(s)` : 'Escolha uma empresa para criar seu histórico.';
  if (companyHistoryList) companyHistoryList.innerHTML = entries.length ? entries.slice(0,5).map(([name,count]) => `<div class="company-history-item"><strong>${name}</strong><small>${count} uso(s)</small></div>`).join('') : '<div class="company-history-item"><strong>Sem histórico</strong><small>Comece uma viagem</small></div>';
}
function updateRecommendedCompany(destination){
  const company = companyByDestination[destination];
  if (!company) return;
  if (recommendedCompany) recommendedCompany.textContent = company.name;
  if (recommendedReason) recommendedReason.textContent = company.reason;
  if (tripCompanyName) tripCompanyName.textContent = company.name;
  if (tripCompanyReason) tripCompanyReason.textContent = company.reason;
}
function updateProfile(user){
  if (!user) return;
  if (profileName) profileName.textContent = user.name || 'Viajante';
  if (profileEmail) profileEmail.textContent = user.email || 'E-mail não informado';
  if (accountNameCard) accountNameCard.textContent = user.name || 'Viajante';
  if (accountEmailCard) accountEmailCard.textContent = user.email || 'E-mail não informado';
  updateRecommendedCompany(tripDestination?.value || 'Paris');
  renderCompanyProfile();
}
async function sendWelcomeEmail(user){
  try {
    const response = await fetch('/api/welcome-email', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(user) });
    if (!response.ok) throw new Error('email service unavailable');
    loginStatus.textContent = `Olá, ${user.name}! Sua conta está ativa e o e-mail de boas-vindas foi enviado.`;
  } catch (_) {
    loginStatus.textContent = `Olá, ${user.name}! Sua conta de demonstração está ativa.`;
  }
}

const destinationData = {
  Paris: 'França · Euro (€) · Francês · Torre Eiffel, Louvre e Arco do Triunfo.',
  'Nova York': 'Estados Unidos · Dólar (US$) · Inglês · Times Square, Central Park e Brooklyn Bridge.',
  Londres: 'Reino Unido · Libra (£) · Inglês · Big Ben, Tower Bridge e British Museum.',
  Tóquio: 'Japão · Iene (¥) · Japonês · Shibuya, Asakusa e Tokyo Skytree.',
  Dubai: 'Emirados Árabes Unidos · Dirham (AED) · Árabe · Burj Khalifa, Dubai Marina e Palm Jumeirah.',
  Roma: 'Itália · Euro (€) · Italiano · Coliseu, Vaticano e Fontana di Trevi.'
};

document.querySelectorAll('.dest').forEach(card => card.addEventListener('click', () => {
  const city = card.querySelector('h3')?.textContent;
  if (!city) return;
  if (destinationTitle) destinationTitle.textContent = city;
  if (destinationInfo) destinationInfo.textContent = destinationData[city] || 'Informações do destino disponíveis para sua próxima viagem.';
  showModal(destinationModal);
}));
closeDestination?.addEventListener('click', () => hideModal(destinationModal));
destinationModal?.addEventListener('click', e => { if (e.target === destinationModal) hideModal(destinationModal); });

document.querySelectorAll('[data-target]').forEach(button => button.addEventListener('click', e => {
  e.preventDefault();
  document.querySelector(button.dataset.target)?.scrollIntoView({ behavior: 'smooth' });
}));

if (localStorage.getItem('gj_user')) accountPanel?.classList.add('logged');
notificationDot?.classList.add('active');


const tripData = {
  'Paris': {
    flightPrice: 4890,
    airport: 'Aeroporto Charles de Gaulle (CDG)',
    tip: 'Rota de exemplo: desembarque → controle de passaporte → retirada de bagagem → saída/transportes.',
    route: ['Desembarque', 'Controle de passaporte', 'Retirada da bagagem', 'Saída / Transportes'],
    hotels: [
      ['Pullman Paris Tour Eiffel', 'Próximo à Torre Eiffel', 'Hotel de referência para quem quer ficar perto dos principais pontos.', 980],
      ['Novotel Paris Centre Tour Eiffel', '15º arrondissement', 'Opção prática para uma estadia urbana e acesso ao transporte.', 760],
      ['ibis Paris Tour Eiffel Cambronne 15ème', '15º arrondissement', 'Alternativa conhecida para uma estadia simples e bem localizada.', 520]
    ]
  },
  'Nova York': {
    flightPrice: 4290,
    airport: 'John F. Kennedy International Airport (JFK)',
    tip: 'Rota de exemplo: terminal → segurança → área de embarque → portão. Confira o terminal no cartão de embarque.',
    route: ['Terminal', 'Check-in', 'Segurança', 'Portão de embarque'],
    hotels: [
      ['The New Yorker, A Wyndham Hotel', 'Manhattan', 'Hotel tradicional em localização central para explorar a cidade.', 890],
      ['Moxy NYC Times Square', 'Midtown Manhattan', 'Opção moderna próxima a atrações e transporte.', 780],
      ['Pod Times Square', 'Times Square', 'Alternativa compacta para quem quer ficar perto de Manhattan.', 620]
    ]
  },
  'Londres': {
    flightPrice: 4650,
    airport: 'Heathrow Airport (LHR)',
    tip: 'Rota de exemplo: desembarque → imigração → bagagem → saída. O terminal depende da companhia aérea.',
    route: ['Desembarque', 'Imigração', 'Bagagem', 'Saída / Transportes'],
    hotels: [
      ['The Tower Hotel', 'Tower Hill', 'Boa referência para quem quer ficar próximo à Tower Bridge.', 820],
      ['Premier Inn London County Hall', 'South Bank', 'Opção prática para conhecer atrações centrais a pé.', 690],
      ['Park Plaza Westminster Bridge', 'South Bank', 'Hotel próximo ao Big Ben e à região de Westminster.', 930]
    ]
  },
  'Tóquio': {
    flightPrice: 6990,
    airport: 'Haneda Airport (HND)',
    tip: 'Rota de exemplo: desembarque → imigração → bagagem → estação/saída. Consulte a sinalização do terminal.',
    route: ['Desembarque', 'Imigração', 'Bagagem', 'Estação / Saída'],
    hotels: [
      ['Shibuya Excel Hotel Tokyu', 'Shibuya', 'Localização prática para explorar Shibuya e conexões de trem.', 860],
      ['Hotel Gracery Shinjuku', 'Shinjuku', 'Opção central em uma das regiões mais movimentadas de Tóquio.', 640],
      ['Mitsui Garden Hotel Ginza Premier', 'Ginza', 'Alternativa confortável em uma região conhecida por compras e gastronomia.', 790]
    ]
  },
  'Dubai': {
    flightPrice: 5590,
    airport: 'Dubai International Airport (DXB)',
    tip: 'Rota de exemplo: desembarque → imigração → bagagem → saída. Confira o terminal e o transporte indicado.',
    route: ['Desembarque', 'Imigração', 'Bagagem', 'Saída / Transportes'],
    hotels: [
      ['Atlantis The Palm', 'Palm Jumeirah', 'Hotel de referência para uma experiência turística completa.', 1850],
      ['Rove Downtown', 'Downtown Dubai', 'Opção moderna próxima ao Burj Khalifa e Dubai Mall.', 720],
      ['JW Marriott Marquis Hotel Dubai', 'Business Bay', 'Hotel de grande porte em uma área central da cidade.', 1100]
    ]
  },
  'Roma': {
    flightPrice: 4720,
    airport: 'Aeroporto Leonardo da Vinci – Fiumicino (FCO)',
    tip: 'Rota de exemplo: desembarque → controle de passaporte → bagagem → saída/estação.',
    route: ['Desembarque', 'Controle de passaporte', 'Bagagem', 'Saída / Estação'],
    hotels: [
      ['Hotel Artemide', 'Centro de Roma', 'Opção central para acessar atrações históricas e transporte.', 720],
      ['iQ Hotel Roma', 'Termini', 'Alternativa próxima à estação Roma Termini.', 590],
      ['Hotel Quirinale', 'Via Nazionale', 'Hotel tradicional em uma região central de Roma.', 670]
    ]
  }
};

const tripDestination = document.querySelector('#trip-destination');
const tripStart = document.querySelector('#trip-start');
const tripEnd = document.querySelector('#trip-end');
const tripTravelers = document.querySelector('#trip-travelers');
const planTrip = document.querySelector('#plan-trip');
const tripSummary = document.querySelector('#trip-summary');
const hotelList = document.querySelector('#hotel-list');
const airportName = document.querySelector('#airport-name');
const airportRoute = document.querySelector('#airport-route');
const airportTip = document.querySelector('#airport-tip');

function renderTrip(destination) {
  const data = tripData[destination];
  if (!data) return;

  if (airportName) airportName.textContent = data.airport;
  if (airportTip) airportTip.textContent = data.tip;

  if (hotelList) {
    hotelList.innerHTML = data.hotels.map((hotel, index) => `
      <article class="hotel-card">
        <div class="hotel-number">0${index + 1}</div>
        <div class="hotel-content"><strong>${hotel[0]}</strong><small>${hotel[1]}</small><p>${hotel[2]}</p><b class="hotel-price">R$ ${hotel[3].toLocaleString('pt-BR')}/noite</b></div>
        <button type="button" class="hotel-button" data-hotel="${hotel[0]}" data-price="${hotel[3]}">Selecionar</button>
      </article>
    `).join('');
    hotelList.querySelectorAll('.hotel-button').forEach(button => {
      button.addEventListener('click', () => {
        hotelList.querySelectorAll('.hotel-button').forEach(b => b.classList.remove('selected'));
        button.classList.add('selected');
        button.textContent = '✓ Selecionado';
        refreshSelectedHotelTotal();
      });
    });
  }

  if (airportRoute) {
    airportRoute.innerHTML = data.route.map((step, index) => `
      <div class="route-step"><span>${index + 1}</span><div><strong>${step}</strong><small>${index === 0 ? 'Comece por aqui' : index === data.route.length - 1 ? 'Siga a sinalização do aeroporto' : 'Próxima etapa da jornada'}</small></div></div>
    `).join('');
  }
}

function getTripNights() {
  if (!tripStart?.value || !tripEnd?.value) return 1;
  const start = new Date(`${tripStart.value}T12:00:00`);
  const end = new Date(`${tripEnd.value}T12:00:00`);
  const diff = Math.round((end - start) / 86400000);
  return diff > 0 ? diff : 1;
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderTripSummary({mode='initial', destination='Paris', flightTotal=0, travelerCount=1, hotelTotal=null, nights=1}) {
  if (!tripSummary) return;
  const data = tripData[destination];
  if (!data) return;
  const flightPrice = data.flightPrice;
  if (hotelTotal === null) {
    tripSummary.innerHTML = `
      <small>${mode === 'initial' ? 'ESTIMATIVA INICIAL' : 'ESTIMATIVA DA VIAGEM'}</small>
      <strong>${destination}</strong>
      <div class="flight-price-highlight">
        <div><small>PASSAGEM · IDA E VOLTA</small><strong>${formatCurrency(flightPrice)}</strong></div>
        <span>por viajante</span>
      </div>
      <span>Total das passagens para ${travelerCount} viajante${travelerCount === 1 ? '' : 's'}: <b>${formatCurrency(flightTotal || flightPrice * travelerCount)}</b>. Selecione um hotel para calcular o total.</span>`;
    return;
  }
  const total = flightTotal + hotelTotal;
  tripSummary.innerHTML = `
    <small>ESTIMATIVA DA VIAGEM</small>
    <strong>${destination}</strong>
    <div class="flight-price-highlight">
      <div><small>PASSAGEM · IDA E VOLTA</small><strong>${formatCurrency(flightPrice)}</strong></div>
      <span>${travelerCount} viajante${travelerCount === 1 ? '' : 's'}</span>
    </div>
    <span>Passagens: <b>${formatCurrency(flightTotal)}</b> · Hotel: <b>${formatCurrency(hotelTotal)}</b> (${nights} noite${nights === 1 ? '' : 's'})</span>
    <span style="margin-top:6px">Total estimado: <b>${formatCurrency(total)}</b></span>`;
}

function refreshSelectedHotelTotal() {
  const selected = document.querySelector('.hotel-button.selected');
  const destination = tripDestination?.value || 'Paris';
  const data = tripData[destination];
  if (!data || !tripSummary) return;
  const travelersCount = Number((tripTravelers?.value || '1').match(/\d+/)?.[0] || 1);
  const nights = getTripNights();
  const flightTotal = data.flightPrice * travelersCount;
  if (!selected) {
    renderTripSummary({mode:'initial', destination, flightTotal, travelerCount:travelersCount});
    return;
  }
  const hotelTotal = Number(selected.dataset.price) * nights;
  renderTripSummary({mode:'trip', destination, flightTotal, travelerCount:travelersCount, hotelTotal, nights});
}

function formatDate(value) {
  if (!value) return 'data não definida';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

tripDestination?.addEventListener('change', () => {
  const destination = tripDestination.value;
  renderTrip(destination);
  updateRecommendedCompany(destination);
  const data = tripData[destination];
  const travelersCount = Number((tripTravelers?.value || '1').match(/\d+/)?.[0] || 1);
  if (tripSummary && data) renderTripSummary({mode:'initial', destination, flightTotal:data.flightPrice * travelersCount, travelerCount:travelersCount});
});
planTrip?.addEventListener('click', () => {
  const destination = tripDestination?.value || 'Paris';
  const travelers = tripTravelers?.value || '1 viajante';
  renderTrip(destination);
  if (tripSummary) {
    const data = tripData[destination];
    const travelersCount = Number(travelers.match(/\d+/)?.[0] || 1);
    const flightTotal = data.flightPrice * travelersCount;
    const nights = getTripNights();
    renderTripSummary({mode:'trip', destination, flightTotal, travelerCount:travelersCount});
    tripSummary.querySelector('span:last-child')?.insertAdjacentHTML('beforeend', ` · ${formatDate(tripStart?.value)} → ${formatDate(tripEnd?.value)} · Hotel calculado após selecionar uma opção.`);
  }
  localStorage.setItem('gj_trip', JSON.stringify({ destination, start: tripStart?.value || '', end: tripEnd?.value || '', travelers }));
  updateRecommendedCompany(destination);
});
tripStart?.addEventListener('change', refreshSelectedHotelTotal);
tripEnd?.addEventListener('change', refreshSelectedHotelTotal);
tripTravelers?.addEventListener('change', refreshSelectedHotelTotal);

selectCompany?.addEventListener('click', () => {
  const destination = tripDestination?.value || 'Paris';
  const company = companyByDestination[destination];
  if (!company) return;
  saveCompanyUse(company.name);
  selectCompany.textContent = '✓ Empresa selecionada';
  setTimeout(() => selectCompany.textContent = 'Selecionar empresa', 1400);
});

/* --- AirFind: seleção interativa dos planos mensais --- */
const airfindPlans = document.querySelectorAll('.airfind-plan-card');
const airfindSelected = document.querySelector('#airfind-selected');
let selectedAirfindPlan = null;

function selectAirfindPlan(card){
  if (!card || !airfindSelected) return;
  airfindPlans.forEach(plan => {
    const active = plan === card;
    plan.classList.toggle('selected', active);
    plan.setAttribute('aria-pressed', active ? 'true' : 'false');
    const button = plan.querySelector('.plan-select');
    if (button) button.textContent = active ? '✓ Plano selecionado' : 'Selecionar plano';
  });
  selectedAirfindPlan = { name: card.dataset.plan, price: Number(card.dataset.price) };
  airfindSelected.innerHTML = `<div><small>PLANO SELECIONADO</small><strong>AirFind ${selectedAirfindPlan.name}</strong></div><span><b>${formatCurrency(selectedAirfindPlan.price)}/mês</b> · cobrança mensal</span>`;
}

airfindPlans.forEach(card => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('.plan-select')) event.preventDefault();
    selectAirfindPlan(card);
  });
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectAirfindPlan(card); }
  });
  card.querySelector('.plan-select')?.addEventListener('click', event => {
    event.stopPropagation();
    selectAirfindPlan(card);
  });
});

const savedTrip = localStorage.getItem('gj_trip');
if (savedTrip) {
  try {
    const trip = JSON.parse(savedTrip);
    if (tripDestination && trip.destination && tripData[trip.destination]) tripDestination.value = trip.destination;
    if (tripStart) tripStart.value = trip.start || '';
    if (tripEnd) tripEnd.value = trip.end || '';
    if (tripTravelers) tripTravelers.value = trip.travelers || '1 viajante';
  } catch (_) {}
}
renderTrip(tripDestination?.value || 'Paris');
if (tripDestination) { const initialDestination = tripDestination.value || 'Paris'; const initialData = tripData[initialDestination]; const initialTravelers = Number((tripTravelers?.value || '1').match(/\d+/)?.[0] || 1); renderTripSummary({mode:'initial', destination:initialDestination, flightTotal:initialData.flightPrice * initialTravelers, travelerCount:initialTravelers}); }

const initialUser = localStorage.getItem('gj_user');
if (initialUser) { try { updateProfile(JSON.parse(initialUser)); } catch (_) {} } else {
  if (accountNameCard) accountNameCard.textContent = 'Viajante';
  if (accountEmailCard) accountEmailCard.textContent = 'Faça login para visualizar seus dados.';
}
updateRecommendedCompany(tripDestination?.value || 'Paris');
renderCompanyProfile();

/* --- Navegação separada: Início, Bagagem, Minha viagem e Minha conta --- */
const routeSections = {
  home: [],
  bagagem: [document.querySelector('#rastreamento')],
  viagem: [document.querySelector('#minha-viagem')],
  conta: [document.querySelector('#minha-conta')]
};
const homeSections = Array.from(document.querySelectorAll('main > section')).filter(section => !section.classList.contains('app-page'));

function showRoute(route = 'home', targetId = '') {
  const valid = ['home','bagagem','viagem','conta'].includes(route) ? route : 'home';
  document.querySelectorAll('.app-page').forEach(el => el.classList.remove('active-page'));
  homeSections.forEach(el => el.classList.remove('home-hidden'));
  if (valid !== 'home') {
    homeSections.forEach(el => el.classList.add('home-hidden'));
    (routeSections[valid] || []).forEach(el => el?.classList.add('active-page'));
  }
  nav?.classList.remove('open');
  if (targetId && valid === 'home') {
    document.getElementById(targetId)?.scrollIntoView({behavior:'smooth', block:'start'});
  } else {
    window.scrollTo({top:0, behavior:'smooth'});
  }
  history.replaceState({route:valid}, '', valid === 'home' ? '#inicio' : `#${valid}`);
}

function routeFromHash(){
  const hash = location.hash.replace('#','');
  if (['bagagem','minha-viagem','viagem'].includes(hash)) return hash === 'minha-viagem' ? 'viagem' : 'bagagem';
  if (hash === 'minha-conta' || hash === 'conta') return 'conta';
  return 'home';
}

document.querySelectorAll('.nav a[data-route]').forEach(link => {
  link.addEventListener('click', e => {
    const route = link.dataset.route;
    if (route === 'home') {
      const target = (link.getAttribute('href') || '').replace('#','');
      if (target === 'inicio') { e.preventDefault(); showRoute('home'); return; }
      // Links internos do menu continuam na página inicial.
      e.preventDefault(); showRoute('home', target);
      return;
    }
    e.preventDefault(); showRoute(route);
  });
});

document.querySelector('.brand')?.addEventListener('click', e => { e.preventDefault(); showRoute('home'); });
document.querySelector('.footer-brand')?.addEventListener('click', e => { e.preventDefault(); showRoute('home'); });

// Os links internos das soluções apontam para a aba correta.
document.querySelectorAll('a[href="#rastreamento"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); showRoute('bagagem'); }));
document.querySelectorAll('a[href="#minha-viagem"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); showRoute('viagem'); }));
document.querySelectorAll('a[href="#minha-conta"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); showRoute('conta'); }));

// Ao entrar, o canto superior passa a identificar o usuário.
function refreshHeaderAccount(){
  const saved = localStorage.getItem('gj_user');
  const btn = document.querySelector('#account-btn');
  const navAccount = document.querySelector('#nav-account');
  if (!btn) return;
  if (saved) {
    try {
      const user = JSON.parse(saved);
      btn.textContent = `Olá, ${user.name.split(' ')[0]}`;
      btn.classList.add('logged-in');
      navAccount.textContent = 'Minha conta';
    } catch (_) {}
  } else {
    btn.textContent = 'Minha conta';
    btn.classList.remove('logged-in');
  }
}

accountBtn?.addEventListener('click', e => {
  e.preventDefault();
  if (localStorage.getItem('gj_user')) showRoute('conta');
  else showModal(loginModal);
});

// Conta aberta pelo menu exige login; depois do login a página é exibida.
document.querySelector('#nav-account')?.addEventListener('click', e => {
  e.preventDefault();
  if (localStorage.getItem('gj_user')) showRoute('conta');
  else showModal(loginModal);
});

// Viagens: futuras e passadas, com avaliação/reclamação na versão de demonstração.
function getTripHistory(){
  try { return JSON.parse(localStorage.getItem('gj_trip_history') || '[]'); } catch (_) { return []; }
}
function saveTripToHistory(trip){
  const list = getTripHistory();
  const key = `${trip.destination}|${trip.start}|${trip.end}`;
  const idx = list.findIndex(x => x.key === key);
  const item = {...trip, key, createdAt:trip.createdAt || new Date().toISOString()};
  if (idx >= 0) list[idx] = {...list[idx], ...item}; else list.unshift(item);
  localStorage.setItem('gj_trip_history', JSON.stringify(list.slice(0,20)));
  renderSavedTrips();
}
function tripIsPast(trip){
  if (!trip.end) return false;
  return new Date(`${trip.end}T23:59:59`) < new Date();
}
function renderSavedTrips(){
  const future = document.querySelector('#future-trips');
  const past = document.querySelector('#past-trips');
  if (!future || !past) return;
  const trips = getTripHistory();
  const current = localStorage.getItem('gj_trip');
  if (current) { try { const t=JSON.parse(current); saveTripToHistory({...t, status:'planejada'}); } catch(_){} }
  const all = getTripHistory();
  const makeCard = (trip, isPast) => `<article class="saved-trip"><div><strong>${trip.destination}</strong><small>${formatDate(trip.start)} → ${formatDate(trip.end)} · ${trip.travelers || '1 viajante'}${trip.hotel ? ` · ${trip.hotel}` : ''}</small></div><div class="saved-trip-actions">${isPast ? '<button type="button" data-trip-action="review">⭐ Avaliar</button><button type="button" data-trip-action="complaint">⚠ Reclamar</button>' : '<button type="button" data-trip-action="open">Ver viagem</button>'}</div></article>`;
  future.innerHTML = all.filter(t=>!tripIsPast(t)).map(t=>makeCard(t,false)).join('') || '<div class="saved-trip"><div><strong>Nenhuma viagem futura</strong><small>Monte uma viagem para ela aparecer aqui.</small></div></div>';
  past.innerHTML = all.filter(tripIsPast).map(t=>makeCard(t,true)).join('') || '<div class="saved-trip"><div><strong>Nenhuma viagem passada</strong><small>Suas viagens concluídas aparecerão aqui.</small></div></div>';
  [future,past].forEach(box=>box.querySelectorAll('[data-trip-action]').forEach(btn=>btn.addEventListener('click',()=>{
    if(btn.dataset.tripAction==='open') showRoute('viagem');
    if(btn.dataset.tripAction==='review') alert('Área de avaliação: deixe sua nota e comentário sobre a viagem.');
    if(btn.dataset.tripAction==='complaint') alert('Área de reclamação: registre o que aconteceu para análise.');
  })));
}

document.querySelectorAll('.trip-tab').forEach(tab=>tab.addEventListener('click',()=>{
  document.querySelectorAll('.trip-tab').forEach(t=>t.classList.remove('active'));
  tab.classList.add('active');
  document.querySelector('#future-trips')?.classList.toggle('hidden', tab.dataset.tripTab!=='future');
  document.querySelector('#past-trips')?.classList.toggle('hidden', tab.dataset.tripTab!=='past');
}));

// Registrar a viagem quando o usuário clicar em montar.
const originalPlanTrip = planTrip;
planTrip?.addEventListener('click', () => {
  setTimeout(() => {
    const saved = localStorage.getItem('gj_trip');
    if (!saved) return;
    try {
      const trip = JSON.parse(saved);
      const hotel = document.querySelector('.hotel-button.selected')?.dataset.hotel || '';
      saveTripToHistory({...trip, hotel});
    } catch (_) {}
  }, 50);
});

refreshHeaderAccount();
renderSavedTrips();

// A URL de cada aba pode ser compartilhada e abre diretamente na área correspondente.
window.addEventListener('popstate', () => showRoute(routeFromHash()));
const firstRoute = routeFromHash();
showRoute(firstRoute);
