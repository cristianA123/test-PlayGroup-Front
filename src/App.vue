<template>
  <v-app>
    <v-main>
      <ProductsComponent/>
    </v-main>
  </v-app>
</template>

<script>
import ProductsComponent from './components/ProductsComponent';

export default {
  name: 'App',

  components: {
    ProductsComponent,
  },

  data: () => ({
    //
  }),
};
</script>
