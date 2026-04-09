const ADMIN_USER = "esports";
const ADMIN_PASS = "unlues";
const STORAGE_SOLO = "valo_torneo_solo";
const STORAGE_EQUIPO = "valo_torneo_equipo";

function login() {
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    if(user === ADMIN_USER && pass === ADMIN_PASS) {
        sessionStorage.setItem('adminValorant', 'true');
        document.getElementById('loginPanel').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        cargarTablas();
    } else {
        document.getElementById('errorMsg').innerText = '❌ Credenciales incorrectas';
    }
}

function logout() {
    sessionStorage.removeItem('adminValorant');
    document.getElementById('loginPanel').classList.remove('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('adminUser').value = '';
    document.getElementById('adminPass').value = '';
}

function obtenerDatos(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function guardarDatos(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
}

function cargarTablas() {
    // Solo
    const soloLista = obtenerDatos(STORAGE_SOLO);
    const tbodySolo = document.querySelector('#tablaSolo tbody');
    tbodySolo.innerHTML = '';
    soloLista.sort((a,b) => b.id - a.id).forEach(item => {
        tbodySolo.innerHTML += `<tr>
            <td>${escapeHtml(item.riotId)}</td>
            <td>${escapeHtml(item.rango)}</td>
            <td>${escapeHtml(item.rol)}</td>
            <td>${item.fecha}</td>
            <td><button class="delete-btn" onclick="eliminar('${STORAGE_SOLO}', ${item.id})">🗑️</button></td>
        </tr>`;
    });

    // Equipos
    const equipoLista = obtenerDatos(STORAGE_EQUIPO);
    const tbodyEquipo = document.querySelector('#tablaEquipo tbody');
    tbodyEquipo.innerHTML = '';
    equipoLista.sort((a,b) => b.id - a.id).forEach(item => {
        tbodyEquipo.innerHTML += `<tr>
            <td>${escapeHtml(item.nombre)}</td>
            <td>${escapeHtml(item.capitan)}</td>
            <td>${escapeHtml(item.jugadores.join(', '))}</td>
            <td>${item.fecha}</td>
            <td><button class="delete-btn" onclick="eliminar('${STORAGE_EQUIPO}', ${item.id})">🗑️</button></td>
        </tr>`;
    });
}

function eliminar(storage, id) {
    if(confirm('¿Eliminar?')) {
        let lista = obtenerDatos(storage);
        lista = lista.filter(item => item.id !== id);
        guardarDatos(storage, lista);
        cargarTablas();
    }
}

function exportarDatos() {
    const datos = {
        jugadoresSolo: obtenerDatos(STORAGE_SOLO),
        equipos: obtenerDatos(STORAGE_EQUIPO)
    };
    navigator.clipboard.writeText(JSON.stringify(datos, null, 2));
    alert('✅ Datos copiados');
}

function limpiarBase() {
    if(confirm('⚠️ ¿Eliminar todos los datos?')) {
        guardarDatos(STORAGE_SOLO, []);
        guardarDatos(STORAGE_EQUIPO, []);
        cargarTablas();
    }
}

function escapeHtml(str) {
    if(!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if(m === '&') return '&amp;';
        if(m === '<') return '&lt;';
        if(m === '>') return '&gt;';
        return m;
    });
}

// Verificar sesión al cargar
if(sessionStorage.getItem('adminValorant') === 'true') {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('loginPanel').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        cargarTablas();
    });
}
