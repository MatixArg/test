// ========== CONFIGURACIÓN ==========
const ADMIN_USER = "esports";
const ADMIN_PASS = "unlues";

const STORAGE_SOLO = "valo_torneo_solo";
const STORAGE_EQUIPO = "valo_torneo_equipo";

let sesionAdminActiva = false;

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
    // Pestañas
    document.getElementById('tabSolo').addEventListener('click', () => {
        document.getElementById('formSolo').classList.remove('hidden');
        document.getElementById('formEquipo').classList.add('hidden');
        document.getElementById('tabSolo').classList.add('active');
        document.getElementById('tabEquipo').classList.remove('active');
    });
    
    document.getElementById('tabEquipo').addEventListener('click', () => {
        document.getElementById('formEquipo').classList.remove('hidden');
        document.getElementById('formSolo').classList.add('hidden');
        document.getElementById('tabEquipo').classList.add('active');
        document.getElementById('tabSolo').classList.remove('active');
    });

    // Verificar sesión guardada
    if(sessionStorage.getItem('adminValorant') === 'true') {
        sesionAdminActiva = true;
        document.getElementById('panelAdminGlobal').classList.remove('hidden');
        cargarTablas();
    }
});

// ========== MODAL ADMIN ==========
function abrirModalAdmin() {
    document.getElementById('modalAdmin').classList.remove('hidden');
    document.getElementById('adminError').innerText = '';
    document.getElementById('adminUser').value = '';
    document.getElementById('adminPass').value = '';
}

function cerrarModalAdmin() {
    document.getElementById('modalAdmin').classList.add('hidden');
}

// ========== FUNCIONES ADMIN ==========
function loginAdmin() {
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        sesionAdminActiva = true;
        sessionStorage.setItem('adminValorant', 'true');
        document.getElementById('modalAdmin').classList.add('hidden');
        document.getElementById('panelAdminGlobal').classList.remove('hidden');
        cargarTablas();
    } else {
        document.getElementById('adminError').innerText = '❌ Usuario o contraseña incorrectos';
    }
}

function cerrarSesionAdmin() {
    sesionAdminActiva = false;
    sessionStorage.removeItem('adminValorant');
    document.getElementById('panelAdminGlobal').classList.add('hidden');
}

// ========== BASE DE DATOS (LocalStorage) ==========
function obtenerDatos(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function guardarDatos(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
}

// ========== REGISTROS ==========
function registrarSolo() {
    const riotId = document.getElementById('soloRiotId').value.trim();
    const rango = document.getElementById('soloRango').value;
    const rol = document.getElementById('soloRol').value;
    const msgDiv = document.getElementById('msgSolo');

    if (!riotId || !rango || !rol) {
        msgDiv.className = 'error-msg';
        msgDiv.innerText = "⚠️ Todos los campos son obligatorios.";
        return;
    }

    if (!riotId.includes('#')) {
        msgDiv.className = 'error-msg';
        msgDiv.innerText = "⚠️ El Riot ID debe incluir # (Ej: Jugador#1234)";
        return;
    }

    const lista = obtenerDatos(STORAGE_SOLO);
    lista.push({
        id: Date.now(),
        riotId: riotId,
        rango: rango,
        rol: rol,
        fecha: new Date().toLocaleString()
    });
    guardarDatos(STORAGE_SOLO, lista);

    msgDiv.className = 'success-msg';
    msgDiv.innerText = "✅ ¡Registrado! Buena suerte en el torneo.";
    
    document.getElementById('soloRiotId').value = '';
    document.getElementById('soloRango').value = '';
    document.getElementById('soloRol').value = '';

    if(sesionAdminActiva) cargarTablas();
    
    setTimeout(() => msgDiv.innerText = '', 3000);
}

function registrarEquipo() {
    const nombre = document.getElementById('nombreEquipo').value.trim();
    const capitan = document.getElementById('capitanId').value.trim();
    const p2 = document.getElementById('p2').value.trim();
    const p3 = document.getElementById('p3').value.trim();
    const p4 = document.getElementById('p4').value.trim();
    const p5 = document.getElementById('p5').value.trim();
    const msgDiv = document.getElementById('msgEquipo');

    if (!nombre || !capitan || !p2 || !p3 || !p4 || !p5) {
        msgDiv.className = 'error-msg';
        msgDiv.innerText = "⚠️ Debes ingresar el nombre del equipo y los 5 jugadores.";
        return;
    }

    const lista = obtenerDatos(STORAGE_EQUIPO);
    lista.push({
        id: Date.now(),
        nombre: nombre,
        capitan: capitan,
        jugadores: [capitan, p2, p3, p4, p5],
        fecha: new Date().toLocaleString()
    });
    guardarDatos(STORAGE_EQUIPO, lista);

    msgDiv.className = 'success-msg';
    msgDiv.innerText = `✅ ¡Equipo "${nombre}" inscrito correctamente!`;
    
    document.getElementById('nombreEquipo').value = '';
    document.getElementById('capitanId').value = '';
    document.getElementById('p2').value = '';
    document.getElementById('p3').value = '';
    document.getElementById('p4').value = '';
    document.getElementById('p5').value = '';

    if(sesionAdminActiva) cargarTablas();
    
    setTimeout(() => msgDiv.innerText = '', 3000);
}

// ========== CARGAR TABLAS ADMIN ==========
function cargarTablas() {
    cargarTablaSolo();
    cargarTablaEquipo();
}

function cargarTablaSolo() {
    const lista = obtenerDatos(STORAGE_SOLO);
    const tbody = document.querySelector('#tablaSolo tbody');
    tbody.innerHTML = '';
    
    lista.sort((a,b) => b.id - a.id).forEach(item => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${escapeHtml(item.riotId)}</td>
            <td>${escapeHtml(item.rango)}</td>
            <td>${escapeHtml(item.rol)}</td>
            <td>${item.fecha || 'N/A'}</td>
            <td><button class="delete-btn" onclick="eliminarRegistro('${STORAGE_SOLO}', ${item.id})">🗑️</button></td>
        `;
        tbody.appendChild(fila);
    });
}

function cargarTablaEquipo() {
    const lista = obtenerDatos(STORAGE_EQUIPO);
    const tbody = document.querySelector('#tablaEquipo tbody');
    tbody.innerHTML = '';
    
    lista.sort((a,b) => b.id - a.id).forEach(item => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${escapeHtml(item.nombre)}</td>
            <td>${escapeHtml(item.capitan)}</td>
            <td>${escapeHtml(item.jugadores.join(', '))}</td>
            <td>${item.fecha || 'N/A'}</td>
            <td><button class="delete-btn" onclick="eliminarRegistro('${STORAGE_EQUIPO}', ${item.id})">🗑️</button></td>
        `;
        tbody.appendChild(fila);
    });
}

function eliminarRegistro(storage, id) {
    if(confirm('¿Eliminar este registro?')) {
        let lista = obtenerDatos(storage);
        lista = lista.filter(item => item.id !== id);
        guardarDatos(storage, lista);
        cargarTablas();
    }
}

function exportarDatos() {
    const datos = {
        jugadoresSolo: obtenerDatos(STORAGE_SOLO),
        equipos: obtenerDatos(STORAGE_EQUIPO),
        fechaExportacion: new Date().toLocaleString()
    };
    const jsonStr = JSON.stringify(datos, null, 2);
    navigator.clipboard.writeText(jsonStr);
    alert('✅ Datos copiados al portapapeles');
}

function limpiarBase() {
    if(confirm('⚠️ ¿ELIMINAR TODOS LOS DATOS? Esta acción no se puede deshacer.')) {
        guardarDatos(STORAGE_SOLO, []);
        guardarDatos(STORAGE_EQUIPO, []);
        if(sesionAdminActiva) cargarTablas();
        alert('✅ Base de datos limpiada');
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
