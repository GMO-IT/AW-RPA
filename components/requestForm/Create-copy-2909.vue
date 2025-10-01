<template>
  <v-row>
    <v-col cols="12" class="pb-0">
      <v-card class="mb-0">
        <div class="progress-bar" />
        <v-toolbar dense color="teal">
          <v-btn
          @click="closeDialogCreate()"
          nuxt
          small
          class="mr-2"
          color="orange"
          dark
          >
          <v-icon>mdi-keyboard-backspace</v-icon>
        </v-btn>
        <v-icon dark left>mdi-google-classroom</v-icon>
        <v-toolbar-title
        class="white--text"
        :title="$t('Create repaire request')"
        >
        {{ $t("Create repair request") }} ( {{ activeUser ? activeUser.empno : "" }} - {{ activeUser ? activeUser.dept : ""}} )
      </v-toolbar-title>
      <v-spacer />
      <div>
        <v-btn class="white--text" @click="locale('vi')" text>VI</v-btn>
        <v-btn class="white--text" @click="locale('en')" text>EN</v-btn>
        <v-btn class="white--text" @click="locale('cn')" text>中文</v-btn>
      </div>
    </v-toolbar>
  </v-card>
</v-col>
<v-col cols="12" class="pt-0">
  <VfaAppFlow
  v-if="activeUser && activeUser.empno"
  v-show="false"
  ref="AppFlow"
  appCode="aw_rpa_demo_display"
  :empno="activeUser.empno"
  :location="activeUser.location"
  @sendAppFlow="handleAppFlow"  
  ></VfaAppFlow>

      <v-card class="elevation-3">
      <v-card-text class="pa-0">
        <v-stepper flat>
          <v-stepper-header>
            <template v-for="(flow, index) in dataAppFlowChanged">
              <v-stepper-step
              v-if="true"
              color="red"
              class="font-weight-regular"
              complete
              :key="index"
              >
              <template v-if="flow.level === 'level1'">
                {{ $t("Department Manager") }} <br />
              </template>
              <template v-else-if="flow.level === 'level2'">
                {{ $t("Division Manager") }} <br />
              </template>
              <template v-else-if="flow.level === 'level3'">
                {{ $t("General Manager Office") }} <br />
              </template>
              <template v-else-if="flow.level === 'level4'">
                {{ $t("Department Manager") }} <br />
              </template>
       
              <template v-else> {{ flow.level }} <br /> </template>
              {{ flow.managers.map((m) => m.name).join(", ") }}
              <br />
              <template v-for="(m, mi) in flow.managers">
                <span
                v-for="(d, di) in getActiveDeputies(m.deputies)"
                :key="index + '-' + mi + '-' + di + 'd'"
                >
                {{ d.name }}
                <span v-if="di !== getActiveDeputies(m.deputies).length - 1">{{
                  ", "
                }}</span>
              </span>
              <span
              v-if="
              mi !== flow.managers.length - 1 &&
              m.deputies.length &&
              getActiveDeputies(m.deputies).length
              "
              :key="index + '-' + mi + 'flow'"
              >{{ ", " }}</span>
            </template>
          </v-stepper-step>
          <v-divider
          :key="index + 'd'"
          v-if="index < dataAppFlowChanged.length - 1"
          />
        </template>
      </v-stepper-header>
    </v-stepper>
  </v-card-text>
</v-card>


  <v-card elevation="12" class="pa-3">
    <v-row>
      <v-col cols="3" v-if="activeUser && activeUser.empno">
        <span style="font-size:19px; font-weight: 500;">{{ $t("Submitter") }}:</span>
        <v-form ref="inputForm">
          <div class="d-flex">
            <v-text-field
            hide-details=""
            disabled
            class="mr-2 pb-2"
            readonly
            dense
            :label="$t('Empno')"
            v-model="activeUser.empno"
            outlined
            ></v-text-field>
            <v-text-field
            hide-details=""
            disabled
            readonly
            dense
            :label="$t('Name')"
            v-model="activeUser.name"
            outlined
            ></v-text-field>
          </div>
          <div class="d-flex">
            <v-text-field
            hide-details=""
            disabled
            class="mr-2 pb-2"
            readonly
            dense
            :label="$t('Department')"
            v-model="activeUser.dept"
            outlined
            ></v-text-field>
            <v-text-field
            hide-details=""
            disabled
            readonly
            dense
            :label="$t('Division')"
            v-model="activeUser.hight_dept"
            outlined
            ></v-text-field>
          </div>
          
          <div class="d-flex">
            <v-text-field
            disabled
            hide-details
            class="mr-2 pb-2"
            type="date"
            dense
            :label="$t('Date Request')"
            v-model="dateRequest"
            outlined
            style="width: 290px"
            ></v-text-field>
            <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
            >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
              v-model="dateNeed"
              readonly
              hide-details
              dense
              outlined
              :label="$t('Date Need')"
              :rules="[(v) => !!v || $t('cannot be left blank')]"
              :append-icon="'mdi-calendar'"
              v-bind="attrs"
              v-on="on"
              style="width: 290px"
              @click:append="menu = true"
              >
              <template v-slot:label>
                <span style="color: red; font-size: 18px">*</span>
                {{ $t("Date Need") }}
              </template>
            </v-text-field>
          </template>
          <v-date-picker
          v-model="dateNeed"
          :min="dateRequest"
          scrollable
          @input="menu = false"
          />
        </v-menu>
      </div>
      
      
      <div class="d-flex">
        <v-text-field
        hide-details=""
        class="mr-2"
        dense
        v-model="ext_no"
        :label="$t('Extension no')"
        :rules="[(v) => !!v || $t('cannot be left blank')]"
        outlined
        >
        <template v-slot:label>
          <span style="color: red; font-size: 18px">*</span>
          {{ $t("Extension no") }}
        </template></v-text-field
        >
        <v-text-field
        hide-details=""
        dense
        v-model="inputLocation"
        :label="$t('location')"
        :rules="[(v) => !!v || $t('cannot be left blank')]"
        outlined
        >
        <template v-slot:label>
          <span style="color: red; font-size: 18px">*</span>
          {{ $t("location") }}
        </template></v-text-field
        >
      </div>
      
      <div class="d-flex" style="align-items: center">
        <h3 class="mr-6">
          <span style="color: red; font-size: 15px">*</span>
          {{ $t("Select Area") }}
        </h3>
        <v-radio-group v-model="selectedArea" row class="my-3" hide-details>
          <v-radio
          hide-details
          v-for="(item, index) in itemsArea"
          :key="index"
          :label="typeof item === 'string' ? item.toUpperCase() : ''"
          :value="item"
          ></v-radio>
        </v-radio-group>
      </div>
      
      <v-card
      elevation="12"
      class="px-4 pt-0"
      style="max-height: 250px; overflow-y: auto"
      >
      <v-card-title class="pa-0 mb-0" :title="$t('Select type')"
      ><span style="color: red; font-size: 15px">*</span>
      {{ $t("Select type") }}:</v-card-title
      >
      <v-radio-group v-model="type_selected" :rules="[(v) => !!v || $t('cannot be left blank')]">
        <v-row>
          <v-col
          v-for="item in itemsType"
          :key="item.id"
          cols="6"
          class="py-1"
          >
          <v-radio :value="item.value">
            <template v-slot:label>
              <span>{{ $t(item.text) }}</span>
            </template>
          </v-radio>
        </v-col>
      </v-row>
    </v-radio-group>
  </v-card>
</v-form>

<div class="d-flex" style="justify-content: space-between;">
  <v-btn
  class="mt-2"
  color="teal"
  dark
  dense
  @click="triggerFileInput"
  >
  {{ $t('Upload File attachment ( if any )') }}
</v-btn>

<!-- Input tải file ẩn -->
<v-file-input
ref="fileInput"
dense
counter
show-size
multiple
truncate-length="20"
style="display: none"
@change="addFiles" 
></v-file-input>

<!-- Nút tải thêm file (dấu +) -->
<v-btn
v-if="attachmentFiles.length"
class="mt-2"
outlined
dense
@click="triggerFileInput"
icon
color="teal"
title="Add more files / Thêm tệp / 添加更多文件"
>
<v-icon>mdi-plus</v-icon>
</v-btn>
<v-btn
v-if="attachmentFiles.length"
class="mt-2"
outlined
dense
@click="removeAllFileAttachment"
icon
color="error"
title="Delete all files / Xóa tất cả các tệp / 删除所有文件"
>
<v-icon>mdi-delete</v-icon>
</v-btn>
</div>

<!-- Danh sách file -->
<v-card outlined class="mt-1">
  <!-- Tiêu đề của danh sách file -->
  <v-card-title class="pl-1 pt-1 pb-0 text-h6">
    {{ $t("List of attachments") }}: {{ attachmentFiles.length }}
  </v-card-title>
  
  <!-- Nội dung danh sách file -->
  <v-card-text style="max-height: 150px; overflow-y: auto">
    <v-list class="my-0 py-0" v-if="attachmentFiles.length > 0">
      <v-list-item-group>
        <v-list-item
        v-for="(file, index) in attachmentFiles"
        :key="index"
        :style="{
          borderBottom: index !== attachmentFiles.length - 1 ? '3px dotted #e0e0e0' : 'none',
          paddingBottom: '1px',
          paddingTop: '5px'
        }"
        >
        <v-list-item-content class="my-0 py-0">
          <v-list-item-title>{{ file.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ formatFileSize(file.size) }}</v-list-item-subtitle>
        </v-list-item-content>
        <!-- Icon xóa file -->
        <v-list-item-action class="my-0 py-0">
          <v-btn @click="removeFile(index)" icon style="margin-top: 0px; padding-top: 0px;" title="Delete this file / xóa tệp / 刪除這個文件">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list-item-group>
  </v-list>
  <br />
</v-card-text>
</v-card>

</v-col>
<v-col cols="9" class="pt-0">
  <v-card elevation="12" class="px-4 py-2">
    <v-text-field
  v-model="testTranslate"
  label="Test translate"
  outlined
  clearable
/>
<v-btn
  color="teal"
  class="mt-2"
  :loading="isTestingTranslate"
  :disabled="!testTranslate || isTestingTranslate"
  @click="callTranslateApi"
>
  Gửi API /api/translate
</v-btn>

<!-- Hiển thị kết quả -->
<pre v-if="translateResp" class="mt-3" style="white-space:pre-wrap">{{ pretty(translateResp) }}</pre>
<p v-if="translateErr" class="red--text mt-2">{{ translateErr }}</p>

    <v-card-title class="pa-0 mb-0" :title="$t('Category Name')"
    ><span style="color: red; font-size: 15px">*</span
      >{{ $t("Category Name:") }}</v-card-title
      >
      <!-- category name -->
      <v-form ref="inputForm2">
        <div class="mb-3">
          <div class="d-flex">
            <v-text-field
            dense
            @change="helpTransAutoCategory('vi')"
            hide-details=""
            v-model="categoryName.vi"
            :label="$t('Category VI')"
            outlined
            clearable
            :append-icon="'mdi-translate'"
            @click:append="categoryHelpTransCLick('vi')"
            :rules="[(v) => !!v || $t('cannot be left blank')]"
            ></v-text-field>
            
            <v-text-field
            class="mx-3"
            dense
            @change="helpTransAutoCategory('en')"
            hide-details=""
            v-model="categoryName.en"
            :label="$t('Category EN')"
            outlined
            clearable
            :append-icon="'mdi-translate'"
            @click:append="categoryHelpTransCLick('en')"
            :rules="[(v) => !!v || $t('cannot be left blank')]"
            ></v-text-field>
            
            <v-text-field
            dense
            @change="helpTransAutoCategory('cn')"
            hide-details=""
            v-model="categoryName.cn"
            :label="$t('Category CN')"
            outlined
            clearable
            :append-icon="'mdi-translate'"
            @click:append="categoryHelpTransCLick('cn')"
            :rules="[(v) => !!v || $t('cannot be left blank')]"
            ></v-text-field>
          </div>
        </div>
      </v-form>
      
      <v-row>
        <v-col cols="6">
          <v-card-title class="pa-0 mb-0" :title="$t('Asset Code')">{{
            $t("Asset Code")
          }}</v-card-title>
          <v-textarea
          class="pt-0"
          rows="9"
          hide-details=""
          v-model="assetCode"
          :label="$t('Asset Code')"
          outlined
          clearable
          ></v-textarea>
        </v-col>
        
        <v-col cols="6">
          <!-- Cause of the problem: -->
          <v-card-title
          class="pa-0 mb-0"
          :title="$t('Cause of the problem:')"
          >
          <span style="color: red; font-size: 15px">*</span
            >{{ $t("Cause of the problem:") }}
          </v-card-title>
          
          <v-form ref="inputForm3">
            <v-tabs background-color="teal" color="yellow" grow dark>
              <!-- Tabs -->
              <v-tab>{{ $t("Problem VI") }}</v-tab>
              <v-tab>{{ $t("Problem EN") }}</v-tab>
              <v-tab>{{ $t("Problem CN") }}</v-tab>
              
              <!-- Tab Items -->
              
              <v-tab-item>
                <v-textarea
                class="pt-2"
                dense
                hide-details=""
                v-model="problem.vi"
                outlined
                clearable
                rows="7"
                :label="$t('Problem VI')"
                :append-icon="'mdi-translate'"
                @change="helpTransAutoProblem('vi')"
                @click:append="problemHelpTransCLick('vi')"
                :rules="[(v) => !!v || $t('cannot be left blank')]"
                ></v-textarea>
              </v-tab-item>
              
              <v-tab-item>
                <v-textarea
                class="pt-2"
                dense
                hide-details=""
                v-model="problem.en"
                outlined
                clearable
                rows="7"
                :label="$t('Problem EN')"
                :append-icon="'mdi-translate'"
                @change="helpTransAutoProblem('en')"
                @click:append="problemHelpTransCLick('en')"
                :rules="[(v) => !!v || $t('cannot be left blank')]"
                ></v-textarea>
              </v-tab-item>
              
              <v-tab-item>
                <v-textarea
                class="pt-2"
                dense
                hide-details=""
                v-model="problem.cn"
                outlined
                clearable
                rows="7"
                :label="$t('Problem CN')"
                :append-icon="'mdi-translate'"
                @change="helpTransAutoProblem('cn')"
                @click:append="problemHelpTransCLick('cn')"
                :rules="[(v) => !!v || $t('cannot be left blank')]"
                ></v-textarea>
              </v-tab-item>
            </v-tabs>
          </v-form>
        </v-col>
        
      </v-row>
    </v-card>
    <v-row>
      <h3 class="mt-6 ml-4">
        {{ $t("***Note: ") }}<span style="color: red">(*)</span>
        {{
          $t(
          " is a required field, please pay attention before submitting"
          )
        }}
      </h3>
      <v-spacer></v-spacer>
      <v-btn
        x-large
        color="primary"
        class="mr-5 my-5"
        @click="saveDataRequest()"
        :disabled="!isFormSubmitValid"
      >
        {{ $t("Submit") }}
      </v-btn>
  </v-row>
</v-col>
</v-row>
</v-card>
</v-col>
</v-row>
</template>
<script>
import dayjs, { Dayjs } from "dayjs";
import auth from "~/components/auth";
import VfaAppFlow from "../../../../@global-component/vfa-updated2"; //vfa-app-flow
export default {
  components: { VfaAppFlow, auth },
  data() {
    return {
       testTranslate: '',
    isTestingTranslate: false,
    translateResp: null,
    translateErr: null,

      menu: false,
      api: "http://gmo021.cansportsvg.com/api/rpaAwDemo/",
      apiglbuser: "http://gmo021.cansportsvg.com/api/global/",
      msgApi: "http://gmo021.cansportsvg.com/api/msg-center/sendOutMsg",
      
      activeUser: null,
      type_selected: null,
      itemsType: [
      { text: this.$t("Machinery & Equipment"), value: "machine" },
      { text: this.$t("Molds"), value: "molds" },
      { text: this.$t("Electricity/water"), value: "electricity" },
      { text: this.$t("Renovation"), value: "renovation" },
      { text: this.$t("Other"), value: "other" },
      ],
      categoryName: {
        vi: null,
        en: null,
        cn: null,
      },
      problem: {
        vi: null,
        en: null,
        cn: null,
      },
      
      dateRequest: this.getCurrentDate(),
      dateNeed: null,
      dataAppFlowChanged: [],
      listEmailDeptManager: [],
      itemsArea: [],
      uploadAttachmentDialog: false,
      attachmentFiles: [],
      selectedArea: "aw",
      inputLocation: "",
      assetCode: "",
      ext_no: "",
    };
  },
  methods: {
     pretty(obj) {
    try { return JSON.stringify(obj, null, 2) } catch(e) { return String(obj) }
  },
  async callTranslateApi() {
    this.isTestingTranslate = true
    this.translateResp = null
    this.translateErr = null
    try {
      const body = {
        text: this.testTranslate,
        targetLangs: ['vi', 'zh-tw'],   // cần ngôn ngữ nào thì chỉnh ở đây
        model: 'qwen3-8b',
        source: 'hrm'
      }
      const res = await this.$axios.post(
        'http://gmo021.cansportsvg.com:49200/api/translate',
        body,
        { headers: { 'Content-Type': 'application/json' } }
      )
      this.translateResp = res.data
    } catch (e) {
      // Bắt lỗi rõ ràng (kể cả CORS/Network Error)
      if (e.response) {
        this.translateErr = `HTTP ${e.response.status}: ${JSON.stringify(e.response.data)}`
      } else {
        this.translateErr = e.message || 'Network Error'
      }
    } finally {
      this.isTestingTranslate = false
    }
  },

      getActiveDeputies(deputies) {
      // Filter deputies to only include active ones
      return deputies.filter(d => d.status);
    },
    triggerFileInput() {
      this.$refs.fileInput.$el.querySelector('input').click();
    },
    
    // Thêm file mới vào danh sách
    addFiles(newFiles) {
      const filesArray = Array.from(newFiles); // Chuyển FileList thành mảng
      this.attachmentFiles = this.attachmentFiles.concat(filesArray); // Kết hợp danh sách
    },
    
    // Xóa file khỏi danh sách
    removeFile(index) {
      if (!confirm(this.$t("Are you sure you want to delete this files attachment? \n Bạn có chắc chắn muốn xóa tệp đính kèm này không? \n 您確定要刪除該文件附件嗎?"))) 
      {
        return;
      }
      this.attachmentFiles.splice(index, 1);
    },
    removeAllFileAttachment() {
      if (!confirm(this.$t("Are you sure you want to delete all files attachment? \n Bạn có chắc chắn muốn xóa tất cả các tệp đính kèm không? \n 你确定要删除所有附件吗?"))) 
      {
        return;
      }
      
      this.attachmentFiles = [];
    },
    
    // Định dạng kích thước file
    formatFileSize(size) {
      if (size < 1024) return `${size} B`;
      else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
      else return `${(size / 1048576).toFixed(2)} MB`;
    },
    
    closeUploadAttachmentDialog() {
      this.attachmentFiles = [];
      this.uploadAttachmentDialog = false;
    },
    
    async getArea() { 
      let params = {
        // area: this.activeUser.selectedLocation,
        area: this.activeUser.location,
      };
      await this.$axios.post(this.api + "getArea", params).then((res) => {
        if (res.status === 200) {
          this.itemsArea = res.data;
        } else {
          alert("error getArea", Error); 
        }
      });
    },
    handleAppFlow(appFlow) {
      //console.log("appFlow", appFlow);
      this.dataAppFlow = appFlow.map((item, index) => ({
        level: "level" + (index + 1),
        managers: item.managers.map((x) => {
          return {
            email: x.email,
            empno: x.empno,
            name: x.name,
            dept: x.dept_code,
            deputies: x.deputies,
          };
        }),
      }));
      this.dataAppFlowChanged = this.dataAppFlow;
      const level1 = this.dataAppFlowChanged.find(
      (item) => item.level === "level1"
      );
      
      if (level1) {
        this.listEmailDeptManager = level1.managers.reduce((acc, manager) => {
          // Thêm email của manager
          acc.push(manager.email);
          
          // Thêm email của deputies có status === true
          manager.deputies
          .filter((deputy) => deputy.status === true)
          .forEach((deputy) => acc.push(deputy.email));
          
          return acc;
        }, []);
      }
          if (level1) {
  // Tạo bản sao sâu, đổi tên level để không va chạm
  const virtualLevel1 = JSON.parse(JSON.stringify(level1));
  virtualLevel1.level = "level4";

  // Tránh chèn trùng nếu đã tồn tại
  const existsVirtual = this.dataAppFlowChanged.some(x => x.level === "level4");
  if (!existsVirtual) {

    this.dataAppFlowChanged.push(virtualLevel1);

  }
}
    },
    async saveDataRequest() {
      const isForm1Valid = this.$refs.inputForm.validate();
      const isForm2Valid = this.$refs.inputForm2.validate();
      const isForm3Valid = this.$refs.inputForm3.validate();
      
      if (!isForm1Valid || !isForm2Valid || !isForm3Valid) return;
      
      const isConfirmed = window.confirm("Bạn chắc chắn muốn gửi yêu cầu này? \n Are you sure you want to submit this request? \n 你确定要提交此请求吗?");
      if (!isConfirmed) return;
      
      let formData = new FormData();
      // Thêm các thông tin khác vào FormData
      formData.append("submitter[empno]", this.activeUser.empno);
      formData.append("submitter[name]", this.activeUser.name);
      formData.append("submitter[dept]", this.activeUser.dept);
      formData.append("submitter[high_dept]", this.activeUser.hight_dept);
      formData.append("submitter[email]", this.activeUser.email);
      formData.append("submitter[ext_no]", this.ext_no);
      formData.append("dateRequest", this.dateRequest);
      formData.append("type_selected", this.type_selected);
      formData.append("categoryName[vi]", this.categoryName.vi);
      formData.append("categoryName[en]", this.categoryName.en);
      formData.append("categoryName[cn]", this.categoryName.cn);
      formData.append("problem[vi]", this.problem.vi ?? this.problem.en ?? this.problem.cn ?? "");
      formData.append("problem[en]", this.problem.en ?? this.problem.vi ?? this.problem.cn ?? "");
      formData.append("problem[cn]", this.problem.cn ?? this.problem.en ?? this.problem.vi ?? "");
      formData.append("listEmailDeptManager", this.listEmailDeptManager);
      formData.append("area", this.selectedArea);
      formData.append("location", this.inputLocation);
      formData.append("date_need", this.dateNeed);
      formData.append("asset_code", this.assetCode);
      
      // Thêm các tệp đính kèm vào FormData
      this.attachmentFiles.forEach((file, index) => {
        formData.append(`attachmentFiles[${index}]`, file);
      });
      
      // Gửi dữ liệu qua axios
      await this.$axios
      .post(this.api + "saveNewRequest", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          this.attachmentFiles = [];
          // alert("success");
          this.$emit("closeDialogCreate");
          this.closeDialogCreate();
        } else {
          alert(this.$t("error saveDataRequest"), this.$t("createError"));
        }
      })
      .catch((error) => {
        alert(this.$t("error saveDataRequest"), this.$t("networkError"));
      });
    },
    
    async helpTransAutoProblem(target) {
      let codeMap = {
        vi: "secret-v",
        en: "secret-e",
        cn: "secret-c",
      };
      
      let translationPairs = {
        vi: ["en", "cn"],
        en: ["vi", "cn"],
        cn: ["vi", "en"],
      };
      
      let translate = async (sourceLang, targetLang) => {
        let formData = new FormData();
        formData.append("type", codeMap[targetLang]);
        formData.append("string", this.problem[sourceLang]);
        
        await this.$axios
        .post(
        "http://gmo021.cansportsvg.com/public/gg-trans/curl.php",
        formData
        )
        .then((res) => {
          if (res.status == 200) {
            this.$set(this.problem, targetLang, res.data);
          }
        })
        .catch((err) => {
          console.log("helpTransAutoProblem", err);
          alert(this.$t("error helpTransAutoProblem"), err);
        });
      };
      
      if (this.problem[target]) {
        for (let lang of translationPairs[target]) {
          if (!this.problem[lang]) {
            await translate(target, lang);
          }
        }
      }
    },
    
    async problemHelpTransCLick(target) {
      if (target == "vi") {
        if (this.problem.en || this.problem.cn) {
          // let code = (target === 've') ? 'secret-e' : 'secret-c';
          let code = "secret-v";
          let formData = new FormData();
          formData.append("type", code);
          if (this.problem.en) {
            formData.append("string", this.problem.en);
          } else {
            formData.append("string", this.problem.cn);
          }
          await this.$axios
          .post(
          "http://gmo021.cansportsvg.com/public/gg-trans/curl.php",
          formData
          )
          .then((res) => {
            if (res.status == 200) {
              this.$set(this.problem, "vi", res.data);
            }
          })
          .catch((err) => {
            console.log("categoryHelpTransCLick", err);
            alert(this.$t("error categoryHelpTransCLick VI"), err);
          });
        }
      }
      if (target == "en") {
        if (this.problem.vi || this.problem.cn) {
          // let code = (target === 've') ? 'secret-e' : 'secret-c';
          let code = "secret-e";
          let formData = new FormData();
          formData.append("type", code);
          if (this.problem.vi) {
            formData.append("string", this.problem.vi);
          } else {
            formData.append("string", this.problem.cn);
          }
          await this.$axios
          .post(
          "http://gmo021.cansportsvg.com/public/gg-trans/curl.php",
          formData
          )
          .then((res) => {
            if (res.status == 200) {
              this.$set(this.problem, "en", res.data);
            }
          })
          .catch((err) => {
            console.log("Err", err);
            alert(this.$t("error categoryHelpTransCLick EN"), err);
          });
        }
      }
      if (target == "cn") {
        if (this.problem.vi || this.problem.en) {
          // let code = (target === 've') ? 'secret-e' : 'secret-c';
          let code = "secret-c";
          let formData = new FormData();
          formData.append("type", code);
          if (this.problem.vi) {
            formData.append("string", this.problem.vi);
          } else {
            formData.append("string", this.problem.en);
          }
          await this.$axios
          .post(
          "http://gmo021.cansportsvg.com/public/gg-trans/curl.php",
          formData
          )
          .then((res) => {
            if (res.status == 200) {
              this.$set(this.problem, "cn", res.data);
            }
          })
          .catch((err) => {
            console.log("Err", err);
            alert(this.$t("error categoryHelpTransCLick CN"), err);
          });
        }
      }
    },
    //////////////////////////////////////////
    async helpTransAutoCategory(target) {
      let codeMap = {
        vi: "secret-v",
        en: "secret-e",
        cn: "secret-c",
      };
      
      let translationPairs = {
        vi: ["en", "cn"],
        en: ["vi", "cn"],
        cn: ["vi", "en"],
      };
      
      let translate = async (sourceLang, targetLang) => {
        let formData = new FormData();
        formData.append("type", codeMap[targetLang]);
        formData.append("string", this.categoryName[sourceLang]);
        
        await this.$axios
        .post(
        "http://gmo021.cansportsvg.com/public/gg-trans/curl.php",
        formData
        )
        .then((res) => {
          if (res.status == 200) {
            this.$set(this.categoryName, targetLang, res.data);
          }
        })
        .catch((err) => {
          console.log("categoryHelpTransClick", err);
          alert(this.$t("error helpTransAutoCategory"), err);
        });
      };
      
      if (this.categoryName[target]) {
        for (let lang of translationPairs[target]) {
          if (!this.categoryName[lang]) {
            await translate(target, lang);
          }
        }
      }
    },
    
    async categoryHelpTransCLick(target) {
      if (target == "vi") {
        if (this.categoryName.en || this.categoryName.cn) {
          // let code = (target === 've') ? 'secret-e' : 'secret-c';
          let code = "secret-v";
          let formData = new FormData();
          formData.append("type", code);
          if (this.categoryName.en) {
            formData.append("string", this.categoryName.en);
          } else {
            formData.append("string", this.categoryName.cn);
          }
          await this.$axios
          .post(
          "http://gmo021.cansportsvg.com/public/gg-trans/curl.php",
          formData
          )
          .then((res) => {
            if (res.status == 200) {
              this.$set(this.categoryName, "vi", res.data);
            }
          })
          .catch((err) => {
            console.log("categoryHelpTransCLick", err);
            alert(this.$t("error categoryHelpTransCLick VI"), err);
          });
        }
      }
      if (target == "en") {
        if (this.categoryName.vi || this.categoryName.cn) {
          // let code = (target === 've') ? 'secret-e' : 'secret-c';
          let code = "secret-e";
          let formData = new FormData();
          formData.append("type", code);
          if (this.categoryName.vi) {
            formData.append("string", this.categoryName.vi);
          } else {
            formData.append("string", this.categoryName.cn);
          }
          await this.$axios
          .post(
          "http://gmo021.cansportsvg.com/public/gg-trans/curl.php",
          formData
          )
          .then((res) => {
            if (res.status == 200) {
              this.$set(this.categoryName, "en", res.data);
            }
          })
          .catch((err) => {
            console.log("Err", err);
            alert(this.$t("error categoryHelpTransCLick EN"), err);
          });
        }
      }
      if (target == "cn") {
        if (this.categoryName.vi || this.categoryName.en) {
          // let code = (target === 've') ? 'secret-e' : 'secret-c';
          let code = "secret-c";
          let formData = new FormData();
          formData.append("type", code);
          if (this.categoryName.vi) {
            formData.append("string", this.categoryName.vi);
          } else {
            formData.append("string", this.categoryName.en);
          }
          await this.$axios
          .post(
          "http://gmo021.cansportsvg.com/public/gg-trans/curl.php",
          formData
          )
          .then((res) => {
            if (res.status == 200) {
              this.$set(this.categoryName, "cn", res.data);
            }
          })
          .catch((err) => {
            console.log("Err", err);
            alert(this.$t("error categoryHelpTransCLick CN"), err);
          });
        }
      }
    },
    
    getCurrentDate() {
      // Trả về ngày hiện tại dưới dạng 'YYYY-MM-DD'
      const today = new Date();
      return today.toISOString().substr(0, 10);
    },
    
    closeDialogCreate() {
      this.$emit("closeDialogCreate");
    },
    locale(tg) {
      this.$i18n.setLocale(tg);
      this.$root.$emit("change-locale", tg); // Use $root instead of $nuxt
      this.$vuetify.lang.current = tg;
    },
  },
  computed: {
    isFormSubmitValid() {
      return (
        // Required user inputs
        this.ext_no &&
        this.inputLocation &&
        this.selectedArea &&
        this.dateNeed &&
        this.type_selected &&
        // Category name validations
        this.categoryName.vi &&
        this.categoryName.en &&
        this.categoryName.cn &&
        // Problem description validations 
        this.problem.vi &&
        this.problem.en &&
        this.problem.cn
      );
    }
  },
  watch: {
    attachmentFiles(newValue, oldValue) {
      console.log("Attachment files changed:", newValue);
    },
  },
  created() {},
  mounted() {
    this.activeUser = this.$session.get("aw_rpa_demo");
    this.getArea();
  },
};
</script>
<style scoped>
.v-data-table {
  white-space: nowrap !important;
}
.time-label {
  min-width: 40px;
}
.time-select {
  width: 100px;
}
.colorSelectedArea {
  background-color: teal !important;
  color: white !important; /* Thêm màu chữ trắng để dễ đọc */
}
.v-tabs {
  border-bottom: 1px solid #ccc;
}
.v-tab {
  text-transform: uppercase;
  font-weight: bold;
}
</style>
<i18n>
  {
    "en": {
      "List of attachments": "List of attachments",
      "***Note: ": "***Note: ",
      " is a required field, please pay attention before submitting": " is a required field, please pay attention before submitting",
      "Asset": "Asset",
      "Asset2": "Asset",
      "Equipment": "Equipment",
      "Machinery & Equipment": "Machinery & Equipment",
      "Molds": "Molds",
      "Electricity/water": "Electricity/water",
      "Renovation": "Renovation",
      "Other": "Other",
      "Create repair request": "Create repair request",
      "Submitter": "Submitter",
      "Department": "Department",
      "Division": "Division",
      "Date Request": "Date Request",
      "Select type": "Select type",
      "Category Name:": "Category Name:",
      "Category VI": "Category (VI)",
      "Category EN": "Category (EN)",
      "Category CN": "Category (CN)",
      "Cause of the problem:": "Cause of the problem:",
      "Problem VI": "Problem (VI)",
      "Problem EN": "Problem (EN)",
      "Problem CN": "Problem (CN)",
      "Submit": "Submit",
      "End time must be after start time": "End time must be after start time",
      "Empno": "Employee Number",
      "Name": "Name",
      "Extension no": "Extension Number",
      "location": "Location",
      "Select Area": "Select Area",
      "Upload File attachment ( if any )": "Upload File attachment ( if any )",
      "Asset Code": "Asset Code",
      "Date Need": "Date Need"
    },
    "vi": {
      "List of attachments": "Danh sách tệp đính kèm",
      "***Note: ": "***Lưu ý: ",
      " is a required field, please pay attention before submitting": " là trường bắt buộc, vui lòng chú ý trước khi gửi",
      "Asset": "Tài sản",
      "Equipment": "Dụng cụ",
      "Machinery & Equipment": "Máy móc - thiết bị",
      "Molds": "Khuôn mẫu",
      "Electricity/water": "Điện nước",
      "Renovation": "Tu bổ công trình",
      "Other": "Khác",
      "Create repair request": "Tạo yêu cầu sửa chữa",
      "Submitter": "Người gửi",
      "Department": "Phòng ban",
      "Division": "Bộ phận",
      "Date Request": "Ngày yêu cầu",
      "Select type": "Chọn loại",
      "Category Name:": "Tên hạng mục:",
      "Category VI": "Hạng mục (VI)",
      "Category EN": "Hạng mục (EN)",
      "Category CN": "Hạng mục (CN)",
      "Cause of the problem:": "Nguyên nhân vấn đề:",
      "Problem VI": "Vấn đề (VI)",
      "Problem EN": "Vấn đề (EN)",
      "Problem CN": "Vấn đề (CN)",
      "Submit": "Gửi",
      "End time must be after start time": "Thời gian kết thúc phải sau thời gian bắt đầu",
      "Empno": "Mã nhân viên",
      "Name": "Tên",
      "Extension no": "Số máy nội bộ",
      "location": "Vị trí sửa chữa",
      "Select Area": "Chọn khu vực",
      "Upload File attachment ( if any )": "Tải tệp đính kèm ( nếu có )",
      "Asset Code": "Mã tài sản",
      "Date Need": "Ngày cần"
    },
    "cn": {
      "List of attachments": "附件清单",
      "***Note: ": "***注意: ",
      " is a required field, please pay attention before submitting": " 是必填字段，请在提交之前注意",
      "Asset": "资产",
      "Equipment": "设备",
      "Machinery & Equipment": "機器設備",
      "Molds": "模具",
      "Electricity/water": "水電",
      "Renovation": "工程修繕",
      "Other": "其他",
      "Create repair request": "创建维修请求",
      "Submitter": "提交者",
      "Department": "部门",
      "Division": "部门",
      "Date Request": "请求日期",
      "Select type": "选择类型",
      "Category Name:": "类别名称:",
      "Category VI": "类别 (VI)",
      "Category EN": "类别 (EN)",
      "Category CN": "类别 (CN)",
      "Cause of the problem:": "问题原因:",
      "Problem VI": "问题 (VI)",
      "Problem EN": "问题 (EN)",
      "Problem CN": "问题 (CN)",
      "Submit": "提交",
      "End time must be after start time": "结束时间必须在开始时间之后",
      "Empno": "员工编号",
      "Name": "姓名",
      "Extension no": "分机号",
      "location": "位置",
      "Select Area": "选择区域",
      "Upload File attachment ( if any )": "上传附件文件（如果有）",
      "Asset Code": "资产代码",
      "Date Need": "需要日期"
    }
  }
</i18n>
