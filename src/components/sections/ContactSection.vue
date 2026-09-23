<template>
  <section id="contact" class="section">
    <div v-reveal class="wrap">
      <SectionHeader
        :title="$t('headings.contact')"
        :index="'07'"
        :kicker="$t('navigation.contact')"
      />

      <ContactInvite />
    </div>
  </section>
</template>

<script setup lang="ts">
import ContactInvite from '@/components/sections/ContactInvite.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
</script>
