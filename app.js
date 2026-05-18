const SUPABASE_URL =
'https://lofftitowvcnenciygbh.supabase.co'

const SUPABASE_ANON_KEY =
'TU_ANON_KEY'

const supabaseClient =
supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)

const root =
document.getElementById('root')

let currentPage = 'dashboard'

function renderLayout(content) {

  root.innerHTML = `
    <div class="layout">

      <aside class="sidebar">

        <h1 class="logo">
          Calderas
        </h1>

        <button onclick="goPage('dashboard')">
          Dashboard
        </button>

        <button onclick="goPage('ots')">
          OTs
        </button>

        <button onclick="goPage('checklists')">
          Checklists
        </button>

      </aside>

      <main class="main-content">
        ${content}
      </main>

    </div>
  `
}

function goPage(page) {

  currentPage = page

  if (page === 'dashboard') {
    renderDashboard()
  }

  if (page === 'ots') {
    renderOTs()
  }

  if (page === 'checklists') {
    renderChecklists()
  }
}

function renderDashboard() {

  renderLayout(`

    <h1 class="title">
      Dashboard Sala Calderas
    </h1>

    <div class="grid">

      <div class="card">
        <h2>OT Pendientes</h2>
        <div class="value yellow">12</div>
      </div>

      <div class="card">
        <h2>Equipos críticos</h2>
        <div class="value red">3</div>
      </div>

      <div class="card">
        <h2>Preventivos hoy</h2>
        <div class="value green">5</div>
      </div>

    </div>
  `)
}

async function renderOTs() {

  const { data } =
    await supabaseClient
      .from('ots')
      .select('*')
      .order('created_at', { ascending: false })

  let html = `
    <div class="topbar">
      <h1 class="title">Órdenes de Trabajo</h1>

      <button onclick="createOT()">
        Nueva OT
      </button>
    </div>
  `

  if (data) {

    data.forEach(ot => {

      html += `
        <div class="card ot-card">

          <h2>${ot.titulo || 'Sin título'}</h2>

          <p>
            ${ot.descripcion || ''}
          </p>

          <div class="badge">
            ${ot.estado}
          </div>

        </div>
      `
    })
  }

  renderLayout(html)
}

async function createOT() {

  const titulo =
    prompt('Título OT')

  if (!titulo) return

  await supabaseClient
    .from('ots')
    .insert({
      titulo,
      estado: 'pendiente'
    })

  renderOTs()
}

async function renderChecklists() {

  const { data } =
    await supabaseClient
      .from('checklists')
      .select('*')
      .order('created_at', { ascending: false })

  let html = `
    <div class="topbar">

      <h1 class="title">
        Checklists
      </h1>

      <button onclick="createChecklist()">
        Nuevo Checklist
      </button>

    </div>
  `

  if (data) {

    data.forEach(item => {

      html += `
        <div class="card ot-card">

          <h2>
            Checklist
          </h2>

          <p>
            ${item.observaciones || ''}
          </p>

        </div>
      `
    })
  }

  renderLayout(html)
}

async function createChecklist() {

  const observaciones =
    prompt('Observaciones checklist')

  await supabaseClient
    .from('checklists')
    .insert({
      observaciones
    })

  renderChecklists()
}

function renderLogin() {

  root.innerHTML = `
    <div class="container">

      <div class="card login-card">

        <h1 class="title">
          PWA Calderas
        </h1>

        <input
          id="email"
          type="email"
          placeholder="Email"
        />

        <input
          id="password"
          type="password"
          placeholder="Contraseña"
        />

        <button onclick="login()">
          Entrar
        </button>

      </div>

    </div>
  `
}

async function login() {

  const email =
    document.getElementById('email').value

  const password =
    document.getElementById('password').value

  const { error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    })

  if (error) {
    alert(error.message)
    return
  }

  renderDashboard()
}

async function init() {

  const {
    data: { session }
  } =
  await supabaseClient.auth.getSession()

  if (session) {
    renderDashboard()
  } else {
    renderLogin()
  }
}

init()
