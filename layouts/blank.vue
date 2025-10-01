<template>
  <v-app>
  
    <v-main style="background: url(bg4.jpg) top center no-repeat; background-size: cover;"> 
      <VersionChecker app-name="vg-bta"></VersionChecker>
      <v-container class="fill-height" fluid>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import VersionChecker from "../../../@global-component/version-checker";
export default {
  components: {
    VersionChecker,
  },
  data () {
    return {
      
    }
  }
}
</script>
