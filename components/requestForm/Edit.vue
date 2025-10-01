<template>
  <v-row>
    <DestinationCreate v-model="desDlg" @saved="desListing" />
    <auth></auth>
    <v-col cols="12">
      <v-card>
        <v-toolbar dense color="teal">
          <v-btn @click="closeDialogEdit()" nuxt small class="mr-2" color="orange" dark>
            <v-icon>mdi-keyboard-backspace</v-icon>
          </v-btn>
          <v-icon dark left>mdi-calendar-week-begin</v-icon>
          <v-toolbar-title class="white--text">
            {{ $t("Edit form") }}
          </v-toolbar-title>
          <v-spacer />
          <div> 
            <v-btn class="white--text" @click="locale('vi')" text>VI</v-btn>
            <v-btn class="white--text" @click="locale('en')" text>EN</v-btn>
            <v-btn class="white--text" @click="locale('cn')" text>中文</v-btn>
          </div>
        </v-toolbar>
        
        <!-- //v-show="(isHidden = false)" -->
        <VfaAppFlow v-show="false" ref="AppFlow" appCode="aw_rpa_demo" @sendAppFlow="handleAppFlow"></VfaAppFlow>
        
        <v-card class="elevation-3">
          <v-card-text class="pa-0">
            <!-- <strong>Signature flow:</strong> -->
            <v-stepper flat> 
              <v-stepper-header>
                <template v-for="(flow, index) in dataAppFlowChanged">
                  <v-stepper-step v-if="true" color="red" class="font-weight-regular" complete :key="index">
                    <template v-if="flow.level === 'level1'">
                      {{$t('Department Manager')}} <br />
                    </template>
                    <template v-else-if="flow.level === 'level2'">
                      {{ $t('Division Manager') }} <br />
                    </template>
                    <template v-else-if="flow.level === 'level3'">
                      {{ $t('Vice Chairman') }} <br />
                    </template>
                    <template v-else-if="flow.level === 'level4'">
                      {{ $t('Board Chairman') }} <br />
                    </template>
                    <template v-else-if="flow.level === 'level5'">
                      {{ $t('Human Resources (HR)') }} <br />
                    </template>
                    <template v-else>
                      {{ flow.level }} <br />
                    </template>
                    {{ flow.managers.map((m) => m.name).join(", ") }}
                  </v-stepper-step>
                  <v-divider  :key="index+'d'" v-if="index < dataAppFlowChanged.length - 1" />
                </template>
              </v-stepper-header>
            </v-stepper>
          </v-card-text>
        </v-card>
        
        <!-- lý do -->
        <v-row class="pa-3">
          <v-col cols="6"> 
            <v-card elevation="15">
              <v-card-text>
                <v-form ref="inputForm">
                  
                  
                  <div class="d-flex" style="align-items: center; justify-content: space-between">
                    <v-btn-toggle dense v-model="checkLocation" class="" style="color: white">
                      <v-btn style="border-color: rgb(0 0 0 / 18%) !important"
                      :outlined="checkLocation === 'domestic' ? false : true" color="teal" value="domestic">
                      <span class="hidden-sm-and-down" style="font-weight: 600">{{ $t("Domestic") }}</span>
                    </v-btn>
                    <v-btn style="border-color: rgb(0 0 0 / 18%) !important"
                    :outlined="checkLocation === 'foreign' ? false : true" color="teal" value="foreign">
                    <span class="hidden-sm-and-down" style="font-weight: 600">{{ $t("Foreign") }}</span>
                  </v-btn>
                  <v-btn style="border-color: rgb(0 0 0 / 18%) !important"
                  :outlined="checkLocation === 'group' ? false : true" color="teal" value="group">
                  <span class="hidden-sm-and-down" style="font-weight: 600">{{ $t("Group Domestic") }}</span>
                </v-btn>
              </v-btn-toggle>
              
              <div>
                <v-tooltip top color="teal">
                  <template v-slot:activator="{ on, attrs }">
                    <div class="d-flex" style="align-items: center" v-bind="attrs" v-on="on">
                      <v-icon style="margin-top: -5px;">mdi-update</v-icon>
                      <h4 style="margin-right: 5px">
                        {{ $t("Multiple day trip") }}
                      </h4>
                      <v-switch color="teal" v-model="is_multiple_date"></v-switch>
                    </div>
                  </template> 
                  <span>{{ $t("Turn on if your business trip is more than 1 day.") }}</span>
                </v-tooltip>
              </div>
              
              
              <div>
                <v-tooltip top color="teal">
                  <template v-slot:activator="{ on, attrs }">
                    <div class="d-flex" style="align-items: center" v-bind="attrs" v-on="on">
                      <v-icon style="margin-top: -5px;">mdi-car</v-icon>
                      <h4 style="margin-right: 5px">
                        {{ $t("Company vehicle") }}
                      </h4>
                      <v-switch color="teal" v-model="is_company_car"></v-switch>
                    </div>
                  </template>
                  <span>{{ $t("Turn it on to register to use a company vehicle on business trips.") }}</span>
                </v-tooltip>
              </div>
              
            </div>
            <div class="mb-3">
              
              <div class="d-flex">
                <v-combobox dense @change="reasonComboboxChange('reason_vi')"
                :items="reasonDataByDept.map((item) => item.reason_vi)" hide-details=""
                :rules="[(v) => !!v || 'Item is required']" v-model="reasonSelected.vi" :label="$t('Reason - VI')" outlined
                clearable :append-icon="'mdi-translate'" @click:append="helpTransCLick('vi')"></v-combobox>
                
              </div>
              
              <div class="d-flex my-3">
                <v-combobox dense @change="reasonComboboxChange('reason_en')"
                :items="reasonDataByDept.map((item) => item.reason_en)" hide-details=""
                :rules="[(v) => !!v || 'Item is required']" v-model="reasonSelected.en" :label="$t('Reason - EN')" outlined
                clearable :append-icon="'mdi-translate'" @click:append="helpTransCLick('en')"></v-combobox>
                
              </div>
              
              <div class="d-flex">
                <v-combobox dense @change="reasonComboboxChange('reason_cn')"
                :items="reasonDataByDept.map((item) => item.reason_cn)" hide-details=""
                :rules="[(v) => !!v || 'Item is required']" v-model="reasonSelected.cn" :label="$t('Reason - CN')" outlined
                clearable :append-icon="'mdi-translate'" @click:append="helpTransCLick('cn')"></v-combobox>
                
              </div>
            </div>
            <div style="margin-bottom: 15px">
              <div class="d-flex">
                <v-combobox outlined clearable hide-details="" :rules="[(v) => !!v || 'Item is required']"
                  required color="indigo" v-model="destination" item-disabled="VG" :items="desBtaListingComp"
                  item-text="curLang" :label="$t('Destination business trip')"
                  placeholder="Type-in for searching..." light dense :multiple="false">
                </v-combobox>
                <!-- <v-btn color="green" icon @click="dialogCreateNewDestinationBta = true">
                  <v-icon>mdi-map-marker-plus</v-icon>
                </v-btn> -->
              </div>
            </div>
            <!-- // thời gian đi -->
            <div class="d-flex">
              <v-text-field clearable  @input="checkDate" :min="crrDay" class="mr-2" type="date" outlined dense hide-details=""
              :label="$t('Start Date (MM/DD/YY)')" v-model="startTime.date"
              :rules="[(v) => !!v || $t('Item is required')]" required></v-text-field>
              <v-combobox @input="checkTime" class="d-inline float-left mr-2" outlined dense hide-details=""
              :rules="[(v) => !!v || 'Item is required']" :items="itemHours" v-model="startTime.hour"
              :label="$t('Hour')"></v-combobox>
              <v-combobox @input="checkTime" class="d-inline float-right mr-2" outlined dense hide-details=""
              :rules="[(v) => !!v || 'Item is required']" :items="itemMins" v-model="startTime.min"
              :label="$t('Min')"></v-combobox>
              <!-- // thời gian về -->
              
              <v-text-field clearable @input="checkDate" :min="startTime.date" class="mr-2" type="date" outlined dense
              hide-details="" :rules="[(v) => !!v || 'Item is required']" :label="$t('End Date (MM/DD/YY)')"
              v-model="endTime.date" required></v-text-field>
              <div class="d-flex">
                <v-combobox @input="checkTime" class="d-inline float-left mr-2" outlined dense hide-details=""
                :rules="[(v) => !!v || 'Item is required']" :items="itemHours" v-model="endTime.hour"
                :label="$t('Hour')"></v-combobox>
                <v-combobox @input="checkTime" class="d-inline float-right" outlined dense hide-details=""
                :rules="[(v) => !!v || 'Item is required']" :items="itemMins" v-model="endTime.min"
                :label="$t('Min')"></v-combobox>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
      <v-card v-if="is_company_car" class="mt-8">
        <v-card-text>
          <div style="margin-bottom: 12px">
            <div class="d-flex mb-2" style="align-items: center; justify-content: space-between;">
              <h3>{{ $t("Vehicle dispatch information") }}</h3>
              
              <!-- <v-tooltip top color="teal">
                <template v-slot:activator="{ on, attrs }">
                  <div
                  class="d-flex"
                  style="align-items: center"
                  v-bind="attrs"
                  v-on="on"
                  >
                  <v-icon style="margin-top: -5px">mdi-routes</v-icon>
                  <h4 style="margin-right: 5px">
                    {{ $t("Multiple route") }}
                  </h4>
                  <v-switch
                  class="mt-0 pt-0"
                  hide-details
                  color="teal"
                  v-model="is_multiple_route"
                  ></v-switch>
                </div>
              </template>
              <span>{{
                $t(
                "Turn on if your business trip is more than 1 route."
                )
              }}</span>
            </v-tooltip> -->
            
            <v-text-field
            class="ml-3 mr-3"
            style="max-width: 180px"
            outlined
            dense
            hide-details=""
            :label="$t('Cellphone')"
            v-model="cellPhone"
            ></v-text-field>
            <v-text-field
            style="max-width: 135px"
            outlined
            dense
            hide-details=""
            :label="$t('Extension no.')"
            v-model="extension_no"
            ></v-text-field>
          </div>
          <div class="d-flex">
            <v-combobox outlined clearable hide-details="" :rules="[(v) => !!v || 'Item is required']" required
              color="indigo" v-model="destination_transport" item-disabled="VG" :items="desListingComp"
              item-text="curLang" :label="$t('Destination - transport')" placeholder="Type-in for searching..."
              light dense :multiple="false">
            </v-combobox>
            
            <v-btn color="green" icon @click="desDlg = true">
              <v-icon>mdi-map-marker-plus</v-icon>
            </v-btn>
          </div>
        </div>
        
        <div class="d-flex">
          <v-text-field clearable  @input="checkDate_transport" class="mr-2" type="date" outlined dense hide-details=""
          :label="$t('Start Date (MM/DD/YY)')" v-model="startTime_transport.date"
          :rules="[(v) => !!v || $t('Item is required')]" required></v-text-field>
          <v-combobox @input="checkTime_transport" class="d-inline float-left mr-2" outlined dense hide-details=""
          :rules="[(v) => !!v || 'Item is required']" :items="itemHours" v-model="startTime_transport.hour"
          :label="$t('Hour')"></v-combobox>
          <v-combobox @input="checkTime" class="d-inline float-right mr-2" outlined dense hide-details=""
          :rules="[(v) => !!v || 'Item is required']" :items="itemMins" v-model="startTime_transport.min"
          :label="$t('Min')"></v-combobox>
          <!-- // thời gian về -->
          
          <v-text-field clearable @input="checkDate_transport" :min="startTime_transport.date" class="mr-2" type="date" outlined dense
          hide-details="" :rules="[(v) => !!v || 'Item is required']" :label="$t('End Date (MM/DD/YY)')"
          v-model="endTime_transport.date" required></v-text-field>
          <div class="d-flex">
            <v-combobox @input="checkTime" class="d-inline float-left mr-2" outlined dense hide-details=""
            :rules="[(v) => !!v || 'Item is required']" :items="itemHours" v-model="endTime_transport.hour"
            :label="$t('Hour')"></v-combobox>
            <v-combobox @input="checkTime" class="d-inline float-right" outlined dense hide-details=""
            :rules="[(v) => !!v || 'Item is required']" :items="itemMins" v-model="endTime_transport.min"
            :label="$t('Min')"></v-combobox>
          </div>
        </div>
        
        <v-textarea prepend-inner-icon="mdi-comment" rows="1" class="mt-3" outlined dense hide-details=""
        :label="$t('Extra note for Driver / GA')" v-model="notes_transport" required></v-textarea>
      </v-card-text>
    </v-card>
  </v-col>
  
  <v-col cols="6">
    
    
    <div class="d-flex mb-4" style="align-items: center">
      <v-autocomplete v-model="empNoForChecking" :label="$t('Find and Select People')" :items="employeeArr"
      item-text="empnoName" return-object hide-details outlined dense @update:search-input="debounceSearch" />
      <v-btn @click="addToTheList()" color="teal" class="ml-5">
        <v-icon class="white--text" left>mdi-plus</v-icon>
        <span class="white--text">{{ $t("Add to business trip") }}</span>
      </v-btn>
    </div>
    
    <v-row>
      <v-col cols="12">
        <v-card flat>
          <strong>
            {{ $t("Employee") }}
          </strong>
          <v-simple-table style="border: 1px solid #ccc" class="pa-2" height="465px" fixed-header dense>
            <thead>
              <tr>
                <th>#</th>
                <th>{{ $t("Empno") }}</th>
                <th>{{ $t("Name") }}</th>
                <th class="text-center">
                  {{ $t("Gender") }}
                </th>
                <th class="text-center">
                  {{ $t("Department") }}
                </th>
                <th class="text-center">
                  {{ $t("Deputies") }}
                </th>
                <th class="text-center">{{ $t("Action") }}</th>
              </tr>
            </thead>
            <tbody v-if="employee_list.length">
              <tr v-for="(item, index) in employee_list" :key="index">
                <td>
                  {{ index + 1 }}
                </td>
                <td class=" py-2">
                  {{ item.empno }}
                </td>
                <td>
                  {{ item.name }}
                </td>
                <td class="text-center">
                  {{ item.sex }}
                </td>
                <td class="text-center">
                  {{ item.dept }}
                </td>
                <!-- <td class="text-center">
                  <v-autocomplete v-model="item.deputies" :items="item.searchArr" item-text="empnoName"
                  return-object hide-details dense
                  @update:search-input="debounceSearchDeputiesQQ($event, item)" />
                </td> -->
                <td class="text-center">
                  <v-autocomplete v-model="item.deputies" :items="item.searchArr" item-text="empnoName"
                  return-object hide-details dense
                  @update:search-input="debounceSearchDeputiesQQ($event, item)" />
                </td>
                
                <td class="text-center">
                  <v-btn @click="removeRowByIndex(item, index)" x-small icon color="error">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
    <v-col cols="12" class="pr-0">
      <div class="d-flex" style="justify-content: flex-end;">
        <!-- <v-btn color="primary" @click="saveDataRequest()">
          {{ $t('Submit') }}
        </v-btn> -->
        <v-btn color="primary" @click="saveDataRequestAgain()">
          {{ $t('Re-Submit') }}
        </v-btn>
      </div>
    </v-col>
  </v-col>
</v-row>
</v-card>
</v-col>

<v-dialog v-model="dialogCreateNewDestinationBta" max-width="800px">
  <v-card>
    <v-card-title class="text-h6" style="display: flex; justify-content: space-between;">
      {{ $t("Create New Destination") }}
      <v-btn color="blue darken-1" outlined text @click="dialogCreateNewDestinationBta = false">
        {{ $t("close") }}
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-text-field dense v-model="newDestinationBta.vi" :label="$t('Tên địa chỉ Tiếng Việt')"
      placeholder="Thành phố Hồ Chí Minh" outlined></v-text-field>
      <v-text-field dense v-model="newDestinationBta.en" :label="$t('Tên địa chỉ Tiếng Anh')"
      placeholder="HO CHI MINH CITY" outlined></v-text-field>
      <v-text-field dense v-model="newDestinationBta.cn" :label="$t('Tên địa chỉ Tiếng Trung')"
      placeholder="HO CHI MINH 城市" outlined></v-text-field>
      <v-text-field dense v-model="newDestinationBta.address" :label="$t('Địa chỉ ')"
      placeholder="2 Hải Triều, phường Bến Nghé, quận 1, Thành phố Hồ Chí Minh. Bitexco Financial Tower"
      outlined></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="success" @click="saveNewDestinationBta()">
        SAVE
      </v-btn>
      
    </v-card-actions>
  </v-card>
</v-dialog>
</v-row>
</template>

<script>
import dayjs, { Dayjs } from "dayjs";
import auth from "~/components/auth";
import VfaAppFlow from "../../../../@global-component/vfa-updated"; //vfa-app-flow
export default {
  components: { VfaAppFlow, auth },
  props: {
    dialogDataDetail: Object,
    hrForeignArr: Array,
  },
  data() {
    return {
      crrDay: dayjs().format("YYYY-MM-DD"),
      
      newReason: {
        vi: null,
        en: null,
        cn: null,
      },
      newDestinationBta: {
        vi: null,
        en: null,
        cn: null,
        address: null,
      },
      empNoForChecking: null,
      employeeArr: [],
      employeeArrDeputies: [],
      searchTimeoutId: null,
      api: "http://gmo021.cansportsvg.com/api/vg-bta/",
      apiTransport: "http://gmo021.cansportsvg.com/api/vg-transport/",
      empApi: "http://gmo021.cansportsvg.com/api/emp/",
      msgApi: "http://gmo021.cansportsvg.com/api/msg-center/sendOutMsg",
      checkLocation: this.dialogDataDetail.location ? this.dialogDataDetail.location : "domestic",
      is_multiple_date: this.dialogDataDetail.is_multiple_date ? true : false,
      is_company_car: this.dialogDataDetail.is_company_car ? true : false,
      has_foreigner: false,
      dialogCreateNewDestinationBta: false,
      reasonSelected: {
        vi: this.dialogDataDetail.reason ? this.dialogDataDetail.reason.vi : null,
        en: this.dialogDataDetail.reason ? this.dialogDataDetail.reason.en : null,
        cn: this.dialogDataDetail.reason ? this.dialogDataDetail.reason.cn : null,
      },
      reasonData: [],
      reasonDataByDept: [],
      destination: this.dialogDataDetail.destination ? this.dialogDataDetail.destination : null,
      listDestination_bta: [],
      is_multiple_route: this.dialogDataDetail.is_multiple_route ? true : false,
      cellPhone: this.dialogDataDetail.cellphone ? this.dialogDataDetail.cellphone : null,
      extension_no: this.dialogDataDetail.extension_no ? this.dialogDataDetail.extension_no : null,
      destination_transport: this.dialogDataDetail.destination_transport_name ? this.dialogDataDetail.destination_transport_name[this.$i18n.locale] : null,
      listDestination_transport: [],
      startTime: {
        date: this.dialogDataDetail.start_date ? this.dialogDataDetail.start_date : null,
        hour: this.dialogDataDetail.start_time ? this.dialogDataDetail.start_time.split(":")[0] : null,
        min: this.dialogDataDetail.start_time ? this.dialogDataDetail.start_time.split(":")[1] : null,
      },
      endTime: {
        date: this.dialogDataDetail.end_date ? this.dialogDataDetail.end_date : null,
        hour: this.dialogDataDetail.end_time ? this.dialogDataDetail.end_time.split(":")[0] : null,
        min: this.dialogDataDetail.end_time ? this.dialogDataDetail.end_time.split(":")[1] : null,
      },
      startTime_transport: {
        date: this.dialogDataDetail.start_date_transport ? this.dialogDataDetail.start_date_transport : null,
        hour: this.dialogDataDetail.start_time_transport ? this.dialogDataDetail.start_time_transport.split(":")[0] : null,
        min: this.dialogDataDetail.start_time_transport ? this.dialogDataDetail.start_time_transport.split(":")[1] : null,
      },
      endTime_transport: {
        date: this.dialogDataDetail.end_date_transport ? this.dialogDataDetail.end_date_transport : null,
        hour: this.dialogDataDetail.end_time_transport ? this.dialogDataDetail.end_time_transport.split(":")[0] : null,
        min: this.dialogDataDetail.end_time_transport ? this.dialogDataDetail.end_time_transport.split(":")[1] : null,
      },
      time: "",
      menuStartTime: false,
      menuEndTime: false,
      notes_transport: this.dialogDataDetail.notes_transport ? this.dialogDataDetail.notes_transport : null,
      activeUser: {},
      
      employee_list: this.dialogDataDetail.employee_list ? this.dialogDataDetail.employee_list : [],
      dataAppFlow: [],
      dataAppFlowChanged: [],
      desDlg: false,
      
      itemHours: [
      "00",
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      ],
      itemMins: [
      "00",
      "05",
      "10",
      "15",
      "20",
      "25",
      "30",
      "35",
      "40",
      "45",
      "50",
      "55",
      ],
      searchTimeoutIdQQ: null,
      listDataLvl1: [],
      listDeptManagerLvl1: [],
      desData: [],
      dataEmpnoForeignContains: [],
    };
  },
  methods: {
    checkDate() {
      if (this.startTime.date) {
        const dateParts = this.startTime.date.split("-");
        if (dateParts.length === 3 && dateParts[0].length > 4) {
          dateParts[0] = dateParts[0].slice(0, 4); // Lấy 4 chữ số đầu của năm
          this.startTime.date = dateParts.join("-");
        }
      }
      
      if (this.endTime.date) {
        const dateParts = this.endTime.date.split("-");
        if (dateParts.length === 3 && dateParts[0].length > 4) {
          dateParts[0] = dateParts[0].slice(0, 4);
          this.endTime.date = dateParts.join("-");
        }
      }
      
      // Logic kiểm tra khoảng ngày
      if (this.startTime.date && this.endTime.date) {
        if (this.startTime.date > this.endTime.date) {
          alert("Ngày kết thúc không thể nhỏ hơn ngày bắt đầu");
          this.startTime.date = null;
          this.endTime.date = null;
        } else if (this.startTime.date === this.endTime.date) {
          this.is_multiple_date = false;
        } else {
          this.is_multiple_date = true;
        }
      }
    },
    checkTime() {
      if (this.startTime.date && this.endTime.date) {
        if (this.startTime.date === this.endTime.date) {
          if (this.startTime.hour && this.endTime.hour) {
            if (this.startTime.hour > this.endTime.hour) {
              alert("Giờ kết thúc không thể nhỏ hơn giờ bắt đầu");
              this.startTime.hour = null;
              this.endTime.hour = null;
            }
            if (this.startTime.hour === this.endTime.hour) {
              if (this.startTime.min && this.endTime.min) {
                if (this.startTime.min > this.endTime.min) {
                  alert("Phút kết thúc không thể nhỏ hơn phút bắt đầu");
                  this.startTime.min = null;
                  this.endTime.min = null;
                }
              }
            }
          }
        }
      }
    },
    checkDate_transport() {
      if (this.startTime_transport.date && this.endTime_transport.date) {
        if (this.startTime_transport.date > this.endTime_transport.date) {
          alert("Ngày kết thúc không thể nhỏ hơn ngày bắt đầu");
          this.startTime_transport.date = null;
          this.endTime_transport.date = null;
        }
      }
    },
    checkTime_transport() {
      if (this.startTime_transport.date && this.endTime_transport.date) {
        if (this.startTime_transport.date === this.endTime_transport.date) {
          if (this.startTime_transport.hour && this.endTime_transport.hour) {
            if (this.startTime_transport.hour > this.endTime_transport.hour) {
              alert("Giờ kết thúc không thể nhỏ hơn giờ bắt đầu");
              this.startTime_transport.hour = null;
              this.endTime_transport.hour = null;
            }
            if (this.startTime_transport.hour === this.endTime_transport.hour) {
              if (this.startTime_transport.min && this.endTime_transport.min) {
                if (this.startTime_transport.min > this.endTime_transport.min) {
                  alert("Phút kết thúc không thể nhỏ hơn phút bắt đầu");
                  this.startTime_transport.min = null;
                  this.endTime_transport.min = null;
                }
              }
            }
          }
        }
      }
    },
    
    locale(tg) {
      this.$i18n.setLocale(tg);
      $nuxt.$emit("change-locale", tg);
      this.$vuetify.lang.current = tg;
    },
    handleDataChanges() {
      let type_employee = "";
      let containsForeign = this.employee_list.every((item) => {
        return this.dataEmpnoForeignContains.some((keyword) =>
        item.empno.includes(keyword)
        );
      });
      let containsBoth =
      this.employee_list.some((item) => {
        return this.dataEmpnoForeignContains.some((keyword) =>
        item.empno.includes(keyword)
        );
      }) &&
      this.employee_list.some((item) => {
        return !this.dataEmpnoForeignContains.some((keyword) =>
        item.empno.includes(keyword)
        );
      });
      if (containsForeign) {
        type_employee = "all foreigner";
      } else if (containsBoth) {
        type_employee = "both";
      } else {
        type_employee = "all domestic";
      }
      
      if (
      this.checkLocation === "domestic" &&
      this.is_multiple_date === false &&
      type_employee === "all domestic"
      ) {
        this.dataAppFlowChanged = [
        this.dataAppFlow[0],
        this.dataAppFlow[1],
        this.dataAppFlow[4]
        ];
      }
      if (
      this.checkLocation === "domestic" &&
      this.is_multiple_date === true &&
      type_employee === "all domestic"
      ) {
        this.dataAppFlowChanged = [
        this.dataAppFlow[0],
        this.dataAppFlow[1],
        this.dataAppFlow[2],
        this.dataAppFlow[4]
        ];
      }
      if (
      (this.checkLocation === "group" || this.checkLocation === "domestic") &&
      (type_employee === "all foreigner" || type_employee === "both")
      ) {
        this.dataAppFlowChanged = [
        this.dataAppFlow[0],
        this.dataAppFlow[1],
        this.dataAppFlow[2],
        this.dataAppFlow[4]
        ];
      }
      
      if (this.checkLocation === "foreign") {
        this.dataAppFlowChanged = this.dataAppFlow;
      }
    },
    closeDialogEdit() {
      this.$emit("closeDialogEdit");
    },
    getEmpnoForeignData() {
      this.$axios.post(this.api + "getEmpnoForeignData").then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Kiểm tra nếu dữ liệu trả về từ server là một mảng không trống
          this.dataEmpnoForeignContains = res.data.map((item) => item.empno_contains);
        } else {
          // Xử lý trường hợp không có dữ liệu trả về hoặc dữ liệu không hợp lệ
          console.log("Không có dữ liệu hợp lệ trả về từ server");
        }
      }).catch((error) => {
        // Xử lý lỗi trong quá trình gửi request
        console.error("Lỗi khi gửi request:", error);
      });
    },
    async saveNewReason() {
      let params = {
        reason_vi: this.newReason.vi,
        reason_en: this.newReason.en,
        reason_cn: this.newReason.cn,
        from_dept: this.activeUser.dept,
      };
      
      try {
        let res = await this.$axios.post(this.api + "saveNewReason", params);
        if (res.data === "done") {
          await this.getReasonByDept();
        }
      } catch (error) {
        console.error("Error occurred while saving new reason:", error);
        // Handle error here
      }
    },
    saveNewDestinationBta() {
      let params = {
        name: JSON.stringify({
          vi: this.newDestinationBta.vi,
          en: this.newDestinationBta.en,
          cn: this.newDestinationBta.cn,
        }),
        address: this.newDestinationBta.address,
        created_by: this.activeUser.empno,
      };
      this.$axios.post(this.api + "saveNewDestinationBta", params).then((res) => {
        if (res.data === "done") {
          this.getBtaDestinationData();
          this.dialogCreateNewDestinationBta = false;
        }
      });
    },
    handleAppFlow(appFlow) {
      this.dataAppFlow = appFlow.map((item, index) => ({
        level: "level" + (index + 1),
        managers: item.managers.map((x) => {
          return {
            email: x.email,
            empno: x.empno,
            name: x.name,
            dept: x.dept_code,
          };
        }),
      }));
      this.listDeptManagerLvl1 =
      this.dataAppFlow
      .find((item) => item.level === "level1")
      ?.managers.map((manager) => manager.email) || [];
      this.dataAppFlowChanged = this.dataAppFlow;
    },
    getListDataLvl1() {
      setTimeout(() => {
        return (this.listDataLvl1 = this.dataAppFlow[0].managers.map((x) => {
          return { email: x.email, empno: x.empno, name: x.name, dept: x.dept };
        }));
      }, 1000);
    },
    
    async helpTransCLick(target) {
      if (target == "ve") {
        if (this.reasonSelected.en || this.reasonSelected.cn) {
          // let code = (target === 've') ? 'secret-e' : 'secret-c';
          let code = "secret-v";
          let formData = new FormData();
          formData.append("type", code);
          if (this.reasonSelected.en) {
            formData.append("string", this.reasonSelected.en);
          } else {
            formData.append("string", this.reasonSelected.cn);
          }
          await this.$axios
          .post(
          "http://gmo021.cansportsvg.com/public/gg-trans/curl.php",
          formData
          )
          .then((res) => {
            if (res.status == 200) {
              this.$set(this.reasonSelected, "vi", res.data);
            }
          })
          .catch((err) => {
            console.log("Err", err);
            this.showMsg(this.$t("error"), err);
          });
        }
      }
      if (target == "en") {
        if (this.reasonSelected.vi || this.reasonSelected.cn) {
          // let code = (target === 've') ? 'secret-e' : 'secret-c';
          let code = "secret-e";
          let formData = new FormData();
          formData.append("type", code);
          if (this.reasonSelected.vi) {
            formData.append("string", this.reasonSelected.vi);
          } else {
            formData.append("string", this.reasonSelected.cn);
          }
          await this.$axios
          .post(
          "http://gmo021.cansportsvg.com/public/gg-trans/curl.php",
          formData
          )
          .then((res) => {
            if (res.status == 200) {
              this.$set(this.reasonSelected, "en", res.data);
            }
          })
          .catch((err) => {
            console.log("Err", err);
            this.showMsg(this.$t("error"), err);
          });
        }
      }
      if (target == "cn") {
        if (this.reasonSelected.vi || this.reasonSelected.en) {
          // let code = (target === 've') ? 'secret-e' : 'secret-c';
          let code = "secret-c";
          let formData = new FormData();
          formData.append("type", code);
          if (this.reasonSelected.vi) {
            formData.append("string", this.reasonSelected.vi);
          } else {
            formData.append("string", this.reasonSelected.en);
          }
          await this.$axios
          .post(
          "http://gmo021.cansportsvg.com/public/gg-trans/curl.php",
          formData
          )
          .then((res) => {
            if (res.status == 200) {
              this.$set(this.reasonSelected, "cn", res.data);
            }
          })
          .catch((err) => {
            console.log("Err", err);
            this.showMsg(this.$t("error"), err);
          });
        }
      }
    },
    
    reasonComboboxChange(item) {
      if (item == "reason_vi") {
        if (this.reasonSelected.vi) {
          let _c = this.reasonData.filter(
          (x) => x.reason_vi == this.reasonSelected.vi
          );
          if (_c.length > 0) {
            this.reasonSelected.en = _c[0].reason_en;
            this.reasonSelected.cn = _c[0].reason_cn;
          }
        } else {
          this.reasonSelected.en = "";
          this.reasonSelected.cn = "";
        }
      } else if (item == "reason_en") {
        if (this.reasonSelected.en) {
          let _c = this.reasonData.filter(
          (x) => x.reason_en == this.reasonSelected.en
          );
          if (_c.length > 0) {
            this.reasonSelected.vi = _c[0].reason_vi;
            this.reasonSelected.cn = _c[0].reason_cn;
          }
        } else {
          this.reasonSelected.vi = "";
          this.reasonSelected.cn = "";
        }
      } else {
        if (this.reasonSelected.cn) {
          let _c = this.reasonData.filter(
          (x) => x.reason_cn == this.reasonSelected.cn
          );
          if (_c.length > 0) {
            this.reasonSelected.vi = _c[0].reason_vi;
            this.reasonSelected.en = _c[0].reason_en;
          }
        } else {
          this.reasonSelected.vi = "";
          this.reasonSelected.en = "";
        }
      }
    },
    
    addToTheList() {
      if (this.empNoForChecking) {
        // Kiểm tra xem empNoForChecking.empno đã tồn tại trong employee_list chưa
        const isEmpNoExists = this.employee_list.some(emp => emp.empno === this.empNoForChecking.empno);
        const isDeputyExists = this.employee_list.some(emp => emp.deputies && emp.deputies.empno === this.empNoForChecking.empno);
        
        if (isEmpNoExists || isDeputyExists) {
          // Nếu empNoForChecking.empno đã tồn tại trong employee_list, hiển thị cảnh báo
          alert("Người này đã có trong danh sách rồi!");
          
        } else {
          const newEmployee = {
            dept: this.empNoForChecking.dept,
            name: this.empNoForChecking.name,
            empno: this.empNoForChecking.empno,
            sex: this.empNoForChecking.sex,
            deputies: "",
            searchArr: [],
          };
          
          this.employee_list.push(newEmployee);
          this.empNoForChecking = [];
        }
      } else {
        // Xử lý trường hợp không tìm thấy nhân viên trong employeeArr
        console.log("Không tìm thấy nhân viên được chọn");
      }
    },
    debounceSearchDeputiesQQ(chunk, item) {
      if (item.deputies.empnoName === chunk) return 1;
      if (!chunk) return 1;
      clearTimeout(this.searchTimeoutIdQQ);
      this.searchTimeoutIdQQ = setTimeout(async () => {
        try {
          const res = await this.$axios.$post(this.empApi + "getEmployee", {
            chunk,
          });
          // Lọc ra các mục không chứa empno của item và tất cả empno trong this.employee_list
          const filteredRes = res.filter(x => x.empno !== item.empno && !this.employee_list.some(emp => emp.empno === x.empno));
          item.searchArr = filteredRes.map((x) => {
            x.empnoName = `${x.empno} ${x.name}`;
            return x;
          });
        } catch (e) {
          console.log("getEmployee", e);
        }
      }, 200);
    },
    debounceSearch(search) {
      clearTimeout(this.searchTimeoutId);
      this.searchTimeoutId = setTimeout(() => this.getEmployee(search), 200);
    },
    async getEmployee_(chunk) {
      if (chunk == null) return 1;
      let searchDeptList = this.searchDeptList;
      try {
        const res = await this.$axios.$post(this.empApi + "getEmployee", {
          chunk,
        });
        // lọc tất cả trong data HRM
        
        // this.employeeArr = res.map((x) => {
        //   x.empnoName = `${x.empno} ${x.name} - ${x.dept}`;
        //   return x;
        // });
        
        // chỉ lọc trong cùng bộ phận
        this.employeeArr = res
        .filter((x) => searchDeptList.includes(x.dept)) // Lọc chỉ các dept có trong searchDeptList
        .map((x) => {
          x.empnoName = `${x.empno} ${x.name} - ${x.dept}`;
          return x;
        });
      } catch (e) {
        console.log("getEmployee", e);
      }
    },
    async getEmployee(chunk) {
      if (chunk == null) return 1;
      try {
        const res = await this.$axios.$post(this.empApi + "getEmployee", {
          chunk,
        });
        this.employeeArr = res.map((x) => {
          x.empnoName = `${x.empno} ${x.name}`;
          return x;
        });
      } catch (e) {
        console.log("getEmployee", e);
      }
    },
    
    async saveDataRequestAgain() {
      let newReason = null;
      let newDestination = null;
      for (let i = 0; i < this.listDestination_bta.length; i++) {
        let name = this.listDestination_bta[i].name;
        if (this.destination === name.vi || this.destination === name.en || this.destination === name.cn) {
          newDestination = null;
        } else {
          newDestination = this.destination;
        }
      }
      
      for (let i = 0; i < this.reasonData.length; i++) {
        if (this.reasonSelected.vi === this.reasonData[i].reason_vi ||
        this.reasonSelected.en === this.reasonData[i].reason_en ||
        this.reasonSelected.cn === this.reasonData[i].reason_cn) {
          newReason = null;
        } else {
          if (newReason === null) {
            newReason = {};
          }
          newReason.vi = this.reasonSelected.vi;
          newReason.en = this.reasonSelected.en;
          newReason.cn = this.reasonSelected.cn;
        }
      }
      
      if (!this.$refs.inputForm.validate()) return;
      if (!confirm(this.$t('Are you sure you want to resubmit the request?'))) return;
      
      let dataEmpnoForeignContains = this.dataEmpnoForeignContains;
      let type_employee = "";
      let hasForeigner = this.employee_list.some(item => {
        return dataEmpnoForeignContains.some(keyword => item.empno.includes(keyword));
      });
      let containsForeign = this.employee_list.every(item => {
        return this.dataEmpnoForeignContains.some(keyword => item.empno.includes(keyword));
      });
      let containsBoth = this.employee_list.some(item => {
        return this.dataEmpnoForeignContains.some(keyword => item.empno.includes(keyword));
      }) && this.employee_list.some(item => {
        return !this.dataEmpnoForeignContains.some(keyword => item.empno.includes(keyword));
      });
      
      if (containsForeign) {
        type_employee = "all foreigner";
      } else if (containsBoth) {
        type_employee = "both";
      } else {
        type_employee = "all domestic";
      }
      // console.log("type_employee", type_employee);
      
      let params = {
        oldId: this.dialogDataDetail.id,
        submitter: JSON.stringify({
          empno: this.activeUser.empno,
          name: this.activeUser.name,
          dept: this.activeUser.dept,
          high_dept: this.activeUser.hight_dept,
          email: this.activeUser.email,
        }),
        location: this.checkLocation,
        is_multiple_date: this.is_multiple_date,
        has_foreigner: hasForeigner,
        reason: JSON.stringify(this.reasonSelected),
        destination: this.destination.curLang ? this.destination.curLang : this.destination,
        cellphone: this.cellPhone,
        extension_no: this.extension_no,
        start_date: this.startTime.date,
        start_time: this.startTime.hour + ":" + this.startTime.min,
        end_date: this.endTime.date,
        end_time: this.endTime.hour + ":" + this.endTime.min,
        type_employee: type_employee,
        employee_list: JSON.stringify(this.employee_list),
        
        is_company_car: this.is_company_car,
        // destination_transport: this.is_company_car ? this.dialogDataDetail.destination_transport : null,
        destination_transport: this.destination_transport && this.destination_transport.id ? this.destination_transport.id : this.dialogDataDetail.destination_transport ? this.dialogDataDetail.destination_transport : null,
        start_date_transport: this.is_company_car ? this.startTime_transport.date : null,
        start_time_transport: this.is_company_car ? this.startTime_transport.hour + ":" + this.startTime_transport.min : null,
        end_date_transport: this.is_company_car ? this.endTime_transport.date : null,
        end_time_transport: this.is_company_car ? this.endTime_transport.hour + ":" + this.endTime_transport.min : null,
        notes_transport: this.is_company_car ? this.notes_transport : null,
        
        newReason: newReason,
        newDestination: newDestination,
      };
      // console.log("params", params);
      let link = "http://gmo021.cansportsvg.com/vg/hr/bta";
      let target = this.activeUser.location.toLocaleUpperCase() +"-EXPAT-" + this.activeUser.dept;
      let deptManagerSigned = this.dialogDataDetail.dept_manager ? this.dialogDataDetail.dept_manager.who.email : null;      
      
      let msg = `Dear Manager, <br>
      The business trip application you previously approved has been edited, <br>
      Editor: ${this.activeUser.empno} - ${this.activeUser.name} , department:${this.activeUser.dept} <br>
      Please visit the link to check and approve the above request. <br>
      Link: ${link}  <br> 
      Thanks! <br><br>
      
      尊敬的經理 <br>
      您先前批准的出差申請已被編輯， <br>
      編輯者：${this.activeUser.empno} - ${this.activeUser.name}，部門：${this.activeUser.dept} <br>
      請訪問鏈接以檢查並批准上述請求。
      鏈接：${link}  <br> 
      謝謝！ 
      `;
      try {
        let res = await this.$axios.post(this.api + "saveDataRequestAgain", params);
        if (res.data === "done") {
          if (deptManagerSigned){
            this.sendMsg(target, deptManagerSigned, msg);
          }
          alert("Successfully!!! \n Thành công!!! \n 成功!!!");
          this.closeDialogEdit();
        }
      } catch (err) {
        alert("saveDataRequestAgain:" + err);
      }
    },
    
    
    async sendMsg(target, mailLvl1, body) {
      let params = {
        target: target, //"VG-EXPAT-LU-TEST",
        body: body,
        msg_type: "m",
        msg_method: "both",
        msg_subject: "Business Trip Approval Application",
        mail_template: "msgCenterMailTemplate",
        mail_data: null,
        mail_data: JSON.stringify({
          to: mailLvl1, //mailLvl1
          subject: "Business Trip Approval Application - Waiting Dept Manager Approval",
          msgBody: body,
        }),
      };
      await this.$axios.post(this.msgApi, params).then((res) => {
        if (res.status === 200) {
          // console.log("sendMsg", res.data);
        } else {
          alert("error: " + res.status);
        }
      });
    },
    
    async getReasonData() {
      try {
        let res = await this.$axios.post(this.api + "getReasonData");
        this.reasonData = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getReasonByDept() {
      let params = {
        from_dept: this.activeUser.dept,
      };
      // console.log("params", params);
      this.$axios.post(this.api + "getReasonByDept", params).then((res) => {
        this.reasonDataByDept = res.data;
      });
      
    },
    // destination transport
    async desListing() {
      try {
        let res = await this.$axios.post(this.apiTransport + "desListing");
        this.listDestination_transport = res.data.map((item) => {
          return {
            ...item,
            name: JSON.parse(item.name),
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
    
    // destination BTA
    async getBtaDestinationData() {
      try {
        let res = await this.$axios.post(this.api + "getBtaDestinationData");
        this.listDestination_bta = res.data.map((item) => {
          return {
            ...item,
            name: JSON.parse(item.name),
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
    
    helpTrans(s, t1, t2) {
      if (!this.reason[s]) return 1;
      // data
      const obj = {
        en: "secret-e",
        vi: "secret-v",
        cn: "secret-c",
      };
      const turl = "http://gmo021.cansportsvg.com/public/gg-trans/curl.php";
      // t1
      const formData = new FormData();
      formData.append("string", this.reason[s]);
      formData.append("type", obj[t1]);
      this.$axios
      .post(turl, formData)
      .then((res) => {
        if (!this.reason[t1]) this.$set(this.reason, t1, res.data);
      })
      .catch(console.log);
      // t2
      const formData1 = new FormData();
      formData1.append("string", this.reason[s]);
      formData1.append("type", obj[t2]);
      this.$axios
      .post(turl, formData1)
      .then((res) => {
        if (!this.reason[t2]) this.$set(this.reason, t2, res.data);
      })
      .catch(console.log);
    },
    removeRowByIndex(item, index) {
      if (confirm(this.$t('Are you sure you want to delete this item?'))) {
        this.employee_list.splice(index, 1);
      }
    },
  },
  computed: {
    desBtaListingComp() {
      if (this.listDestination_bta.length) {
        if (this.checkLocation === "group") {
          return this.listDestination_bta.filter((x) => x.is_group === 1).map((x) => {
            return {
              name: {
                vi: x.name.vi,
                cn: x.name.cn,
                en: x.name.en,
              },
              id: x.id,
              curLang: x.name[this.$i18n.locale],
              address: x.address,
            };
          });
        } else {
          return this.listDestination_bta.map((x) => {
            return {
              name: {
                vi: x.name.vi,
                cn: x.name.cn,
                en: x.name.en,
              },
              id: x.id,
              curLang: x.name[this.$i18n.locale],
              address: x.address,
            };
          });
        }
      } else {
        return ["Waiting for data..."];
      }
    },
    
    desListingComp() {
      if (this.listDestination_transport.length) {
        return this.listDestination_transport.map((x) => {
          return {
            name: {
              vi: x.name.vi,
              cn: x.name.cn,
              en: x.name.en,
            },
            id: x.id,
            curLang: x.name[this.$i18n.locale],
            address: x.address,
          };
        });
      } else {
        return ["Waiting for data..."];
      }
    },
  },
  watch: {
    checkLocation: {
      handler(newVal, oldVal) {
        this.handleDataChanges();
      },
      immediate: true
    },
    is_multiple_date: {
      handler(newVal, oldVal) {
        this.handleDataChanges();
      },
      immediate: true
    },
    employee_list: {
      handler(newVal, oldVal) {
        this.handleDataChanges();
      },
      immediate: true
    },
    reasonSelected: {
      deep: true,
      handler(newVal, oldVal) { 
        if (newVal.vi || newVal.en || newVal.cn) {
          this.handleDataChanges();
        }
      },
      immediate: true
    },
    destination: {
      handler(newVal, oldVal) {
        this.handleDataChanges();
      },
      immediate: true
    },
    startTime: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.date || newVal.hour || newVal.min) {
          this.handleDataChanges();
        }
      },
      immediate: true
    },
    endTime: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.date || newVal.hour || newVal.min) {
          this.handleDataChanges();
        }
      },
      immediate: true
    },
    startTime_transport: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.date || newVal.hour || newVal.min) {
          this.handleDataChanges();
        }
      },
      immediate: true
    },
    endTime_transport: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.date || newVal.hour || newVal.min) {
          this.handleDataChanges();
        }
      },
      immediate: true
    },
    destination_transport: {
      handler(newVal, oldVal) {
        this.handleDataChanges();
      },
      immediate: true
    },
  },
  created() {
    // Khi component được tạo, gọi hàm để tải dữ liệu mới
    this.dataAppFlowChanged = this.dataAppFlow;
  },
  mounted() {
    this.activeUser = this.$session.get("vg-bta");
    this.desListing();
    this.getBtaDestinationData();
    this.getReasonData();
    this.getReasonByDept();
    this.getListDataLvl1();
    this.getEmpnoForeignData();
  },
};
</script>

<i18n>
  {
    "en":{
      "Vehicle dispatch information": "Vehicle dispatch information",
      "Cellphone": "Cellphone",
      "Extension no.": "Extension no.",
      "Department Manager": "Department Manager",
      "Division Manager": "Division Manager",
      "Vice Chairman": "Vice Chairman",
      "Board Chairman": "Board Chairman",
      "Human Resources (HR)": "Human Resources (HR)",
      "Reason - VI": "Reason - VI",
      "Reason - EN": "Reason - EN",
      "Reason - CN": "Reason - CN",
      "Action": "Action",
      "Multiple day trip": "Multiple day trip",
      "Deputies": "Deputies",
      "Empno": "Empno",
      "Extra note for Driver / GA": "Extra note for Driver / GA",
      "End Date - transport": "End Date - transport",
      "Start Date - transport": "Start Date - transport",
      "Destination - transport": "Destination - transport",
      "End Date (MM/DD/YY)": "End Date (MM/DD/YY)",
      "Start Date (MM/DD/YY)": "Start Date (MM/DD/YY)",
      "Destination business trip": "Destination business trip",
      "Group Domestic": "Group Domestic",
      "Edit form": "Edit form",
      "Are you sure you want to delete this item?": "Are you sure you want to delete this item?",
      "Are you sure you want to resubmit the request?": "Are you sure you want to resubmit the request?",
      "Re-Submit": "Re-Submit",
      "Company vehicle": "Company vehicle",
      "Domestic": "Domestic",
      "Foreign": "Foreign",
      "Location": "Location",
      "Business trip the day": "Business trip the day",
      "Destination business trip": "Destination business trip",
      "Start Date business trip": "Start Date business trip",
      "Hour": "Hour",
      "Min": "Min",
      "End Date business trip": "End Date business trip",
      "Notes": "Notes",
      "Find and Select People": "Find and Select People",
      "Add to business trip": "Add to business trip",
      "Employee": "Employee",
      "Name": "Name",
      "Department": "Department",
      "Submit": "Submit" 
    },
    "vi":{
      "Vehicle dispatch information":"Thông tin điều xe",
      "Cellphone": "Số điện thoại",
      "Extension no.":"Số nội bộ",
      "Department Manager":"Chủ quản bộ phận",
      "Division Manager":"Chủ quản cấp sở",
      "Vice Chairman":"Phó Tổng",
      "Board Chairman": "Tổng Giám Đốc",
      "Human Resources (HR)":"Tài nguyên nhân lực (HR)",
      "Reason - VI":"Lý do - lý do tiếng Việt",
      "Reason - EN":"Lý do - lý do tiếng Anh",
      "Reason - CN":"Lý do - lý do tiếng Trung",
      "Action":"Hành động",
      "Multiple day trip":"Đi nhiều ngày",
      "Deputies":"Người thay thế",
      "Empno":"MST",
      "Extra note for Driver / GA": "Ghi chú cho tài xế / GA",
      "End Date - transport": "Ngày kết thúc - Điều xe",
      "Start Date - transport": "Ngày bắt đầu - Điều xe",
      "Destination - transport": "Điểm đến - Điều xe",
      "End Date (MM/DD/YY)": "Ngày kết thúc (MM/DD/YY)",
      "Start Date (MM/DD/YY)":"Ngày bắt đầu (MM/DD/YY)",
      "Destination business trip":"Điểm đến công tác",
      "Group Domestic":"Tập đoàn trong nước",
      "Edit form": "Chỉnh sửa biểu mẫu",
      "Are you sure you want to delete this item?" : "Bạn có chắc chắn muốn xóa mục này?",
      "Are you sure you want to resubmit the request?": "Bạn có chắc chắn muốn gửi lại yêu cầu?",
      "Re-Submit": "Gửi lại",
      "Company vehicle": "Xe công ty",
      "Domestic":"Trong nước",
      "Foreign":"Nước ngoài",
      "Location":"Địa điểm công tác",
      "Business trip the day":"Công tác trong ngày",
      "Destination business trip":"Địa điểm công tác",
      "Start Date business trip":"Ngày đi công tác",
      "Hour":"Giờ",
      "Min":"Phút",
      "End Date business trip":"Ngày về công tác",
      "Notes":"Ghi chú",
      "Find and Select People":"Tìm và chọn người",
      "Add to business trip":"Thêm vào chuyến công tác",
      "Employee":"Nhân viên",
      "Name":"Tên",
      "Department":"Bộ phận",
      "Submit":"Gửi"
    },
    "cn":{
      "Vehicle dispatch information": "车辆调度信息",
      "Cellphone": "手机号码",
      "Extension no.": "分机号",
      "Department Manager": "部級主管",
      "Division Manager": "處級主管",
      "Vice Chairman": "副董事长",
      "Board Chairman": "董事长",
      "Human Resources (HR)": "人力资源 (HR)",
      "Reason - VI": "原因 - VI",
      "Reason - EN": "原因 - EN",
      "Reason - CN": "原因 - CN",
      "Action":"行动",
      "Multiple day trip":"多天旅行",
      "Deputies":"代理人",
      "Empno":"员工编号",
      "Extra note for Driver / GA": "司机/ GA的额外说明",
      "End Date - transport": "结束日期 - 交通",
      "Start Date - transport": "开始日期 - 交通",
      "Destination - transport": "目的地 - 交通",
      "End Date (MM/DD/YY)": "结束日期 (MM/DD/YY)",
      "Start Date (MM/DD/YY)":"开始日期 (MM/DD/YY)",
      "Destination business trip":"出差目的地",
      "Group Domestic":"国内集团",
      "Edit form": "编辑表单",
      "Are you sure you want to delete this item?" : "您确定要删除此项吗？",
      "Are you sure you want to resubmit the request?": "您确定要重新提交请求吗？",
      "Re-Submit": "重新提交",
      "Company vehicle": "公司车辆",
      "Domestic": "国内",
      "Foreign": "国外",
      "Location": "工作地点",
      "Business trip the day": "当天出差",  
      "Destination": "目的地",
      "Address": "地址",
      "Start Date": "出发日期",
      "Hour": "小時",
      "Min": "分鐘",
      "End Date": "返回日期",
      "Notes": "备注",
      "Find and Select People": "查找和选择人员",
      "Add to business trip": "添加到商务旅行",
      "Employee": "员工",
      "Name": "名字",
      "Department": "部门",
      "Submit": "提交"
    }
  }
</i18n>