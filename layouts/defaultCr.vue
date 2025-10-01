<i18n>
{
"en": {
    "dash": "Dashboard",
    "logout" : "Logout",
    "appname" : "VG - Business Trip Approval",
    "confirm_logout":"Want to logout ?",
    "hi":"Welcome ",
    "car_booking" : "New car booking",
    "destinations": "Destinations",
    "route_arrange" :"Route arrangement",
    "task_listing": "Tasks listing",
    "driver_listing":"Driver listing",
    "car_listing": "Car listing",
    "driver_logs": "Driver logs"

},
"cn": {
     "dash": "主控板",
    "logout" : "登出",
     "appname" : "VG - 商务旅行批准",
     "confirm_logout":"確定登出？",
     "hi":"你好",
     "car_booking" : "新车预订" ,
     "destinations": "目的地",
     "route_arrange" :"路线安排",
     "task_listing": "任務列表",
     "driver_listing":"驱动程序列表",
     "car_listing": "汽车清单",
    "driver_logs": "司机日志"

},
"vi": {
    "dash": "Bảng điều khiển",
    "logout" : "Đăng xuất",
    "appname" : "VG - Phê duyệt chuyến đi công việc",
    "confirm_logout":"Bạn muốn đăng xuất?",
    "hi":"Xin chào",
    "car_booking" : "Đăng ký xe",
    "destinations": "Danh sách điểm đến",
    "route_arrange" :"Sắp xếp chuyến đi",
    "task_listing": "Danh sách tác vụ",
    "driver_listing":"Danh sách tài xế",
    "car_listing": "Danh sách xe",
    "driver_logs": "Nhật ký lái xe"
}
}
</i18n>
<template>
  <v-app dark>
    <v-navigation-drawer
      color="teal"
      dark
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      temporary
    >
      <v-list>
        <div
          v-for="(item, i) in items"
          :key="i"
          router
          exact
          v-show="item.viewAble.includes(activeUser.role)"
        >
          <v-list-item :to="item.to" nuxt>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="$t(item.title)" />
            </v-list-item-content>
          </v-list-item>
          <v-divider v-show="item.showDivider"></v-divider>
        </div>

        <v-list-item @click="clearSession">
          <v-list-item-action>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="$t('logout')" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar dense color="teal" dark :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="$t('appname')" />
      <v-spacer />
      <v-btn @click="locale('vi')" text>VI</v-btn>
      <v-btn @click="locale('en')" text>EN</v-btn>
      <v-btn @click="locale('cn')" text class="mr-10">中文</v-btn>

      <label class="mr-5"
        >{{ $t("hi") }}: {{ this.$session.get("vg-bta").name }} -
        {{ this.$session.get("vg-bta").dept }}</label
      >
      <v-btn @click="clearSession" outlined dark
        >{{ $t("logout") }}
        <v-icon right>mdi-logout-variant</v-icon>
      </v-btn>
      <v-icon @click="reportBug" color="white" class="ml-3"> mdi-bug </v-icon>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <VersionChecker app-name="vg-bta"></VersionChecker>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer :absolute="!fixed" app>
      <small
        >&copy; {{ new Date().getFullYear() }} Developed by VG - Project
        team</small
      >
      <v-spacer></v-spacer>
      <v-tooltip top color="error">
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            large
            @mouseover="handleMouseOver"
            @mouseout="handleMouseOut"
            @click="reportBug"
            color="red"
            v-bind="attrs"
            v-on="on"
          >
            mdi-bug
          </v-icon>
        </template>
        <span>{{ $t("Click here to report an error.") }}</span>
      </v-tooltip>
    </v-footer>
  </v-app>
</template>

<script>
import VersionChecker from "../../../@global-component/version-checker";
export default {
  components: {
    VersionChecker,
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "dash",
          to: "/dashboard",
          viewAble: ["user", "admin", "review"],
          showDivider: true,
        },
        // {
        //   icon: "mdi-car",
        //   title: "car_booking",
        //   to: "/request-form",
        //   viewAble: ["user", "admin", "review"],
        //   showDivider: false,
        // },
        // {
        //   icon: "mdi-google-maps",
        //   title: "destinations",
        //   to: "/destination-listing",
        //   viewAble: ["user", "admin", "review"],
        //   showDivider: true,
        // },
        // {
        //   icon: "mdi-repeat",
        //   title: "route_arrange",
        //   to: "/route-arrangement",
        //   viewAble: ["admin"],
        //   showDivider: false,
        // },
        // {
        //   icon: "mdi-format-list-text",
        //   title: "task_listing",
        //   to: "/task-listing",
        //   viewAble: ["admin"],
        //   showDivider: true,
        // },
        // {
        //   icon: "mdi-account-circle-outline",
        //   title: "driver_listing",
        //   to: "/driver-listing",
        //   viewAble: ["admin"],
        //   showDivider: false,
        // },
        // {
        //   icon: "mdi-car-info",
        //   title: "car_listing",
        //   to: "/car-listing",
        //   viewAble: ["admin"],
        //   showDivider: true,
        // },
        // {
        //   icon: "mdi-note-multiple",
        //   title: "driver_logs",
        //   to: "/driver-logs",
        //   viewAble: ["admin"],
        //   showDivider: true,
        // },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: this.$t("appname"),
      activeUser: {},
    };
  },
  methods: {
    reportBug() {
      const url =
        "http://gmo021.cansportsvg.com/ps/vg-report-issue/discord?username=" +
        this.$session.get("vg-bta").username +
        "&name=" +
        this.$session.get("vg-bta").name +
        "&appurl=" +
        window.location.href +
        "&appname=vg-transport";
      window.open(url, "_blank");
    },
    handleMouseOver() {
      this.iconOpacity = 1; // Set opacity to 100% on mouseover
    },
    handleMouseOut() {
      this.iconOpacity = 0.3; // Set opacity back to 30% on mouseout
    },
    clearSession() {
      let c = confirm(this.$t("confirm_logout"));
      if (c) {
        this.$session.clear();
        this.$i18n.setLocale("en");
        this.$router.push({
          path: "/",
        });
      }
    },
    locale(tg) {
      this.$i18n.setLocale(tg);
      $nuxt.$emit("change-locale", tg);
      this.$vuetify.lang.current = tg;
    },
  },
  computed: {},
  mounted() {
    if (this.$session.has("vg-bta")) {
      this.activeUser = this.$session.get("vg-bta");
    }
  },
};
</script>
