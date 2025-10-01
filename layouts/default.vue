<i18n>
  {
    "en": {
      "dash": "Dashboard",
      "logout" : "Logout",
      "appname" : "Repair proposal application",
      "confirm_logout":"Want to logout ?",
      "hi":"Welcome "
      
    },
    "cn": {
      "Go home": "回家",
      "User manual": "使用手冊",
      "dash": "主控板",
      "logout" : "登出",
      "appname" : "維修單申請", 
      "confirm_logout":"確定登出？",
      "hi":"你好"
      
    }, 
    "vi": {
      "Go home": "Về trang chủ",
      "User manual": "Hướng dẫn sử dụng",
      "dash": "Bảng điều khiển",
      "logout" : "Đăng xuất",
      "appname" : "Ứng dụng đề xuất sửa chữa",
      "confirm_logout":"Bạn muốn đăng xuất?",
      "hi":"Xin chào"
    }
  }
</i18n>
<template>
  <div> 
    <v-app v-if="loaded" dark >
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
          <v-list-item @click="helpUseApp()">
            <v-list-item-action>
              <v-icon>mdi-information-variant</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="$t('User manual')" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list>
          <v-list-item @click="goHome()">
            <v-list-item-action>
              <v-icon>mdi-home-export-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="$t('Go home')" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar class="noPrint" dense color="teal" dark :clipped-left="clipped" fixed app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-title title="appname" v-text="$t('appname')" />
      <v-chip
      class="ma-2"
      color="white"
      label
      small
      outlined
      @click:close="chip4 = false"
      >
      V.1.0.0
    </v-chip>
    
    <v-spacer />
    <v-btn @click="locale('vi')" text>VI</v-btn>
    <v-btn @click="locale('en')" text>EN</v-btn>
    <v-btn @click="locale('cn')" text class="mr-10">中文</v-btn>
    
    <label class="mr-5">
      {{ this.$session.get("aw_rpa_demo") 
      ? `${$t("hi")}: ${this.$session.get("aw_rpa_demo").name} - ${this.$session.get("aw_rpa_demo").dept}` 
      : "" 
    }}
  </label>
</v-app-bar>
<v-main>
  <v-container fluid>
    <nuxt />
  </v-container>
</v-main>

<v-footer class="noPrint" :absolute="!fixed" app>
  <small
  >&copy; {{ new Date().getFullYear() }} Developed by VG - Project
  team</small
  >
  <v-spacer></v-spacer>
  
</v-footer>
</v-app>
<AuthComp ref="authComp" app="aw_rpa_demo" @setUser="setUser" />
</div>
</template>

<script>
//import VersionChecker from "../../../@global-component/version-checker";
import AuthComp from "../../../@global-component/auth-comp";
export default {
  components: {
    // VersionChecker,
    AuthComp, 
  },
  data() {
    return {
      loaded: false,
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: this.$t("appname"),
      activeUser: {},
    };
  },
  methods: {
    helpUseApp(){
      window.open("http://gmo021.cansportsvg.com/shared/user-manual/rpa/RPA-VIETNAM.pdf", "_blank");
    },
    goHome(){
      window.location.href = "http://gmo021.cansportsvg.com/";
    },
    setUser(user) {
      console.log("user", user);
      const appRoles = JSON.parse(user.app_roles);
      
      // Tìm app có tên "aw_rpa_demo"
      const roleItem = appRoles.find(app => app.app === "aw_rpa_demo");
      
      // Lấy role từ kết quả tìm kiếm (nếu có)
      const role = roleItem ? roleItem.role : null;
      
      const validLocales = ['vi', 'en', 'cn'];
      const userLanguage = user.language?.toLowerCase() || 'en';
      const locale = validLocales.includes(userLanguage) ? userLanguage : 'en';
      
      // Set the locale
      this.$i18n.setLocale(locale);
      $nuxt.$emit("change-locale", locale);
      this.$vuetify.lang.current = locale;
      
      this.$session.set("aw_rpa_demo", {
        id: user.id,
        empno: user.empno,
        name: user.name, 
        username: user.username,
        dept: user.dept,
        hight_dept: user.high_dept,
        location: user.location,
        email: user.email,
        role: role,
        language: user.language,
      }); 
      this.loaded = true
    },
    
    locale(tg) {
      this.$i18n.setLocale(tg);
      $nuxt.$emit("change-locale", tg);
      this.$vuetify.lang.current = tg;
    },
  },
  computed: {},
  mounted() {
    if (this.$session.has("aw_rpa_demo")) {
      this.activeUser = this.$session.get("aw_rpa_demo");
    } else {
      this.$router.push({
        path: "/",
      });
    }
  },
};
</script>
