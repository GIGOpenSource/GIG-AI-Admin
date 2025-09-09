<template>
  <ThemeProvider>
    <Toaster position="top-right"/>

    <SidebarProvider>
      <RouterView />
    </SidebarProvider>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>
