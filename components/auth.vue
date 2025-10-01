<template></template>
<script>
export default {
  data() {
    return {};
  },
  beforeMount() {
    if (process.client) {
      if (this.$session.get("vg-bta") === undefined) {
        this.$router.push("./");
        console.log("login failed");
      } else {
        // console.log('logined');
      }
    }
  },
};
</script>
