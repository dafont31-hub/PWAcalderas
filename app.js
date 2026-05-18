const SUPABASE_URL =
'https://lofftitowvcnenciygbh.supabase.co'

const SUPABASE_ANON_KEY =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvZmZ0aXRvd3ZjbmVuY2l5Z2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNTc2ODEsImV4cCI6MjA5NDYzMzY4MX0.9p6ykx-IavftenRuQjBeOlQiVpQVZ-HNvPQj7vusXYw'

const supabaseClient =
supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)

const root = document.getElementById('root')

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

function renderDashboard() {

  root.innerHTML = `
    <div class="container">

      <h1 class="title">
        Dashboard Sala Calderas
      </h1>

      <div class="grid">

        <div class="card">
          <h2>OT Pendientes</h2>
          <div class="value" style="color:#facc15">
            12
          </div>
        </div>

        <div class="card">
          <h2>Equipos críticos</h2>
          <div class="value" style="color:#f87171">
            3
          </div>
        </div>

        <div class="card">
          <h2>Preventivos hoy</h2>
          <div class="value" style="color:#4ade80">
            5
          </div>
        </div>

      </div>

    </div>
  `
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