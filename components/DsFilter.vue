<template>
  <v-menu v-model="show" :close-on-content-click="false" offset-x tile>
    <template #activator="{ attrs, on }">
      <span v-bind="attrs" v-on="on">
        {{ name }}
        <v-badge
          v-if="selected.length"
          class="badge"
          :content="selected.length"
          offset-y="5"
          offset-x="9"
        >
          <v-icon small>mdi-filter</v-icon>
        </v-badge>
        <v-icon v-else small>mdi-filter</v-icon>
      </span>
    </template>
    <v-autocomplete
      v-model="selected"
      class="autocomplete"
      background-color="white"
      :items="inItems"
      item-text="text"
      item-value="value"
      deletable-chips
      hide-details
      autofocus
      multiple
      dense
      chips
      @focus="$event.target.click()"
    />
  </v-menu>
</template>
<script>
export default {
  name: "DsFilter",
  props: {
    inItems: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      required: true,
    },
  },
  watch: {
    selected(n) {
      this.$emit("changed", n);
    },
  },
  data() {
    return {
      show: false,
      selected: [],
    };
  },
};
</script>
<style lang="scss" scoped>
.autocomplete {
  margin-top: 0px;
  max-width: 360px;
  overflow: hidden;
}
.autocomplete::v-deep input {
  padding: 0px 8px !important;
}
.badge::v-deep .v-badge__badge {
  padding: 6px 6px;
}
</style>
