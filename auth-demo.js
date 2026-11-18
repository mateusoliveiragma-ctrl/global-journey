/* Perfil ilustrativo para pitch. Não é autenticação e não guarda senhas. */
(() => {
  const KEY = 'gj_pitch_profile_v1';
  const ACTIVE = 'gj_pitch_active_v1';
  const account = document.querySelector('#account-btn');
  const register = document.querySelector('#register-btn');
  const form = document.querySelector('#login-form');
  const modal = document.querySelector('#login-modal');
  const status = document.querySelector('#login-status');
  const nameRow = document.querySelector('#login-name-row');
  const nameInput = document.querySelector('#login-name');
  const emailInput = document.querySelector('#login-email');
  const submit = document.querySelector('#auth-submit');
  const logout = document.querySelector('#account-section-btn');
  const bottomLogout = document.querySelector('#account-signout-btn');
  const bottomLogoutBox = document.querySelector('#account-signout');
  let mode = 'register';
  function readProfile() {
    try { const v = JSON.parse(localStorage.getItem(KEY)); return v && typeof v.name === 'string' && typeof v.email === 'string' ? v : null; }
    catch { return null; }
  }
  function activeProfile() { return sessionStorage.getItem(ACTIVE) === '1' ? readProfile() : null; }
  function render() {
    const profile = activeProfile();
    if(account) account.textContent = profile ? 'Minha conta' : 'Entrar';
    if(register) register.hidden = !!profile;
    if(logout) logout.textContent = profile ? 'Sair da conta' : 'Entrar';
    if(bottomLogoutBox) bottomLogoutBox.hidden = !profile;
    document.querySelector('#account-panel')?.classList.toggle('logged',!!profile);
    const name = profile?.name || 'Viajante';
    const email = profile?.email || 'Entre no perfil demonstrativo para visualizar seus dados.';
    if(profile) updateProfile(profile);
    for(const id of ['#profile-name','#account-name-card','#user-name']) {
      const el = document.querySelector(id); if(el) el.textContent = name;
    }
    for(const id of ['#profile-email','#account-email-card']) {
      const el = document.querySelector(id); if(el) el.textContent = email;
    }
  }
  function open(nextMode) {
    mode = nextMode;
    if(nameRow) nameRow.hidden = mode !== 'register';
    if(nameInput) nameInput.required = mode === 'register';
    if(submit) submit.textContent = mode === 'register' ? 'Criar perfil ilustrativo' : 'Entrar no perfil';
    if(status) status.textContent = 'Demonstração local: sem senha, e-mail de confirmação ou conta online.';
    showModal(modal);
  }
  account?.addEventListener('click',()=>activeProfile() ? showRoute('conta') : open('login'));
  register?.addEventListener('click',()=>open('register'));
  function signOut(){sessionStorage.removeItem(ACTIVE);render();showRoute('home');}
  logout?.addEventListener('click',()=>{
    if(!activeProfile()) {open('login');return;}
    signOut();
  });
  bottomLogout?.addEventListener('click',()=>{if(activeProfile()) signOut();});
  form?.addEventListener('submit',e=>{
    e.preventDefault();
    const email = emailInput?.value.trim().toLowerCase();
    if(!email || !emailInput.checkValidity()) { status.textContent = 'Informe um e-mail válido.';return; }
    if(mode === 'register') {
      const name = nameInput?.value.trim();
      if(!name) {status.textContent = 'Informe seu nome.';return;}
      try {localStorage.setItem(KEY,JSON.stringify({name,email}));}
      catch {status.textContent = 'Não foi possível salvar neste navegador. Verifique se o armazenamento está permitido.';return;}
    } else {
      const profile = readProfile();
      if(!profile || profile.email !== email) {status.textContent = 'Perfil não encontrado neste navegador. Clique em Registre-se para criar um perfil ilustrativo.';return;}
    }
    sessionStorage.setItem(ACTIVE,'1');
    form.reset();hideModal(modal);render();showRoute('conta');
  });
  document.querySelector('#account-view-bag')?.addEventListener('click',()=>showRoute('bagagem'));
  render();
})();