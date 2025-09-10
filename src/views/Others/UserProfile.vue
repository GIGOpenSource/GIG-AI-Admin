<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

      <profile-card />
      <!-- <personal-info-card />
      <address-card /> -->
  </admin-layout>
</template>

<script setup>
import AdminLayout from '../../components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { ref } from 'vue'
import ProfileCard from '../../components/profile/ProfileCard.vue'
import PersonalInfoCard from '../../components/profile/PersonalInfoCard.vue'
import AddressCard from '../../components/profile/AddressCard.vue'
const currentPageTitle = ref('个人资料')
</script>
