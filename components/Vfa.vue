<template>
  <v-card outlined flat tile>
    <v-card-text class="py-1">
      <v-stepper class="vfa-stepper" flat>
        <v-stepper-header>
          <template v-for="(flow, index) in appFlow">
            <template>
              <v-stepper-step
                :key="index"
                color="red"
                class="font-weight-regular"
                complete
              >
                <div>{{ customName(flow) }}</div>
                <div class="mt-1">
                  <span
                    v-for="(m, mi) in flow.managers"
                    :key="mi"
                    :style="{ color: m.status ? false : 'grey' }"
                  >
                    {{ m.name }}
                    <span v-if="mi !== flow.managers.length - 1">,</span>
                  </span>
                </div>
                <div class="mt-1">
                  <template v-for="(m, mi) in flow.managers">
                    <span
                      v-for="(d, di) in m.deputies"
                      :style="{ color: d.status ? false : 'grey' }"
                      :key="di"
                    >
                      {{ d.name }}
                      <span v-if="di !== m.deputies.length - 1">{{
                        ", "
                      }}</span>
                    </span>
                    <span
                      v-if="
                        mi !== flow.managers.length - 1 && m.deputies.length
                      "
                      :key="mi + 'flow'"
                      >{{ ", " }}</span
                    >
                  </template>
                </div>
              </v-stepper-step>
              <v-divider
                :key="index + 'divider'"
                v-if="index < appFlow.length - 1"
              />
            </template>
          </template>
        </v-stepper-header>
      </v-stepper>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    empno: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    appCode: {
      type: String,
      required: true,
    },
    customDept: {
      type: String,
      default: null,
    },
    customDivision: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      appFlow: [],
      show: true,
      deputyListArr: [],
    };
  },
  watch: {
    show(n) {
      console.log("called");
      if (!n) this.deputyListArr = [];
    },
  },
  mounted() {
    this.getFlow();
  },
  methods: {
    log() {
      console.log(arguments);
    },
    async getFlow() {
      let params = {
        empno: this.empno,
        app_code: this.appCode,
        location: this.location,
        custom_data: JSON.stringify({
          custom_dept: this.customDept,
          custom_division: this.customDivision,
        }),
      };
      await this.$axios
        .post("http://gmo021.cansportsvg.com/api/vfa/getFlowUpdated", params)
        .then((res) => {
          this.appFlow = res.data.flow_data;
          this.$emit("sendAppFlow", this.appFlow);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getCustomFlow(custom_dept, custom_division) {
      let params = {
        empno: this.empno,
        app_code: this.appCode,
        location: this.location,
        custom_data: JSON.stringify({
          custom_dept: custom_dept,
          custom_division: custom_division,
        }),
      };
      await this.$axios
        .post("http://gmo021.cansportsvg.com/api/vfa/testFlow", params)
        .then((res) => {
          this.appFlow = res.data.flow_data;
          this.$emit("sendAppFlow", this.appFlow);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    customName(flow) {
      if (flow.lvl_code.includes("custom")) {
        if (flow["managers"].length < 1) {
          return "Please Choose Area...";
        }
      }
      return flow.lvl_name[this.$i18n.locale];
    },
  },
};
</script>
<style lang="scss">
.vfa-stepper .v-stepper__header {
  height: 75px;
}
.vfa-stepper .v-stepper__step {
  padding: 0px;
}
</style>
<i18n>
{
  "en": {
    "deputy_list": "Deputy list",
    "customMsg": "Please Choose Area"
  },
  "zh": {
    "deputy_list": "替換名單",
    "customMsg": "请选择区域"
  },
  "cn": {
    "deputy_list": "替換名單",
    "customMsg": "请选择区域"
  },
  "vi": {
    "deputy_list": "Danh sách người thay thế",
    "customMsg": "Vui Lòng Chọn Khu Vực"
  },
  "id": {
    "deputy_list": "Daftar pengganti",
    "customMsg": "Silahkan Pilih Daerah"
  }
}
</i18n>
