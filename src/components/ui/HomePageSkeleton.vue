<template>
  <!-- Hero is static content and renders immediately; the skeleton covers only
       the API-driven sections underneath it. -->
  <div role="status" aria-busy="true">
    <span class="sr-only">Loading portfolio</span>

    <div v-for="section in 4" :key="section" class="section" aria-hidden="true">
      <div class="wrap">
        <header class="mb-10 md:mb-14">
          <div class="skeleton h-3 w-28 rounded-sm bg-base-200"></div>
          <div class="skeleton mt-4 h-7 w-56 rounded-md bg-base-300 md:h-9"></div>
        </header>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="card in 3" :key="card" class="panel p-6">
            <div class="skeleton h-3 w-16 rounded-sm bg-base-300"></div>
            <div class="skeleton mt-4 h-5 w-2/3 rounded-sm bg-base-300"></div>
            <div class="skeleton mt-3 h-4 w-full rounded-sm bg-base-200"></div>
            <div class="skeleton mt-2 h-4 w-4/5 rounded-sm bg-base-200"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
