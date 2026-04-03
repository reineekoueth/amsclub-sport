<template>
  <div id="app">
    <NavBar />
    <main class="main-content">
      <RouterView />
    </main>
    <footer class="footer">
      <p>© 2026 AMS Club - SPORT </p>
    </footer>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #e63946;
  --primary-dark: #c1121f;
  --dark: #1d1d1d;
  --grey: #f4f4f4;
  --white: #ffffff;
  --shadow: 0 4px 16px rgba(0,0,0,0.1);
  --radius: 12px;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: var(--grey);
  color: #333;
}

.main-content {
  min-height: calc(100vh - 140px);
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.footer {
  background: var(--dark);
  color: #aaa;
  text-align: center;
  padding: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.6rem 1.4rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary { background: var(--primary); color: white; }
.btn-primary:hover { background: var(--primary-dark); }
.btn-secondary { background: #6c757d; color: white; }
.btn-danger { background: #dc3545; color: white; }

.card {
  background: white;
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
}
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}
</style>