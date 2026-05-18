const SUPABASE_URL =
'https://lofftitowvcnenciygbh.supabase.co'

const SUPABASE_ANON_KEY =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvZmZ0aXRvd3ZjbmVuY2l5Z2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNTc2ODEsImV4cCI6MjA5NDYzMzY4MX0.9p6ykx-IavftenRuQjBeOlQiVpQVZ-HNvPQj7vusXYw'

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

      <nav class="navbar">

        <div class="nav-left">

          <div class="logo">
            Calderas
          </div>

        </div>

        <div class="nav-right">

          <button onclick="goPage('dashboard')">
            Dashboard
          </button>

          <button onclick="goPage('ots')">
            OTs
          </button>

          <button onclick="goPage('checklists')">
            Checklists
          </button>

        </div>

      </nav>

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

async function renderDashboard() {

  const { data: ots } =
    await supabaseClient
      .from('ots')
      .select('*')

  const { data: checklists } =
    await supabaseClient
      .from('checklists')
      .select('*')

  renderLayout(`

    <h1 class="title">
      Dashboard Sala Calderas
    </h1>

    <div class="grid">

      <div class="card">
        <h2>OT Totales</h2>
        <div class="value yellow">
          ${ots ? ots.length : 0}
        </div>
      </div>

      <div class="card">
        <h2>Checklists</h2>
        <div class="value green">
          ${checklists ? checklists.length : 0}
        </div>
      </div>

      <div class="card">
        <h2>Estado Sistema</h2>
        <div class="value blue">
          OK
        </div>
      </div>

    </div>

  `)
}

async function renderOTs() {

  const { data } =
    await supabaseClient
      .from('ots')
      .select('*')
      .order('created_at', {
        ascending: false
      })

  let html = `

    <div class="topbar">

      <h1 class="title">
        Órdenes de Trabajo
      </h1>

      <button onclick="createOT()">
        Nueva OT
      </button>

    </div>

    <table class="table">

      <thead>
        <tr>
          <th>Título</th>
          <th>Estado</th>
          <th>Prioridad</th>
        </tr>
      </thead>

      <tbody>
  `

  if (data && data.length > 0) {

    data.forEach(ot => {

      html += `
        <tr>

          <td>
            ${ot.titulo || ''}
          </td>

          <td>
            ${ot.estado || ''}
          </td>

          <td>
            ${ot.prioridad || 'media'}
          </td>

        </tr>
      `
    })

  } else {

    html += `
      <tr>
        <td colspan="3">
          No hay órdenes de trabajo
        </td>
      </tr>
    `
  }

  html += `
      </tbody>
    </table>
  `

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
      estado: 'pendiente',
      prioridad: 'media'
    })

  renderOTs()
}

async function renderChecklists() {

  const { data } =
    await supabaseClient
      .from('checklists')
      .select('*')
      .order('created_at', {
        ascending: false
      })

  let html = `

    <div class="topbar">

      <h1 class="title">
        Checklists
      </h1>

      <button onclick="createChecklist()">
        Nuevo Checklist
      </button>

    </div>

    <table class="table">

      <thead>
        <tr>
          <th>Observaciones</th>
          <th>Fecha</th>
        </tr>
      </thead>

      <tbody>
  `

  if (data && data.length > 0) {

    data.forEach(item => {

      html += `
        <tr>

          <td>
            ${item.observaciones || ''}
          </td>

          <td>
            ${new Date(
              item.created_at
            ).toLocaleString()}
          </td>

        </tr>
      `
    })

  } else {

    html += `
      <tr>
        <td colspan="2">
          No hay checklists
        </td>
      </tr>
    `
  }

  html += `
      </tbody>
    </table>
  `

  renderLayout(html)
}

async function createChecklist() {

  const observaciones =
    prompt('Observaciones checklist')

  if (!observaciones) return

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
