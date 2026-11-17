/* Autenticação real via Supabase Auth. Nunca armazenar senhas no localStorage. */
(() => {
  const config = window.GJ_SUPABASE_CONFIG || {};
  const client = config.url && config.anonKey && window.supabase
    ? window.supabase.createClient(config.url, config.anonKey) : null;
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
  const reset = document.querySelector('#reset-password');
  const logout = document.querySelector('#logout-btn');
  const section = document.querySelector('#account-section-btn');
  let mode = 'login';
  let currentUser = null;
  function open(modeName) {
    mode = modeName;
    nameRow.hidden = mode !== 'register';
    nameInput.required = mode === 'register';
    passwordInput.autocomplete = mode === 'register' ? 'new-password' : 'current-password';
    submit.textContent = mode === 'register' ? 'Criar conta' : 'Entrar na conta';
    status.textContent = client ? '' : 'Configure as chaves públicas do Supabase em supabase-config.js para ativar o acesso.';
    showModal(modal);
  }
  function display(user) {
    currentUser = user;
    const name = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Viajante';
    account.textContent = user ? 'Minha conta' : 'Entrar';
    register.hidden = Boolean(user);
    if (user) {
      updateProfile({name, email:user.email});
      if(document.querySelector('#user-name')) document.querySelector('#user-name').textContent = name;
      document.querySelector('#account-panel')?.classList.add('logged');
    } else {
      document.querySelector('#account-panel')?.classList.remove('logged');
      ['#profile-name','#account-name-card'].forEach(id=>{const el=document.querySelector(id);if(el)el.textContent='Viajante';});
      ['#profile-email','#account-email-card'].forEach(id=>{const el=document.querySelector(id);if(el)el.textContent='Faça login para visualizar seus dados.';});
    }
    if(section) section.textContent = user ? 'Sair da conta' : 'Entrar';
  }
  account?.addEventListener('click', () => currentUser ? showRoute('conta') : open('login'));
  register?.addEventListener('click', () => open('register'));
  section?.addEventListener('click', async () => {
    if(!currentUser) return open('login');
    await client?.auth.signOut();
  });
  logout?.addEventListener('click', async () => { await client?.auth.signOut(); showRoute('home'); });
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!client) { status.textContent = 'Supabase ainda não configurado.'; return; }
    submit.disabled = true;
    status.textContent = 'Aguarde...';
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    try {
      const result = mode === 'register'
        ? await client.auth.signUp({email,password,options:{data:{name:nameInput.value.trim()},emailRedirectTo:location.origin}})
        : await client.auth.signInWithPassword({email,password});
      if(result.error) throw result.error;
      if(mode === 'register' && !result.data.session) {
        status.textContent = 'Cadastro recebido. Confira seu e-mail para confirmar a conta.';
      } else {
        status.textContent = 'Acesso realizado com sucesso.';
        form.reset(); hideModal(modal); showRoute('conta');
      }
    } catch(err) { status.textContent = err.message || 'Não foi possível autenticar.'; }
    finally { submit.disabled = false; }
  });
  reset?.addEventListener('click', async () => {
    if(!client) {status.textContent='Configure o Supabase primeiro.';return;}
    const email = emailInput.value.trim();
    if(!email) {status.textContent='Informe seu e-mail acima.';return;}
    const {error} = await client.auth.resetPasswordForEmail(email,{redirectTo:location.origin});
    status.textContent = error ? error.message : 'Se o e-mail estiver cadastrado, você receberá instruções de recuperação.';
  });
  document.querySelectorAll('a[href="#minha-conta"]').forEach(a=>a.addEventListener('click', e=>{
    e.preventDefault(); currentUser ? showRoute('conta') : open('login');
  }));
  display(null);
  if(client) {
    client.auth.onAuthStateChange((_event,session)=>display(session?.user || null));
    client.auth.getUser().then(({data})=>display(data?.user || null)).catch(()=>display(null));
  }
})();
