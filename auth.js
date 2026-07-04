// =========================================================================
// auth.js — Funciones compartidas de sesión y roles.
// Debe cargarse DESPUÉS de conexion.js en cada página protegida.
// =========================================================================

/**
 * Exige que haya sesión iniciada y, opcionalmente, un rol específico.
 * Si no hay sesión -> redirige a login.html
 * Si el rol no coincide -> redirige a la página que sí le corresponde
 * Devuelve { session, perfil } si todo está bien.
 */
async function requerirSesion(rolRequerido) {
  const { data: { session } } = await _supabase.auth.getSession();

  if (!session) {
    window.location.href = "index.html";
    return null;
  }

  const { data: perfil, error } = await _supabase
    .from('perfiles')
    .select('rol, nombre, activo')
    .eq('id', session.user.id)
    .single();

  if (error || !perfil || perfil.activo === false) {
    await _supabase.auth.signOut();
    window.location.href = "index.html";
    return null;
  }

  if (rolRequerido && perfil.rol !== rolRequerido) {
    window.location.href = perfil.rol === 'admin' ? "admin.html" : "registro.html";
    return null;
  }

  return { session, perfil };
}

async function cerrarSesion() {
  await _supabase.auth.signOut();
  window.location.href = "index.html";
}
