<template>
  <v-row>
    <v-col cols="12" class="noPrint">
      <VfaAppFlow v-if="activeUser && activeUser.empno" v-show="false" ref="AppFlow" appCode="aw_rpa_demo"
        :empno="activeUser.empno" :location="activeUser.location" @sendAppFlow="handleAppFlow"></VfaAppFlow>
      <v-card>
        <div class="progress-bar" />
        <v-toolbar dense color="teal" dark>
          <v-toolbar-title title="Repair proposal" class="d-flex" style="align-items: center">
            <v-icon left>mdi-google-classroom</v-icon>
            {{ $t("Repair proposal") }}
            <h3 class="ml-5" v-if="activeUser && activeUser.location">
              {{ activeUser.location.toUpperCase() }}
            </h3>
            <v-radio-group v-model="filteredArea" row class="ml-10 mt-5">
              <v-radio :label="$t('ALL')" value="all"></v-radio>
              <v-radio v-for="(item, index) in itemsArea" :key="index" :label="item.toUpperCase()"
                :value="item"></v-radio>
            </v-radio-group>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field style="max-width: 250px; padding-right: 15px" outlined dense v-model="search"
            append-icon="mdi-magnify" :label="$t('Search')" single-line hide-details clearable></v-text-field>
          <v-btn @click="getAllReqList" :title="$t('Reload')" class="mr-3" color="white" small light nuxt>
            <v-icon left :class="{ 'mdi-spin': isReloading }">
              mdi-reload
            </v-icon>
            {{ $t("Reload") }}
          </v-btn>
          <v-btn @click="getFormCreate()" :title="$t('New request')" color="white" small light nuxt>
            <v-icon left>mdi-plus</v-icon>
            {{ $t("New request") }}
          </v-btn>
        </v-toolbar>
        <v-tabs background-color="teal" color="yellow" dark v-model="statusFilter">
          <v-tab>
            {{ $t("To do") }}
          </v-tab>
          <v-tab>
            {{ $t("All") }}
          </v-tab>
          <v-tab>
            {{ $t("Waiting") }}
          </v-tab>
          <v-tab>
            {{ $t("Processing") }}
          </v-tab>
          <v-tab>
            {{ $t("Processed") }}
          </v-tab>
          <v-tab>
            {{ $t("Completed") }}
          </v-tab>
          <v-tab>
            {{ $t("Decline") }}
          </v-tab>
          <v-tab>
            {{ $t("> 3000 USD") }}
          </v-tab>
          <v-spacer></v-spacer>
        </v-tabs>
        <v-data-table :headers="headers" :items="filteredItems" :search="search" :custom-filter="customFilter">
          <template v-slot:[`header.approval`]>
            {{ $t("Approval") }}
          </template>
          <template v-slot:[`header.area`]>
            {{ $t("Area") }}
          </template>
          <template v-slot:[`header.location`]>
            {{ $t("Location") }}
          </template>
          <template v-slot:[`header.request_id`]>
            {{ $t("Request ID") }}
          </template>
          <template v-slot:[`header.date_need`]>
            {{ $t("Date need") }}
          </template>
          <template v-slot:[`header.ext_no`]>
            {{ $t("Extention no") }}
          </template>
          <template v-slot:[`header.repair_type`]>
            <span :title="$t('repair type')">
              <DsFilter :in-items="filterRepairType" :name="$t('Repair Type')"
                @changed="filterData.repairType = $event" />
            </span>
          </template>
          <template v-slot:[`header.type_request`]>
            {{ $t("Request Type") }}
          </template>
          <template v-slot:[`header.category`]>
            {{ $t("Category") }}
          </template>
          <template v-slot:[`header.problem`]>
            {{ $t("Problem") }}
          </template>
          <template v-slot:[`header.status`]>
            {{ $t("Status") }}
          </template>
          <template v-slot:[`header.process_situation`]>
            {{ $t("Process Situation by GA") }}
          </template>
          <template v-slot:[`header.action`]>
            {{ $t("Action") }}
          </template>
          <template v-slot:[`header.history_logs`]>
            {{ $t("History Logs") }}
          </template>

          <template v-slot:[`header.department`]>
            <span :title="$t('Department')">
              <DsFilter :in-items="filterDept" :name="$t('Department')" @changed="filterData.dept = $event" />
            </span>
          </template>
          <template v-slot:[`header.division`]>
            <span :title="$t('Division')">
              <DsFilter :in-items="filterHighDept" :name="$t('Division')" @changed="filterData.high_dept = $event" />
            </span>
          </template>
          <template v-slot:[`header.submitter`]>
            <span :title="$t('Submitter')">
              <DsFilter :in-items="filterEmpno" :name="$t('Submitter')" @changed="filterData.empno = $event" />
            </span>
          </template>
          <template #[`item.department`]="{ item }">
            {{ item.submitter.dept }} / {{ item.submitter.high_dept }}
          </template>
          <!-- <template v-slot:[`item.division`]="{ item }">
          {{ item.submitter.high_dept }}
          </template> -->
          <template v-slot:[`item.submitter`]="{ item }">
            <v-btn color="teal" @click="showSubmitedDetail(item)" text small>
              {{ item.submitter.empno }}
              <v-icon right>mdi-information-outline</v-icon>
            </v-btn>
          </template>
          <template v-slot:[`item.repair_type`]="{ item }">
            {{
              $t(
                item.repair_type === "internal"
                  ? "Internal"
                  : item.repair_type === "external"
                    ? "External"
                    : ""
              )
            }}
          </template>

          <template v-slot:[`item.type_request`]="{ item }">
            {{
              item.type_request === "asset"
                ? $t("Asset")
                : item.type_request === "machine"
                  ? $t("Machine")
                  : item.type_request === "equipment"
                    ? $t("Equipment")
                    : item.type_request === "electricity"
                      ? $t("Electricity, Water")
                      : item.type_request === "renovation"
                        ? $t("Renovation")
                        : item.type_request === "other"
                          ? $t("Other")
                          : item.type_request === "molds"
                            ? $t("Molds")
                            : ""
            }}
          </template>

          <template v-slot:[`item.category`]="{ item }">
            <v-tooltip color="teal" left>
              <template v-slot:activator="{ on, attrs }">
                <span text v-bind="attrs" v-on="on" label color="primary"
                  class="overflow-ellipsis d-inline-block text-truncate px-0 mb-1;" style="max-width: 111px">
                  {{ item.category[$i18n.locale] }}
                </span>
              </template>
              <span>{{ item.category[$i18n.locale] }}</span>
            </v-tooltip>
          </template>

          <template v-slot:[`item.problem`]="{ item }">
            <v-tooltip color="teal" left>
              <template v-slot:activator="{ on, attrs }">
                <span text v-bind="attrs" v-on="on" label color="primary"
                  class="overflow-ellipsis d-inline-block text-truncate px-0 mb-1;" style="max-width: 111px">
                  {{ item.problem[$i18n.locale] }}
                </span>
              </template>
              <span>{{ item.problem[$i18n.locale] }}</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <v-chip small outlined :color="item.status
              ? item.status.includes('waiting')
                ? 'orange'
                : item.status === 'processing'
                  ? 'success'
                  : item.status === 'processed'
                    ? 'blue'
                    : item.status === 'completed'
                      ? 'blue'
                      : 'error'
              : ''
              ">
              <div style="
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  ">
                <span style="color: black; margin-top: 2px" v-html="getStatusText(item)"></span>
                <v-tooltip color="teal" bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn style="padding: 0px" icon small v-if="
                      item.status !== 'completed' &&
                      item.status !== 'declined' &&
                      item.status !== 'cancelled'
                    ">
                      <v-icon small v-bind="attrs" v-on="on" class="mr-1">
                        mdi-sitemap
                      </v-icon>
                    </v-btn>
                  </template>
                  <span style="color: white" v-html="getStatusText2(item)"></span>
                </v-tooltip>
              </div>
            </v-chip>
          </template>
          <template v-slot:[`item.approval`]="{ item }">
            <div>
              <v-btn v-if="canApproval(item) && item.status !== 'processing'" small color="success"
                @click="showDialogApproveReq(item)">
                <v-icon> mdi-check-bold </v-icon>
              </v-btn>
              <v-btn v-if="canApproval(item) && item.status !== 'processing'" small color="error"
                @click="showDialogDeclineReq(item)">
                <v-icon> mdi-close </v-icon>
              </v-btn>
              <v-btn v-if="canApproval(item) && item.status === 'processing'" small color="primary"
                @click="showDialogApproveReq(item)">
                <v-icon></v-icon>
                {{ $t('Confirm Processed') }}
              </v-btn>
            </div>
          </template>
          <template v-slot:[`item.history_logs`]="{ item }">
            <v-btn v-if="item.status != 'waiting_dept'" small dark color="orange" @click="showHistoryLogs(item)">
              {{ $t("History Logs") }}
            </v-btn>
          </template>
          <template v-slot:[`item.process_situation`]="{ item }">
            <v-btn v-if="isGaManager || isEmpInStaffGa" @click="openDialogAddProcessSituation(item.id)" class="ma-2"
              outlined small color="teal">
              <v-icon>mdi-pen-plus</v-icon>
            </v-btn>


            <v-btn v-if="item.process_situation" @click="openDialogDataProcessSituation(item)" class="ma-2" outlined
              small color="teal">
              <v-icon>mdi-information-variant</v-icon>
            </v-btn>

          </template>
          <template v-slot:[`item.action`]="{ item }">
            <div class="d-flex">
              <div>
                <v-btn :title="$t('Detail')" small color="orange" class="white--text"
                  @click="getDataDialogDetail(item)">{{ $t("Detail") }}</v-btn>

                <!-- <v-icon @click="openCompPrint(item)">mdi-printer</v-icon> -->
              </div>
            </div>
          </template>
          <template v-slot:[`footer.prepend`]>
            <v-btn dense color="green" dark class="ml-5">
              <export-excel worksheet="data" :data="excelreport()">
                <v-icon left color="white">mdi-download</v-icon>
                <span class="white--text">{{ $t("EXPORT EXCEL") }}</span>
              </export-excel>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
    <v-dialog v-model="showDialogCreate" fullscreen persistent>
      <v-card style="overflow: hidden">
        <RequestFormCreate @closeDialogCreate="closeDialogCreate" :activeUser="activeUser" />
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDialogComponentDetail" fullscreen persistent>
      <v-card style="overflow: hidden">
        <RequestFormDetail :dialogDataDetail="dialogDataDetail" @closeDialogSign="closeDialogSign"
          @closeDialogDetailRegistration="closeDialogDetailRegistration" />
      </v-card>
    </v-dialog>
    <!-- Add new cancel confirmation dialog -->
    <v-dialog v-model="showCancelDialog" max-width="500px">
      <v-card>
        <v-card-title :title="$t('Cancel Booking')">{{
          $t("Cancel Booking")
          }}</v-card-title>
        <v-card-text>
          <v-textarea v-model="cancelReason" :label="$t('Enter cancellation reason')" required outlined></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="showCancelDialog = false">
            {{ $t("Close") }}
          </v-btn>
          <v-btn color="primary" @click="confirmCancelBooking" :disabled="!cancelReason">
            {{ $t("Confirm") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="infoHistoryLog" max-width="1200px">
      <v-card>

        <v-card-title class="text-h6">
          {{ $t("Approval history") }} ( ID: {{ dialogDataDetail.id }}
          {{
            dialogDataDetail.repair_type
              ? "- " + $t("Repair Type") + ": " + $t(`repair_type.${dialogDataDetail.repair_type}`)
              : ""
          }}
          )
        </v-card-title>

        <v-card-text>
          <v-simple-table dense>
            <thead>
              <tr>
                <th>{{ $t("Level") }}</th>
                <th>{{ $t("Info") }}</th>
                <th style="max-width: 300px;">{{ $t("Comment") }}</th>
                <th>{{ $t("Time") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="dialogDataDetail.dept_manager_logs">
                <td>{{ $t("Department Manager") }}</td>
                <td>
                  {{ dialogDataDetail.dept_manager_logs.empno }} -
                  {{ dialogDataDetail.dept_manager_logs.name }} -
                  {{ dialogDataDetail.dept_manager_logs.dept }}
                </td>
                <td class="comment-wrap">
                  {{
                    dialogDataDetail &&
                      dialogDataDetail.dept_manager_logs &&
                      dialogDataDetail.dept_manager_logs.comment
                      ? dialogDataDetail.dept_manager_logs.comment
                      : ""
                  }}
                </td>
                <td>{{ dialogDataDetail.dept_manager_logs.time }}</td>
              </tr>
              <tr v-if="dialogDataDetail.division_manager_logs">
                <td>{{ $t("Division Manager") }}</td>
                <td>
                  {{ dialogDataDetail.division_manager_logs.empno }} -
                  {{ dialogDataDetail.division_manager_logs.name }} -
                  {{ dialogDataDetail.division_manager_logs.dept }}
                </td>
                <td class="comment-wrap">
                  {{
                    dialogDataDetail &&
                      dialogDataDetail.division_manager_logs &&
                      dialogDataDetail.division_manager_logs.comment
                      ? dialogDataDetail.division_manager_logs.comment
                      : ""
                  }}
                </td>
                <td>{{ dialogDataDetail.division_manager_logs.time }}</td>
              </tr>
              <tr v-if="dialogDataDetail.ga_manager_logs">
                <td>{{ $t("GA Manager") }}</td>
                <td>
                  {{ dialogDataDetail.ga_manager_logs.empno }} -
                  {{ dialogDataDetail.ga_manager_logs.name }} -
                  {{ dialogDataDetail.ga_manager_logs.dept }}
                </td>
                <td class="comment-wrap">
                  {{
                    dialogDataDetail &&
                      dialogDataDetail.ga_manager_logs &&
                      dialogDataDetail.ga_manager_logs.comment
                      ? dialogDataDetail.ga_manager_logs.comment
                      : ""
                  }}
                </td>
                <td>{{ dialogDataDetail.ga_manager_logs.time }}</td>
              </tr>
              <tr v-if="dialogDataDetail.division_ga_logs">
                <td>{{ $t("Division GA Manager") }}</td>
                <td>
                  {{ dialogDataDetail.division_ga_logs.empno }} -
                  {{ dialogDataDetail.division_ga_logs.name }} -
                  {{ dialogDataDetail.division_ga_logs.dept }}
                </td>
                <td class="comment-wrap">
                  {{
                    dialogDataDetail &&
                      dialogDataDetail.division_ga_logs &&
                      dialogDataDetail.division_ga_logs.comment
                      ? dialogDataDetail.division_ga_logs.comment
                      : ""
                  }}
                </td>
                <td>{{ dialogDataDetail.division_ga_logs.time }}</td>
              </tr>
              <tr v-if="dialogDataDetail.bu_logs">
                <td>{{ $t("BU HEAD") }}</td>
                <td>
                  {{ dialogDataDetail.bu_logs.empno }} -
                  {{ dialogDataDetail.bu_logs.name }} -
                  {{ dialogDataDetail.bu_logs.dept }}
                </td>
                <td class="comment-wrap">
                  {{
                    dialogDataDetail &&
                      dialogDataDetail.bu_logs &&
                      dialogDataDetail.bu_logs.comment
                      ? dialogDataDetail.bu_logs.comment
                      : ""
                  }}
                </td>
                <td>{{ dialogDataDetail.bu_logs.time }}</td>
              </tr>

              <tr v-for="(item, index) in combinedStaffGaAndCompletedLogs" :key="index">
                <td>{{ $t(item.type) }}</td>
                <td>
                  {{ item.log.empno }} - {{ item.log.name }} -
                  {{ item.log.dept }}
                </td>
                <td class="comment-wrap">{{ item.log.comment || "" }}</td>
                <td>{{ item.log.time }}</td>
              </tr>

              <!-- //decline -->
              <tr v-if="dialogDataDetail.decline_logs">
                <td>{{ $t("The refuser") }}</td>
                <td>
                  {{ dialogDataDetail.decline_logs.empno }} -
                  {{ dialogDataDetail.decline_logs.name }} -
                  {{ dialogDataDetail.decline_logs.dept }}
                </td>
                <td class="comment-wrap">
                  {{
                    dialogDataDetail &&
                      dialogDataDetail.decline_logs &&
                      dialogDataDetail.decline_logs.comment
                      ? dialogDataDetail.decline_logs.comment
                      : ""
                  }}
                </td>
                <td>{{ dialogDataDetail.decline_logs.time }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" outlined text @click="closeDialogHistoryLog()">
            {{ $t("Close") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add new deny confirmation dialog -->
    <v-dialog v-model="dialogDeclineReq" max-width="800px">
      <v-card>
        <v-toolbar dense color="error" dark>
          <v-toolbar-title title="Decline Request" class="d-flex" style="align-items: center">
            <!-- {{ $t("Decline Request")}} -->
            {{
              dialogDataDetail.status === "processed"
                ? $t("Confirmation not completed")
                : $t("Decline Request")
            }}
          </v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-title class="text-h6 font-weight-bold">
          {{ $t("Please provide your comments ( if any )") }}
        </v-card-title>

        <v-card-text>
          <v-textarea hide-details v-model="decline_reason" :label="$t('Enter your comment')" outlined dense rows="4"
            clearable></v-textarea>
        </v-card-text>

        <v-card-actions>
          <v-btn outlined text color="error" @click="dialogDeclineReq = false">
            {{ $t("Close") }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="!decline_reason" color="error" class="white--text" @click="declineReq()">
            {{
              dialogDataDetail.status === "processed"
                ? $t("Confirmation not completed")
                : $t("Confirm decline")
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showWaitingConfirmDialog" max-width="555px">
      <v-card>
        <v-card-title :title="$t('Awaiting confirmation from one of these people:')">{{
          $t("Awaiting confirmation from one of these people:")
          }}</v-card-title>
        <v-card-text>
          <p style="font-size: 20px" v-for="manager in waitingConfirmInfo" :key="manager.empno">
            {{ manager.empno }} - {{ manager.name }} - {{ manager.dept }} ( #{{
              manager.extno
            }}
            )
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="showWaitingConfirmDialog = false">
            {{ $t("Close") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="submitedDialog" max-width="500">
      <v-card>
        <v-card-title primary-title>
          {{ $t("Submiter detail") }}
        </v-card-title>
        <v-card-text v-if="submitedDialogContent">
          <v-simple-table dark>
            <tbody>
              <tr>
                <td>{{ $t("Empno") }}</td>
                <td>{{ submitedDialogContent.submitter.empno }}</td>
              </tr>
              <tr>
                <td>{{ $t("Fullname") }}</td>
                <td>
                  {{ submitedDialogContent.submitter.name }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("Dept code") }}</td>
                <td>
                  {{ submitedDialogContent.submitter.dept }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("Extention No") }}</td>
                <td>
                  {{ submitedDialogContent.submitter.ext_no }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("Email") }}</td>
                <td>
                  {{ submitedDialogContent.submitter.email }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("Submited at") }}</td>
                <td>
                  {{ submitedDialogContent.created_at }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click.native="submitedDialog = false">{{
            $t("Close")
            }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogApproveReq" max-width="800px">
      <v-card>
        <v-toolbar dense color="teal" dark>
          <v-toolbar-title title="Repair proposal" class="d-flex" style="align-items: center">
            {{
              dialogDataDetail.status === "waiting_ga"
                ? $t("Waiting GA - Please Select repair type")
                : dialogDataDetail.status === "processing"
                  ? $t("Confirm Processed")
                  : dialogDataDetail.status === "processed"
                    ? $t("Confirm Completed")
                    : $t("Approve Request")
            }}
          </v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <div v-if="dialogDataDetail.status === 'waiting_ga'" class="d-flex mt-3" style="justify-content: space-around">
          <v-radio-group v-model="selected_repair_type">
            <v-row>
              <v-col v-for="item in repairType" :key="item.id" cols="6" class="py-1">
                <v-radio :value="item.value">
                  <template v-slot:label>
                    <span>{{ $t(item.text) }}</span>
                  </template>
                </v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
          <v-text-field style="max-width: 100px; margin-left: 20px" v-if="selected_repair_type === 'external'" dense
            hide-details="" :label="$t('USD')" v-model="externalValue" outlined></v-text-field>

          <v-btn v-if="
            selected_repair_type === 'external' &&
            dialogDataDetail.status === 'waiting_ga'
          " @click="showDialogUploadQuoteFile(item)" color="success" dark>
            <v-icon left>mdi-upload</v-icon>
            {{ $t("Upload Quote File") }}
          </v-btn>
        </div>

        <v-card-title class="text-h6 font-weight-bold">
          {{ $t("Please provide your comments ( if any )") }}
        </v-card-title>

        <v-card-text>
          <v-textarea hide-details v-model="approvalComment" :label="$t('Enter your comment')" outlined dense rows="4"
            clearable></v-textarea>
        </v-card-text>

        <v-card-actions>
          <v-btn outlined text color="error" @click="closeDialogApproveReq()">
            {{ $t("Close") }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="teal" class="white--text" @click="approveReq()">
            {{ $t("Confirm") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="uploadQuoteFileDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title class="text-h5">
          {{ $t("Upload Quote File") }}
        </v-card-title>
        <v-card-text class="pb-0">
          <v-file-input truncate-length="50" counter show-size v-model="quotationFiles" :label="$t('Choose Quote file')"
            multiple outlined dense></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" text @click.native="uploadQuoteFileDialog = false">{{ $t("Close") }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="!quotationFiles" color="primary" text @click="uploadQuoteFile()">{{ $t("Upload File")
            }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDialogAddProcessSituation" max-width="800px" persistent>
      <v-card>
        <v-card-title class="text-h5 d-flex justify-space-between">
          {{ $t("Update the progress of the request") }}
          <v-btn color="error" text @click="showDialogAddProcessSituation = false">{{ $t("Close") }}</v-btn>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-textarea outlined v-model="newProcessSituation" hide-details="" solo name="input-7-4"
            label="Update the progress...."></v-textarea>
        </v-card-text>
        <v-card-actions>
          
          <v-spacer></v-spacer>
          <v-btn :disabled="!newProcessSituation" color="primary" @click="saveDataProcessSituation()">{{ $t("Update") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDialogDataProcessSituation" max-width="800px" persistent>
      <v-card>
        <v-card-title class="text-h5 d-flex justify-space-between">
          {{ $t("Update the progress of the request") }}
          <v-btn color="error" text @click="showDialogDataProcessSituation = false">{{ $t("Close") }}</v-btn>
        </v-card-title>

        <v-card-text class="pb-0">
          <template v-if="processList && processList.length">
            <v-list dense>
              <div v-for="(it, idx) in processList" :key="`row-${it.empno}-${it.when}-${idx}`">
                <v-list-item three-line style="align-items:flex-start;">
                  <v-list-item-content>
                    <v-list-item-title
                      style="font-size:15px; white-space:normal; overflow-wrap:anywhere; word-break:break-word; text-overflow:clip; line-height: 1.4;">
                      {{ it.empno }} - {{ it.name }} - {{ it.when || '-' }}<br>
                      {{ $t("Update") }}: {{ it.process_situation }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider v-if="idx < processList.length - 1" />
              </div>
            </v-list>
          </template>

          <template v-else>
            <em>{{ $t("No updates yet") }}</em>
          </template>
        </v-card-text>

        <v-card-actions>
          <v-btn v-if="isGaManager || isEmpInStaffGa" color="primary"
            @click="openDialogAddProcessSituation(dialogDataDetail.id)"><v-icon>mdi-pen-plus</v-icon></v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <staff v-model="showStaffDialog" />
    <Location v-model="showLocationDialog" />
  </v-row>
</template>

<script>
import { mdiPaperclip, mdiRefreshCircle, mdiLinkVariant } from "@mdi/js";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import VfaAppFlow from "../../../@global-component/vfa-updated";
import Swal from "sweetalert2";
dayjs.extend(isSameOrAfter);
export default {
  components: {
    VfaAppFlow,
    Staff: () => import("../components/staff.vue"),
    Location: () => import("../components/Location.vue"),
  },
  name: "DashboardPage",
  data() {
    return {
      api: "http://gmo021.cansportsvg.com/api/rpaAwDemo/",
      apiGlobalUser: "http://gmo021.cansportsvg.com/api/global-user/",
      statusFilter: 0,
      showDialogComponentDetail: false,
      dialogApproveReq: false,
      approvalComment: null,
      submitedDialog: false,
      submitedDialogContent: null,
      filteredArea: "all",
      dataReq: [],
      exportData: [],
      showDialogCreate: false,
      repairType: [
        { text: this.$t("Internal"), value: "internal" },
        { text: this.$t("External"), value: "external" },
      ],
      selected_repair_type: null,
      externalValue: 0,
      uploadQuoteFileDialog: false,
      quotationFile: null,
      quotationFiles: [],
      headers: [
        { text: "ID", value: "id" },
        { text: "Approval", value: "approval", sortable: false },
        { text: "Status", value: "status", sortable: false },
        { text: "Process Situation by GA", value: "process_situation", sortable: false },
        { text: "Action", value: "action", sortable: false },
        { text: "Area", value: "area" },
        { text: "Location", value: "location", sortable: false },
        { text: "Request ID", value: "request_id" },
        { text: "Date need", value: "date_need" },
        { text: "Department", value: "department", sortable: false },
        { text: "Submitter", value: "submitter", sortable: false },
        { text: "Repair Type", value: "repair_type" },
        { text: "Request Type", value: "type_request", sortable: false },
        { text: "Category", value: "category", sortable: false },
        { text: "Problem", value: "problem", sortable: false },
        { text: "History Logs", value: "history_logs", sortable: false },
      ],
      activeUser: null,
      search: null,
      showCancelDialog: false,
      cancelReason: null,
      selectedBooking: null,
      dialogDeclineReq: false,
      decline_reason: null,
      showDenyInfoDialog: false,
      showWaitingConfirmDialog: false,
      infoHistoryLog: false,
      waitingConfirmInfo: [],
      filterData: {
        dept: [],
        high_dept: [],
        empno: [],
        repairType: [],
      },

      dialogDataDetail: {},
      itemsArea: [],
      listStaffGa: [],
      showStaffDialog: false,
      showLocationDialog: false,
      checkTodoTab: false,
      isReloading: false,
      showDialogAddProcessSituation: false,
      showDialogDataProcessSituation: false,
      dataAppFlowChanged: [],
      newProcessSituation: null,
      // isGaManager: false,
    };
  },
  async created() { },
  watch: {
    filteredItems: {
      handler(newValue) {
        // Nếu statusFilter = 1 và filteredItems rỗng thì set statusFilter = 0 
        if (!this.checkTodoTab && this.statusFilter === 0 && newValue.length === 0) {
          this.statusFilter = 1;
          this.checkTodoTab = true;
        }
      },
      deep: true
    },
    selected_repair_type(newVal) {
      if (newVal !== 'external') {
        this.externalValue = 0;
      }
    }
  },
  methods: {
    openDialogDataProcessSituation(item) {
      this.dialogDataDetail = item;
      this.showDialogDataProcessSituation = true;
    },
    async saveDataProcessSituation() {
      let params = {
        id: this.dialogDataDetail.id,
        process_situation: this.newProcessSituation,
        userData: this.activeUser
      };
      await this.$axios.post(this.api + "saveProcessSituation", params)
        .then((res) => {
          this.showDialogAddProcessSituation = false;
          this.showDialogDataProcessSituation = false;
          this.newProcessSituation = null;
          this.reloadPage();
        })
        .catch((err) => {
          this.$toast.error(this.$t("Error updating process situation"));
        });
    },

    openDialogAddProcessSituation(id) {
      this.dialogDataDetail = this.dataReq.find(item => item.id === id) || {};
      this.showDialogAddProcessSituation = true;
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
            deputies: x.deputies,
          };
        }),
      }));
      this.dataAppFlowChanged = this.dataAppFlow;

    },

    customFilter(value, search, item) {
      if (!search) return true;

      search = search.toString().toLowerCase();

      // Check if the value itself contains the search term
      if (value != null && value.toString().toLowerCase().includes(search)) {
        return true;
      }

      // Check submitter empno
      if (item.submitter && item.submitter.empno &&
        item.submitter.empno.toString().toLowerCase().includes(search)) {
        return true;
      }

      // Check submitter name
      if (item.submitter && item.submitter.name &&
        item.submitter.name.toString().toLowerCase().includes(search)) {
        return true;
      }

      // Check department
      if (item.submitter && item.submitter.dept &&
        item.submitter.dept.toString().toLowerCase().includes(search)) {
        return true;
      }

      // Check high department
      if (item.submitter && item.submitter.high_dept &&
        item.submitter.high_dept.toString().toLowerCase().includes(search)) {
        return true;
      }

      // Check combined department/high_dept
      if (item.submitter && item.submitter.dept && item.submitter.high_dept) {
        const combinedDept = `${item.submitter.dept} / ${item.submitter.high_dept}`.toLowerCase();
        if (combinedDept.includes(search)) {
          return true;
        }
      }
      if (item.category) {
        const categoryTranslations = Object.values(item.category);
        const hasMatchingCategory = categoryTranslations.some(translation =>
          translation && translation.toString().toLowerCase().includes(search)
        );
        if (hasMatchingCategory) {
          return true;
        }
      }

      // Check problem translations
      if (item.problem) {
        const problemTranslations = Object.values(item.problem);
        const hasMatchingProblem = problemTranslations.some(translation =>
          translation && translation.toString().toLowerCase().includes(search)
        );
        if (hasMatchingProblem) {
          return true;
        }
      }
      // Check repair type with translations
      if (item.repair_type) {
        const translatedRepairType = item.repair_type === "internal"
          ? this.$t("Internal").toString().toLowerCase()
          : item.repair_type === "external"
            ? this.$t("External").toString().toLowerCase()
            : "";

        if (translatedRepairType.includes(search)) {
          return true;
        }
      }
      // Check type request with translations
      if (item.type_request) {
        const translatedTypeRequest =
          item.type_request === "asset"
            ? this.$t("Asset").toString().toLowerCase()
            : item.type_request === "machine"
              ? this.$t("Machine").toString().toLowerCase()
              : item.type_request === "equipment"
                ? this.$t("Equipment").toString().toLowerCase()
                : item.type_request === "electricity"
                  ? this.$t("Electricity, Water").toString().toLowerCase()
                  : item.type_request === "renovation"
                    ? this.$t("Renovation").toString().toLowerCase()
                    : item.type_request === "other"
                      ? this.$t("Other").toString().toLowerCase()
                      : item.type_request === "molds"
                        ? this.$t("Molds").toString().toLowerCase()
                        : "";

        if (translatedTypeRequest.includes(search)) {
          return true;
        }
      }
      // Check request_id
      if (item.request_id &&
        item.request_id.toString().toLowerCase().includes(search)) {
        return true;
      }

      return false;
    },
    openCompPrint(item) {
      this.dialogDataDetail = item;

      this.$nextTick(() => {
        setTimeout(() => {
          window.print();
        }, 500);
      });
    },
    uploadQuoteFile() {
      if (
        !confirm(
          "Confirm Upload Quote File?\nXác nhận tải lên file báo giá\n確認上傳報價文件"
        )
      )
        return;

      let formData = new FormData();
      formData.append("id", this.dialogDataDetail.id);

      // Gửi từng file
      this.quotationFiles.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });

      this.$axios
        .post(this.api + "uploadQuoteFiles", formData)
        .then((res) => {
          this.uploadQuoteFileDialog = false;
          this.reloadPage();
        })
        .catch((err) => {
          console.log("uploadQuoteFiles", err);
        });
    },
    showDialogUploadQuoteFile() {
      this.uploadQuoteFileDialog = true;
    },
    async showDialogApproveReq(item) {
      this.dialogDataDetail = item;
      let params = {
        id: item.id,
        area: item.area,
        empno: item.submitter.empno,
        dept: item.dept,
        high_dept: item.high_dept,
      };

      await this.$axios
        .post(this.api + "getDataFlowForItem", params)
        .then((res) => {
          if (res.data) {
            // Gán dataFlow vào biến của component
            this.dialogDataDetail.dataFlow = res.data.flow_data || [];
          }
        })
        .catch((error) => {
          console.log("getDataFlowForItem", error);
        });
      this.dialogApproveReq = true;
    },
    async showDialogDeclineReq(item) {
      this.dialogDataDetail = item;
      let params = {
        id: item.id,
        area: item.area,
        empno: item.submitter.empno,
        dept: item.dept,
        high_dept: item.high_dept,
      };

      await this.$axios
        .post(this.api + "getDataFlowForItem", params)
        .then((res) => {
          if (res.data) {
            // Gán dataFlow vào biến của component
            this.dialogDataDetail.dataFlow = res.data.flow_data || [];
          }
        })
        .catch((error) => {
          console.log("getDataFlowForItem", error);
        });

      this.dialogDeclineReq = true;
    },
    async approveReq() {
      if (this.dialogDataDetail.status === "waiting_ga") {
        if (!this.selected_repair_type) {
          alert(
            this.$t(
              "You have not selected a repair type \n bạn chưa chọn loại sửa chữa \n 你还没有选择修理类型"
            )
          );
          return;
        }
        if (this.selected_repair_type === "external" && !this.externalValue) {
          alert(
            this.$t(
              "You have not entered the USD value \n bạn chưa nhập giá USD \n 你还没有输入USD值"
            )
          );
          return;
        }
      }

      if (
        !confirm(
          this.$t(
            "Are you sure you want to approve this request? \n bạn có chắc chắn muốn duyệt yêu cầu này không? \n 你确定要批准此请求吗？"
          )
        )
      ) {
        return;
      }
      // const time = new Date().toLocaleString();
      const date = new Date();
      const time = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}, ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
        2,
        "0"
      )}:${String(date.getSeconds()).padStart(2, "0")}`;
      let params = {
        dataReq: this.dialogDataDetail,
        repair_type: this.selected_repair_type,
        quote: this.externalValue
          ? this.externalValue
          : this.dialogDataDetail.quote,
        confirmer: {
          empno: this.activeUser.empno,
          name: this.activeUser.name,
          dept: this.activeUser.dept,
          high_dept: this.activeUser.hight_dept,
          email: this.activeUser.email,
          comment: this.approvalComment,
          time: time,
        },
      };

      try {
        const res = await this.$axios.post(this.api + "approveReq", params);
        // console.log("listEmailDivisonManager", res.data.listEmailDivisonManager);
        this.closeDialogApproveReq();
        // this.$emit("closeDialogDetailRegistration");
        this.approvalComment = null;
        this.reloadPage();
      } catch (error) {
        console.error(error);
      }
    },
    closeDialogApproveReq() {
      this.dialogApproveReq = false;
      this.selected_repair_type = null;
      this.externalValue = 0;
      this.approvalComment = null;
    },

    async declineReq() {
      const confirmMessage =
        this.dialogDataDetail.status === "processed"
          ? "Are you sure you want to CONFIRMATION NOT COMPLETED? \n bạn có chắc chắn muốn xác nhận KHÔNG HOÀN THÀNH? \n 你确定要确认未完成吗？"
          : "Are you sure you want to decline this request? \n bạn có chắc chắn muốn từ chối yêu cầu này không? \n 你确定要拒绝此请求吗？";

      if (!confirm(confirmMessage)) {
        return;
      }

      let params = {
        dataReq: this.dialogDataDetail,
        confirmer: {
          empno: this.activeUser.empno,
          name: this.activeUser.name,
          dept: this.activeUser.dept,
          high_dept: this.activeUser.hight_dept,
          email: this.activeUser.email,
          comment: this.decline_reason,
        },
      };
      await this.$axios.post(this.api + "declineReq", params).then((res) => {
        this.dialogDeclineReq = false;
        this.decline_reason = null;
        this.reloadPage();
      });
    },

    canApproval(item) {
      // console.log("canApproval", item);
      
      const activeManager = (flow, status) =>
        flow?.managers.some(
          (manager) =>
            manager.empno === this.activeUser.empno ||
            manager.deputies?.some(
              (deputy) =>
                deputy.empno === this.activeUser.empno && deputy.status
            )
        ) && item.status === status;
      const isProcessing =
        item.status === "processing" &&
        this.listStaffGa.some((staff) => staff.empno === this.activeUser.empno);

      return (
        activeManager(
          item.dataFlow.find((f) => f.lvl_code === "dept_manager"),
          "waiting_dept"
        ) ||
        activeManager(
        item.dataFlow.find((f) => f.lvl_code === "dept_manager"),
          "waiting_dept_2"
        ) ||
        activeManager(
          item.dataFlow.find((f) => f.lvl_code === "division_manager"),
          "waiting_division"
        ) ||
        activeManager(
          item.dataFlow.find((f) => f.lvl_code === "ga_manager_test"),
          "waiting_ga"
        ) ||
        activeManager(
          item.dataFlow.find((f) => f.lvl_code === "ga_division_test"),
          "waiting_division_ga"
        ) ||
        activeManager(
          item.dataFlow.find((f) => f.lvl_code === "general_manager_demo"),
          "waiting_bu"
        ) ||
        activeManager(
          item.dataFlow.find((f) => f.lvl_code === "ceo_manager"),
          "waiting_ceo"
        ) ||
        activeManager(
          item.dataFlow.find((f) => f.lvl_code === "dept_manager"),
          "processed"
        ) ||
        isProcessing
      );
    },

    showSubmitedDetail(item) {
      this.submitedDialog = true;
      this.submitedDialogContent = item;
    },
    async getArea() {
      let params = {
        area: this.activeUser.location,
      };
      await this.$axios.post(this.api + "getArea", params).then((res) => {
        if (res.status === 200) {
          this.itemsArea = res.data;
        } else {
          this.showMsg("error", Error);
        }
      });
    },
    async getListStaffGa() {
      await this.$axios.get(this.api + "getListStaffGa").then((res) => {
        if (res.status === 200) {
          this.listStaffGa = res.data;
        } else {
          this.showMsg("error", Error);
        }
      });
    },
    getStatusText(item) {
      switch (item.status) {
        case "waiting_submitter":
          return this.$t("Waiting Submitter");
        case "waiting_dept":
          return this.$t("Waiting Department");
          case "waiting_dept_2":
          return this.$t("Waiting Department");
        case "waiting_division":
          return this.$t("Waiting Division");
        case "waiting_ga":
          return this.$t("Waiting GA");
        case "waiting_division_ga":
          return this.$t("Waiting GA Division");
        case "waiting_bu":
          return this.$t("Waiting BU HEAD");
        case "processing":
          return this.$t("Processing");
        case "processed":
          return this.$t("Processed");
        case "completed":
          return this.$t("Completed");
        case "declined":
          return this.$t("Declined");
        case "expired":
          return this.$t("Expired");
        case "cancelled":
          return this.$t("Cancelled");
        default:
          return "";
      }
    },
    getStatusText2(item) {
      switch (item.status) {
        case "waiting_dept":
          return [
            ...new Set(
              item.dataFlow
                .filter((flow) => flow.lvl_code === "dept_manager")
                .flatMap((flow) => flow.managers)
                .flatMap((manager) => [
                  manager.name,
                  ...manager.deputies
                    .filter((deputy) => deputy.status === true)
                    .map((deputy) => deputy.name),
                ])
            ),
          ].join(", ");
            case "waiting_dept_2":
          return [
            ...new Set(
              item.dataFlow
                .filter((flow) => flow.lvl_code === "dept_manager")
                .flatMap((flow) => flow.managers)
                .flatMap((manager) => [
                  manager.name,
                  ...manager.deputies
                    .filter((deputy) => deputy.status === true)
                    .map((deputy) => deputy.name),
                ])
            ),
          ].join(", ");
        case "processed":
          return [
            ...new Set(
              item.dataFlow
                .filter((flow) => flow.lvl_code === "dept_manager")
                .flatMap((flow) => flow.managers)
                .flatMap((manager) => [
                  manager.name,
                  ...manager.deputies
                    .filter((deputy) => deputy.status === true)
                    .map((deputy) => deputy.name),
                ])
            ),
          ].join(", ");

        case "waiting_division":
          return [
            ...new Set(
              item.dataFlow
                .filter((flow) => flow.lvl_code === "division_manager")
                .flatMap((flow) => flow.managers)
                .flatMap((manager) => [
                  manager.name,
                  ...manager.deputies
                    .filter((deputy) => deputy.status === true)
                    .map((deputy) => deputy.name),
                ])
            ),
          ].join(", ");

        case "waiting_ga":
          return [
            ...new Set(
              item.dataFlow
                .filter((flow) => flow.lvl_code === "ga_manager_test")
                .flatMap((flow) => flow.managers)
                .flatMap((manager) => [
                  manager.name,
                  ...manager.deputies
                    .filter((deputy) => deputy.status === true)
                    .map((deputy) => deputy.name),
                ])
            ),
          ].join(", ");

        case "waiting_division_ga":
          return [
            ...new Set(
              item.dataFlow
                .filter((flow) => flow.lvl_code === "ga_division_test")
                .flatMap((flow) => flow.managers)
                .flatMap((manager) => [
                  manager.name,
                  ...manager.deputies
                    .filter((deputy) => deputy.status === true)
                    .map((deputy) => deputy.name),
                ])
            ),
          ].join(", ");

        case "waiting_bu":
          return [
            ...new Set(
              item.dataFlow
                .filter((flow) => flow.lvl_code === "general_manager_demo")
                .flatMap((flow) => flow.managers)
                .flatMap((manager) => [
                  manager.name,
                  ...manager.deputies
                    .filter((deputy) => deputy.status === true)
                    .map((deputy) => deputy.name),
                ])
            ),
          ].join(", ");

        case "processing":
          // return item.submitter.name;
          return this.listStaffGa.map((staff) => staff.name).join(", ");

        default:
          return "";
      }
    },

    showWaitingConfirmInfo(item) {
      this.waitingConfirmInfo = item.room_manager || [];
      this.showWaitingConfirmDialog = true;
    },

    async showHistoryLogs(item) {
      let params = {
        id: item.id,
      };

      await this.$axios
        .post(this.api + "getHistoryLogs", params)
        .then((res) => {
          this.dialogDataDetail = res.data;
        });
      // console.log("item", item);
      // this.dialogDataDetail = item;
      this.infoHistoryLog = true;
    },

    closeDialogHistoryLog() {
      this.infoHistoryLog = false;
    },
    async getDataDialogDetail(item) {
      this.dialogDataDetail = item;
      this.showDialogComponentDetail = true;
    },
    async closeDialogSign() {
      this.reloadPage();
      this.showDialogComponentDetail = false;
    },
    async closeDialogDetailRegistration() {
      this.showDialogComponentDetail = false;
      this.dialogDataDetail = {};
      this.reloadPage();
    },

    async getFormCreate() {
      this.showDialogCreate = true;
    },
    async getAllReqList() {
      this.isReloading = true;
      let params = {
        location: this.activeUser.location,
        empno: this.activeUser.empno,
        high_dept: this.activeUser.hight_dept,
        dept: this.activeUser.dept,
        role: this.activeUser.role,
      };
      await this.$axios.post(this.api + "getAllReqListV2", params).then((res) => {
        this.dataReq = res.data.map((item) => ({
          ...item,
          area: item.area.toUpperCase(),
        }));
        this.isReloading = false; // dừng xoay icon
      });
    },

    async getFormCreate() {
      this.showDialogCreate = true;
    },
    async closeDialogCreate() {
      this.showDialogCreate = false;
      this.reloadPage();
    },
    reloadPage() {
      this.getAllReqList();
    },
    cancelBooking(item) {
      this.selectedBooking = item;
      this.showCancelDialog = true;
    },
    async confirmCancelBooking() {
      try {
        let params = {
          id: this.selectedBooking.id,
          confirmer: {
            empno: this.activeUser.empno,
            name: this.activeUser.name,
            dept: this.activeUser.dept,
            high_dept: this.activeUser.hight_dept,
            email: this.activeUser.email,
          },
          reasonCancel: this.cancelReason,
        };
        await this.$axios.post(this.api + "cancelBooking", params);
        this.getAllReqList();
        this.showCancelDialog = false;
        this.cancelReason = "";
        this.selectedBooking = null;
      } catch (error) {
        console.log(error);
      }
    },

    showWaitingConfirmInfo(item) {
      this.waitingConfirmInfo = item.room_manager || [];
      this.showWaitingConfirmDialog = true;
    },
    getStatusColor(status) {
      switch (status) {
        case "waiting_confirm":
          return "teal";
        case "cancel":
          return "red";
        case "booked":
          return "blue";
        case "deny":
          return "orange";
        default:
          return "grey";
      }
    },
    getStatusLabel(status) {
      switch (status) {
        case "waiting_confirm":
          return this.$t("Waiting Confirm");
        case "cancel":
          return this.$t("Cancel");
        case "booked":
          return this.$t("Booked");
        case "deny":
          return this.$t("Deny");
        default:
          return "";
      }
    },
    openStaffDialog() {
      this.showStaffDialog = true;
    },
    openLocationDialog() {
      this.showLocationDialog = true;
    },
    excelreport() {
      return this.filteredItems.map(item => {
        return {
          "ID": item.id,
          "Approval": "",  // Empty since this is an action column
          "Status": this.getStatusText(item),
          "Area": item.area,
          "Location": item.location,
          "Request ID": item.request_id,
          "Date need": item.date_need,
          "Extention no": item.ext_no,
          "Department": `${item.submitter.dept} / ${item.submitter.high_dept}`,
          "Division": item.submitter.high_dept,
          "Submitter": `${item.submitter.empno} - ${item.submitter.name}`,
          "Repair Type": item.repair_type === "internal" ? this.$t("Internal") :
            item.repair_type === "external" ? this.$t("External") : "",
          "Request Type": item.type_request === "asset" ? this.$t("Asset") :
            item.type_request === "machine" ? this.$t("Machine") :
              item.type_request === "molds" ? this.$t("Molds") :
                item.type_request === "equipment" ? this.$t("Equipment") :
                  item.type_request === "electricity" ? this.$t("Electricity, Water") :
                    item.type_request === "renovation" ? this.$t("Renovation") :
                      item.type_request === "other" ? this.$t("Other") : "",
          "Category": item.category[this.$i18n.locale],
          "Problem": item.problem[this.$i18n.locale],
          "History Logs": "",  // Empty since this is an action column
          "Action": ""  // Empty since this is an action column
        };
      });
    }
  },

  mounted() {
    this.activeUser = this.$session.get("aw_rpa_demo");
    if (this.activeUser) {
      this.getArea();
      this.getListStaffGa();
      this.getAllReqList();
    }
  },
  computed: {
    processList() {
      const ps = this.dialogDataDetail?.process_situation;

      // Trường hợp đã là mảng
      if (Array.isArray(ps)) return ps;

      // Trường hợp là chuỗi JSON
      if (typeof ps === 'string' && ps.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(ps);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }

      // Các trường hợp khác (null, object lệch định dạng)
      return [];
    },
    combinedStaffGaAndCompletedLogs() {
      const staffLogs = this.dialogDataDetail.staff_ga_confirm || [];
      const completedLogs = this.dialogDataDetail.completed_logs || [];

      const maxLength = Math.max(staffLogs.length, completedLogs.length);
      const combined = [];

      for (let i = 0; i < maxLength; i++) {
        if (staffLogs[i])
          combined.push({
            type: "Staff GA confirm Processed",
            log: staffLogs[i],
          });
        if (completedLogs[i])
          combined.push({ type: "Department Manager", log: completedLogs[i] });
      }

      return combined;
    },
    isEmpInStaffGa() {
      const result = this.listStaffGa.some(
        (staff) => staff.empno === this.activeUser.empno
      );
      return result;
    },

    isGaManager() {
      // lấy level3 an toàn theo nhãn hoặc theo index
      const level3 =
        this.dataAppFlowChanged?.find(l => l.level === 'level3') ??
        this.dataAppFlowChanged?.[2];

      const empno = this.activeUser?.empno;
      if (!level3 || !empno) {
        return false;
      }

      const managers = Array.isArray(level3.managers) ? level3.managers : [];

      const isInManagersOrDeputies = managers.some(m =>
        // 1) là manager trực tiếp
        m?.empno === empno
        // 2) hoặc là deputy có status true
        || (Array.isArray(m?.deputies) && m.deputies.some(d => {
          const statusTrue = (d?.status === true || d?.status === 'true' || d?.status === 1 || d?.status === '1');
          return statusTrue && d?.empno === empno;
        }))
      );

      return isInManagersOrDeputies;
    },
    filteredItems() {
      return this.dataReq.filter((item) => {
        let statusMatch = true;
        let submitterMatch = true;
        let deptMatch = true;
        let highDeptMatch = true;
        let repairTypeMatch = true;
        let areaMatch = true;

        if (this.filterData.empno.length) {
          submitterMatch = this.filterData.empno.includes(item.submitter.empno);
        }

        if (this.filterData.dept.length) {
          deptMatch = this.filterData.dept.includes(item.submitter.dept);
        }

        if (this.filterData.high_dept.length) {
          highDeptMatch = this.filterData.high_dept.includes(
            item.submitter.high_dept
          );
        }
        if (this.filterData.repairType.length) {
          repairTypeMatch = this.filterData.repairType.includes(item.repair_type);
        }

        if (this.filteredArea !== "all") {
          areaMatch = item.area === this.filteredArea.toUpperCase();
        }

        switch (this.statusFilter) {
          case 0:
            statusMatch = this.canApproval(item);
            break;
          case 1:
            statusMatch = true;
            break;
          case 2:
            statusMatch = item.status.includes("waiting");
            break;
          case 3:
            statusMatch = item.status === "processing";
            break;
          case 4:
            statusMatch = item.status === "processed";
            break;
          case 5:
            statusMatch = item.status === "completed";
            break;
          case 6:
            statusMatch = item.status === "declined" || item.status === "cancel";
            break;
          case 7:
            statusMatch = Number(item.quote) >= 3000;
            break;
          default:
            statusMatch = true;
            break;
        }

        // Trả về kết quả nếu tất cả các điều kiện đều khớp
        return (
          statusMatch &&
          deptMatch &&
          submitterMatch &&
          highDeptMatch &&
          repairTypeMatch &&
          areaMatch
        );
      });
    },

    eventColorsStartTime() {
      const colors = {};
      this.dataReq.forEach((item) => {
        colors[item.date] = "blue";
      });
      return colors;
    },

    filterDept() {
      const depts = this.dataReq.map((item) => item.submitter.dept);
      return [...new Set(depts)];
    },
    filterHighDept() {
      const high_dept = this.dataReq.map((item) => item.submitter.high_dept);
      return [...new Set(high_dept)];
    },
    filterEmpno() {
      const empno = this.dataReq.map((item) => item.submitter.empno);
      return [...new Set(empno)];
    },
    filterRepairType() {
      const repairTypes = [
        { text: this.$t('repair_type.internal'), value: 'internal' },
        { text: this.$t('repair_type.external'), value: 'external' }
      ];

      return repairTypes.filter(type =>
        this.dataReq.some(item => item.repair_type === type.value)
      ).map(type => ({
        text: type.text,
        value: type.value
      }));
    },
    isAdmin() {
      return this.activeUser && this.activeUser.role === "admin";
    },
  },
};
</script>
<style lang="scss">
.v-data-table th,
td {
  white-space: nowrap;
}

@media print {
  .noPrint {
    display: none;
  }

  body,
  html,
  #app,
  .v-application,
  .v-application--wrap,
  .v-main,
  .v-main__wrap,
  .v-container,
  .v-row,
  .v-col {
    margin: 0 !important;
    padding: 0 !important;
  }
}

.comment-wrap {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
  white-space: normal;
  word-break: break-word;
}

.mdi-spin {
  animation: mdi-spin 1s infinite linear;
}

@keyframes mdi-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
<i18n>
  {
    "en": {
      "EXPORT EXCEL": "EXPORT EXCEL",
      "Approve Request": "Approve Request",
      "Confirmation not completed": "Confirmation not completed",
      "Confirm Processed": "Confirm Processed",
      "Repair Type": "Repair Type",
      "Internal": "Internal",
      "External": "External",
      "Waiting GA - Please Select repair type": "Waiting GA - Please Select repair type",
      "Submiter detail": "Submiter detail",
      "Empno": "Empno",
      "Fullname": "Fullname",
      "Dept code": "Dept code",
      "Extention No": "Extention No",
      "Email": "Email",
      "Submited at": "Submited at",
      "Upload Quote File": "Upload Quote File",
      "Choose Quote file": "Choose Quote file",
      "Staff GA confirm Processed": "Staff GA confirm Processed",
      "Confirm Completed": "Confirm Completed",
      "To do": "To do",
      "All": "All",
      "Waiting": "Waiting",
      "Approval": "Approval",
      "Decline": "Decline",
      "The refuser": "The refuser",
      "Department manager of submitter": "Department manager of submitter",
      "Waiting Department": "Waiting Department",
      "Waiting Division": "Waiting Division",
      "Waiting GA": "Waiting GA",
      "Waiting GA Division": "Waiting GA Division",
      "Waiting BU HEAD": "Waiting BU HEAD",
      "Processing": "Processing",
      "Processed": "Processed",
      "Completed": "Completed",
      "Declined": "Declined",
      "Expired": "Expired",
      "Cancelled": "Cancelled",
      "Asset": "Asset Code",
      "Machine": "Machine",
      "Equipment": "Equipment",
      "Electricity, Water": "Electricity, Water",
      "Molds": "Molds",
      "Renovation": "Renovation",
      "Other": "Other",
      "Area": "Area",
      "Location": "Location",
      "Request ID": "Request ID",
      "Date need": "Date need",
      "Extention no": "Extention no",
      "Request Type": "Request Type",
      "Category": "Category",
      "Problem": "Problem",
      "Status": "Status",
      "Action": "Action",
      "Repair proposal": "Repair proposal",
      "ALL": "ALL",
      "Search": "Search",
      "Reload": "Reload",
      "New request": "New request",
      "Department": "Department",
      "Division": "Division",
      "Submitter": "Submitter",
      "History Logs": "History Logs",
      "Detail": "Detail",
      "Cancel Booking": "Cancel Booking",
      "Enter cancellation reason": "Enter cancellation reason",
      "Close": "Close",
      "Confirm": "Confirm",
      "Approval history": "Approval history",
      "Level": "Level",
      "Info": "Info",
      "Comment": "Comment",
      "Time": "Time",
      "Department Manager": "Department Manager",
      "Division Manager": "Division Manager",
      "GA Manager": "GA Manager",
      "Division GA Manager": "Division GA Manager",
      "BU HEAD": "BU HEAD",
      "Submitter confirm completed": "Submitter confirm completed",
      "Deny Booking": "Deny Booking",
      "Enter denial reason": "Enter denial reason",
      "Deny Information": "Deny Information",
      "Awaiting confirmation from one of these people:": "Awaiting confirmation from one of these people:",
      "Decline Request": "Decline Request",
      "Please provide your comments ( if any )": "Please provide your comments ( if any )",
      "Enter your comment": "Enter your comment",
      "Confirm decline": "Confirm decline",
      "repair_type": {
        "internal": "Internal",
        "external": "External"
      }
    },
    "vi": {
      "Update the progress of the request": "Cập nhật tiến độ xử lý của yêu cầu",
      "Process Situation by GA": "Tình hình xử lý của GA",
      "Update": "Cập nhật",
      "EXPORT EXCEL": "XUẤT EXCEL",
      "Approve Request": "Phê duyệt yêu cầu",
      "Confirmation not completed": "Xác nhận chưa hoàn thành",
      "Confirm Processed": "Xác nhận đã xử lý",
      "Repair Type": "Loại sửa",
      "Internal": "Nội bộ",
      "External": "Bên ngoài",
      "Waiting GA - Please Select repair type": "Chờ GA Xử lý- Vui lòng chọn loại sửa chữa",
      "Submiter detail": "Chi tiết người gửi",
      "Empno": "MST",
      "Fullname": "Họ tên",
      "Dept code": "Bộ phận",
      "Extention No": "Số nội bộ",
      "Email": "Email",
      "Submited at": "Gửi lúc",
      "Upload Quote File": "Tải lên tệp báo giá",
      "Choose Quote file": "Chọn tệp báo giá",
      "Staff GA confirm Processed": "Nhân viên GA xác nhận đã xử lý",
      "Confirm Completed": "Xác nhận hoàn thành",
      "To do": "Cần làm",
      "All": "Tất cả",
      "Waiting": "Đang chờ duyệt",
      "Decline": "Từ chối",
      "Approval": "Phê duyệt",
      "The refuser": "Người từ chối",
      "Department manager of submitter": "Quản lý bộ phận của người gửi",
      "Waiting Department": "Chờ CQ bộ phận",
      "Waiting Division": "Chờ CQ cấp sở",
      "Waiting GA": "Chờ GA",
      "Waiting GA Division": "Chờ CQ GA",
      "Waiting BU HEAD": "Chờ VP TGĐ",
      "Processing": "Đang xử lý",
      "Processed": "Đã xử lý",
      "Completed": "Hoàn thành",
      "Declined": "Từ chối",
      "Expired": "Hết hạn",
      "Cancelled": "Hủy",
      "Asset": "Tài sản",
      "Equipment": "Máy móc - thiết bị",
      "Electricity, Water": "Điện, Nước",
      "Molds": "Khuôn mẫu",
      "Renovation": "Tu bổ công trình",
      "Other": "Khác",
      "Area": "Khu vực",
      "Location": "Vị trí",
      "Request ID": "Mã yêu cầu",
      "Date need": "Ngày cần",
      "Extention no": "Số nội bộ",
      "Request Type": "Loại yêu cầu",
      "Category": "Danh mục",
      "Problem": "Vấn đề",
      "Status": "Trạng thái",
      "Action": "Hành động",
      "Repair proposal": "Đề xuất sửa chữa",
      "ALL": "TẤT CẢ",
      "Search": "Tìm kiếm",
      "Reload": "Tải lại",
      "New request": "Yêu cầu mới",
      "Department": "Phòng ban",
      "Division": "Bộ phận",
      "Submitter": "Người gửi",
      "History Logs": "lịch sử duyệt",
      "Detail": "Chi tiết",
      "Cancel Booking": "Hủy đặt phòng",
      "Enter cancellation reason": "Nhập lý do hủy",
      "Close": "Đóng",
      "Confirm": "Xác nhận",
      "Approval history": "Lịch sử phê duyệt",
      "Level": "Cấp độ",
      "Info": "Thông tin",
      "Comment": "Bình luận",
      "Time": "Thời gian",
      "Department Manager": "Chủ quản bộ phận",
      "Division Manager": "Chủ quản cấp sở",
      "GA Manager": "Quản lý GA",
      "Division GA Manager": "Ban quản lý",
      "BU HEAD": "Chủ quản cao nhất",
      "Submitter confirm completed": "Người gửi xác nhận hoàn thành",
      "Deny Booking": "Từ chối đặt phòng",
      "Enter denial reason": "Nhập lý do từ chối",
      "Deny Information": "Thông tin từ chối",
      "Awaiting confirmation from one of these people:": "Đang chờ xác nhận từ một trong những người này:",
      "Decline Request": "Từ chối yêu cầu",
      "Please provide your comments ( if any )": "Vui lòng cung cấp bình luận của bạn (nếu có)",
      "Enter your comment": "Nhập bình luận của bạn",
      "Confirm decline": "Xác nhận từ chối",
      "repair_type": {
        "internal": "Nội bộ",
        "external": "Bên ngoài"
      }
    },
    "cn": {
      "Update the progress of the request": "更新请求的处理进度",
      "Process Situation by GA": "總務處理進度",
      "Update": "更新",
      "EXPORT EXCEL": "导出Excel",
      "Approve Request": "批准请求",
      "Confirmation not completed": "确认未完成",
      "Confirm Processed": "确认已处理",
      "Repair Type": "维修类型",
      "Internal": "内部",
      "External": "外部",
      "Waiting GA - Please Select repair type": "等待GA - 请选择维修类型",
      "Submiter detail": "提交者详细信息",
      "Empno": "员工号",
      "Fullname": "全名",
      "Dept code": "部门代码",
      "Extention No": "分机号",
      "Email": "电子邮件",
      "Submited at": "提交于",
      "Upload Quote File": "上传报价文件",
      "Choose Quote file": "选择报价文件",
      "Staff GA confirm Processed": "GA员工确认已处理",
      "Confirm Completed": "确认完成",
      "To do": "待办",
      "All": "全部",
      "Waiting": "等待",
      "Decline": "拒绝",  
      "Approval": "批准",
      "The refuser": "拒绝者",
      "Department manager of submitter": "提交者的部门经理",
      "Waiting Department": "等待部級簽核",
      "Waiting Division": "等待處級簽核",
      "Waiting GA": "等待總務部簽核",
      "Waiting GA Division": "等待管理處簽核",
      "Waiting BU HEAD": "事業單位主管",
      "Processing": "处理中",
      "Processed": "已处理",
      "Completed": "已完成",
      "Declined": "拒绝",
      "Expired": "过期",
      "Cancelled": "取消", 
      "Asset": "资产",
      "Machine": "機器設備",
      "Equipment": "设备",
      "Electricity, Water": "水電",
      "Molds": "模具",
      "Renovation": "工程修繕",
      "Other": "其他",
      "Area": "區域",
      "Location": "位置",
      "Request ID": "請求ID",
      "Date need": "需要日期",
      "Extention no": "分機號",
      "Request Type": "請求類型",
      "Category": "類別",
      "Problem": "問題",
      "Status": "狀態",
      "Action": "行動",
      "Repair proposal": "維修單",
      "ALL": "全部",
      "Search": "搜索",
      "Reload": "重新加载",
      "New request": "新请求",
      "Department": "部门",
      "Division": "分部",
      "Submitter": "提交者",
      "History Logs": "历史记录",
      "Detail": "详情",
      "Cancel Booking": "取消预订",
      "Enter cancellation reason": "输入取消原因",
      "Close": "关闭",
      "Confirm": "确认",
      "Approval history": "审批历史",
      "Level": "级别",
      "Info": "信息",
      "Comment": "评论", 
      "Time": "时间",
      "Department Manager": "部級主管",
      "Division Manager": "處級主管",
      "GA Manager": "總務部主管",
      "Division GA Manager": "管理處主管",
      "BU HEAD": "事業單位最高主管",
      "Submitter confirm completed": "提交者确认完成",
      "Deny Booking": "拒绝预订",
      "Enter denial reason": "输入拒绝原因",
      "Deny Information": "拒绝信息",
      "Awaiting confirmation from one of these people:": "等待这些人中的一个确认：",
      "Decline Request": "拒绝请求",
      "Please provide your comments ( if any )": "请提供您的评论（如果有）",
      "Enter your comment": "输入您的评论",
      "Confirm decline": "确认拒绝",
      "repair_type": {
        "internal": "内部",
        "external": "外部"
      }
    }
  }
</i18n>