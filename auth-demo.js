/* Perfil local demonstrativo: verificação de senha no navegador, sem autenticação de servidor. */
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
  const passwordInput = document.querySelector('#login-password');
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
    if(passwordInput) {passwordInput.value='';passwordInput.autocomplete=mode==='register'?'new-password':'current-password';}
    if(status) status.textContent = 'Demonstração local: senha verificada neste dispositivo, sem conta online. Não reutilize senhas reais.';
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
  const ITERATIONS=150000;
  function toHex(bytes){return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');}
  function fromHex(hex){return new Uint8Array(hex.match(/.{2}/g).map(x=>parseInt(x,16)));}
  async function passwordHash(password,salt){
    const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
    const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:ITERATIONS,hash:'SHA-256'},key,256);
    return toHex(new Uint8Array(bits));
  }
  form?.addEventListener('submit',async e=>{
    e.preventDefault();
    if(submit?.disabled)return;
    const email=emailInput?.value.trim().toLowerCase();
    const password=passwordInput?.value||'';
    if(!email||!emailInput.checkValidity()){status.textContent='Informe um e-mail válido.';return;}
    if(password.length<8){status.textContent='A senha precisa ter pelo menos 8 caracteres.';return;}
    if(!globalThis.crypto?.subtle){status.textContent='Este navegador não oferece verificação de senha segura para a demonstração.';return;}
    if(submit)submit.disabled=true;
    try{
      if(mode==='register'){
        const name=nameInput?.value.trim();
        if(!name){status.textContent='Informe seu nome.';return;}
        const salt=crypto.getRandomValues(new Uint8Array(16));
        const hash=await passwordHash(password,salt);
        localStorage.setItem(KEY,JSON.stringify({name,email,passwordSalt:toHex(salt),passwordHash:hash}));
      }else{
        const profile=readProfile();
        if(!profile||profile.email!==email){status.textContent='Perfil não encontrado neste navegador. Registre-se para criar um perfil.';return;}
        if(!profile.passwordHash||!profile.passwordSalt){status.textContent='Seu perfil antigo não possui senha. Use Registre-se para definir uma senha neste dispositivo.';return;}
        const hash=await passwordHash(password,fromHex(profile.passwordSalt));
        if(hash!==profile.passwordHash){status.textContent='Senha incorreta. Tente novamente.';return;}
      }
      sessionStorage.setItem(ACTIVE,'1');
      form.reset();hideModal(modal);render();showRoute('conta');
    }catch(_){status.textContent='Não foi possível verificar ou salvar a senha neste navegador.';}
    finally{if(submit)submit.disabled=false;}
  });
  document.querySelector('#account-view-bag')?.addEventListener('click',()=>showRoute('bagagem'));
  render();
})();