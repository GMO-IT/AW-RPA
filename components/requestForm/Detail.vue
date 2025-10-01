<template>
  <v-row>
    <v-col cols="12" class="noPrint">
      <v-card class="noPrint">
        <v-toolbar dense color="teal">
          <v-btn @click="closeDialogDetailRegistration()" nuxt small class="mr-2" color="orange" dark>
            <v-icon>mdi-keyboard-backspace</v-icon>
          </v-btn>
          <v-toolbar-title class="white--text">
            {{ $t("Detailed registration information") }} ( ID:
            {{ combinedDialogData.id }} )
          </v-toolbar-title>
          <v-spacer />
          <v-btn v-if="!editMode && canEditByStatus" small outlined class="white--text" @click="startGlobalEdit">
            <v-icon left>mdi-pencil</v-icon>{{ $t('Edit request') }}
          </v-btn>
          
          <template v-else-if="editMode">
            <v-btn small class="white--text" color="blue" @click="confirmGlobalEdit">
              <v-icon left>mdi-check-bold</v-icon>{{ $t('Save Edit') }}
            </v-btn>
            <v-btn class="ml-3" small dark outlined @click="cancelGlobalEdit">
              <v-icon left>mdi-close</v-icon>{{ $t('Cancel Edit') }}
            </v-btn>
          </template>
          <div class="pl-5">
            <v-btn class="white--text" @click="locale('vi')" text>VI</v-btn>
            <v-btn class="white--text" @click="locale('en')" text>EN</v-btn>
            <v-btn class="white--text" @click="locale('cn')" text>中文</v-btn>
          </div>
          <br />
        </v-toolbar>
      </v-card>
    </v-col>
    
    <v-col v-if="
    combinedDialogData &&
    combinedDialogData.submitter &&
    combinedDialogData.submitter.empno
    " cols="12" class="pt-0 noPrint">
    <VfaAppFlow v-show="false" v-if="activeUser && activeUser.empno" ref="AppFlow" appCode="aw_rpa_demo_display"
    :empno="combinedDialogData.submitter.empno" :location="activeUser.location"
    @sendAppFlow="handleAppFlow"></VfaAppFlow>
    
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

<v-card class="pl-3 pr-0 noPrint d-flex">
  <v-col cols="3" class="pr-0" v-if="activeUser && activeUser.empno">
    <h3 class="mb-4">{{ $t("Submitter") }}:</h3>
    
    <!-- Row 1: Empno / Name -->
    <v-row class="mb-0">
      <v-col cols="12" sm="6" class="py-0 pr-sm-2">
        <v-text-field outlined dense hide-details :label="$t('Empno')"
        :value="combinedDialogData && combinedDialogData.submitter ? combinedDialogData.submitter.empno : ''"
        readonly />
      </v-col>
      <v-col cols="12" sm="6" class="py-0 px-2">
        <v-text-field outlined dense hide-details :label="$t('Name')"
        :value="combinedDialogData && combinedDialogData.submitter ? combinedDialogData.submitter.name : ''"
        readonly />
      </v-col>
    </v-row>
    
    <!-- Row 2: Department / Division -->
    <v-row class="mb-0">
      <v-col cols="12" sm="6" class="py-0 pr-sm-2">
        <v-text-field outlined dense hide-details :label="$t('Department')"
        :value="combinedDialogData && combinedDialogData.submitter ? combinedDialogData.submitter.dept : ''"
        readonly />
      </v-col>
      <v-col cols="12" sm="6" class="py-0 px-2">
        <v-text-field outlined dense hide-details :label="$t('Division')"
        :value="combinedDialogData && combinedDialogData.submitter ? combinedDialogData.submitter.high_dept : ''"
        readonly />
      </v-col>
    </v-row>
    
    <!-- Row 3: Date Request / Date Need -->
    <v-row class="mb-0">
      <v-col cols="12" sm="6" class="py-0 pr-sm-2">
        <v-text-field outlined dense hide-details :label="$t('Date Request')"
        :value="combinedDialogData && combinedDialogData.date_request ? combinedDialogData.date_request.split(' ')[0] : ''"
        readonly />
      </v-col>
      <v-col cols="12" sm="6" class="py-0 px-2">
        <v-text-field outlined dense hide-details type="date" :label="$t('Date Need')"
        v-model="combinedDialogData.date_need" />
      </v-col>
    </v-row>
    
    <!-- Row 4: Extension no / Type Request -->
    <v-row class="mb-0">
      <v-col cols="12" sm="6" class="py-0 pr-sm-2">
        <v-text-field ref="extNoField" outlined dense hide-details :label="$t('Extension no')"
        v-model="combinedDialogData.submitter.ext_no" :readonly="!(editMode && canEditByStatus)" />
        
      </v-col>
      <v-col cols="12" sm="6" class="py-0 px-2">
        <v-text-field outlined dense hide-details readonly :label="$t('Type Request')"
        :value="combinedDialogData && combinedDialogData.type_request ? combinedDialogData.type_request : ''">
        <template v-slot:append
        v-if="editMode && combinedDialogData.status !== 'processing' && combinedDialogData.status !== 'declined' && combinedDialogData.status !== 'processed' && canApproval()">
        <v-icon @click.stop="editTypeRequest">mdi-pen</v-icon>
      </template>
    </v-text-field>
  </v-col>
</v-row>

<!-- Card chọn Type (full width, căn đều với grid) -->
<v-row v-if="editType" class="mb-2">
  <v-col cols="12" class="py-1">
    <v-card outlined elevation="12" class="px-4 pt-0" style="max-height: 250px; overflow-y: auto">
      <v-card-title class="pa-0 mb-0" :title="$t('Select type')">
        <span style="color: red; font-size: 15px">*</span>
        {{ $t("Select type") }}:
        <v-spacer />
        <v-btn small color="orange" @click="editType = !editType">Confirm</v-btn>
      </v-card-title>
      
      <v-radio-group v-model="combinedDialogData.type_request">
        <v-row>
          <v-col v-for="item in itemsType" :key="item.id" cols="12" sm="6" class="py-1">
            <v-radio :value="item.value">
              <template v-slot:label>
                <span>{{ $t(item.text) }}</span>
              </template>
            </v-radio>
          </v-col>
        </v-row>
      </v-radio-group>
    </v-card>
  </v-col>
</v-row>

<!-- Row 5: Area / Location -->
<v-row class="mb-0">
  <v-col cols="12" sm="6" class="py-0 pr-sm-2">
    <v-text-field outlined dense hide-details readonly :label="$t('Area')"
    :value="combinedDialogData && combinedDialogData.area ? combinedDialogData.area : ''">
    <template v-slot:append
    v-if="editMode && combinedDialogData.status !== 'processing' && combinedDialogData.status !== 'declined' && combinedDialogData.status !== 'processed' && canApproval()">
    <v-icon @click.stop="editAreaRequest">mdi-pen</v-icon>
  </template>
</v-text-field>
</v-col>
<v-col cols="12" sm="6" class="py-0 px-2">
  <v-text-field ref="locationField" outlined dense hide-details :label="$t('Location')"
  v-model="combinedDialogData.location" :readonly="!(editMode && canEditByStatus)" />
</v-col>
</v-row>

<!-- Card chọn Area (full width) -->
<v-row v-if="editArea" class="mb-2">
  <v-col cols="12" class="py-1">
    <v-card outlined elevation="12" class="px-4 pt-0" style="max-height: 250px; overflow-y: auto">
      <v-card-title class="pa-0 mb-0" :title="$t('Select Area')">
        <span style="color: red; font-size: 15px">*</span>
        {{ $t("Select Area") }}:
        <v-spacer />
        <v-btn small color="orange" @click="editArea = !editArea">Confirm</v-btn>
      </v-card-title>
      
      <div class="d-flex" style="align-items: center">
        <v-radio-group v-model="combinedDialogData.area" row class="my-3" hide-details>
          <v-radio v-for="(item, index) in itemsArea" :key="index"
          :label="typeof item === 'string' ? item.toUpperCase() : ''" :value="item" hide-details />
        </v-radio-group>
      </div>
    </v-card>
  </v-col>
</v-row>

<v-row v-if="
(combinedDialogData &&
combinedDialogData.status !== 'waiting_submitter' &&
combinedDialogData.status !== 'waiting_ga' &&
combinedDialogData.status !== 'waiting_dept' &&
combinedDialogData.status !== 'waiting_division')
||
(combinedDialogData.status === 'waiting_division' && combinedDialogData.repair_type)
" class="mb-2 mt-0">
<v-col cols="12" sm="6" class="pr-2">
  <v-text-field outlined dense hide-details readonly :label="$t('Type Repair')" :value="combinedDialogData && combinedDialogData.repair_type
  ? combinedDialogData.repair_type
  : ''
  " />
</v-col>

<v-col cols="12" sm="6" class="px-2">
  <v-text-field outlined dense hide-details readonly :label="$t('Quote (USD)')" :value="combinedDialogData && combinedDialogData.quote
  ? combinedDialogData.quote
  : ''
  " />
</v-col>
</v-row>

<v-card v-if="combinedDialogData.status === 'waiting_ga' && isManagerGa" class="px-4 pt-1"
style="max-height: 250px; overflow-y: auto">
<v-card-title class="pa-0 mb-0" :title="$t('Select repair type')">{{ $t("Select repair type")
}}:</v-card-title>
<div class="d-flex" style="justify-content: space-around">
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
</div>
</v-card>
<div class="d-flex" style="justify-content: space-between;">
  <v-btn v-if="
  selected_repair_type === 'external' &&
  combinedDialogData.status === 'waiting_ga'
  " @click="showDialogUploadQuoteFile(item)" color="success" dark block>
  <v-icon left>mdi-upload</v-icon>
  {{ $t("Upload quote file ") }}
</v-btn>
</div>

<div v-if="isEmpInStaffGa || isEmpInDataFlow || isEmpInDataDeptFlow">
  <div v-for="(file, index) in quoteFiles" :key="index"
  class="d-flex align-center my-3">
  <v-btn large color="orange" class="white--text flex-grow-1" style="max-width: 100%; min-width: 200px;"
  @click="openQuoteFile(file)">
  <div class="d-flex flex-column">
    <span>
      {{ $t("Show Quote File") }} {{ quoteFiles.length > 1 ? index + 1 : '' }}
    </span>
    <!-- <span class="text-caption">{{ file.split("/").pop() }}</span> -->
    <span class="text-caption"
    style="max-width: 222px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block;"
    :title="file.split('/').pop()">
    {{ truncateQuoteFileName(file.split('/').pop()) }}
  </span>
</div>
</v-btn>

<v-icon v-if="isEmpInDataFlow && combinedDialogData.status === 'waiting_ga'" class="ml-2" color="red"
title="Delete quote file" @click.stop="deleteQuoteFileName(file)">
mdi-delete
</v-icon>
</div>
</div>

<v-card v-if="attachedFile && attachedFile.length > 0" outlined class="mt-1 noPrint">
  <v-card-title class="pl-1 py-1 text-h6 font-weight-bold">
    {{ $t("List of attachments") }}:
    {{ attachedFile ? allAttachments.length : ""}}
    <v-btn
    v-if="editMode && canEditByStatus || (combinedDialogData.status === 'waiting_submitter' && activeUser.empno === combinedDialogData.submitter.empno)"
    class="ml-1"
    color="orange"
    icon
    dark
    @click="triggerFileInput"
    >
    <v-icon style="color: orange; font-size: 30px;">mdi-file-plus</v-icon>
  </v-btn>
  <v-file-input ref="fileInput" dense counter show-size multiple truncate-length="20" style="display: none"
  @change="addFiles"></v-file-input>
</v-card-title>

<v-card-text style="max-height: 150px; overflow-y: auto">
  <v-list class="my-0 py-0" v-if="allAttachments.length">
    <v-list-item-group>
      <v-list-item v-for="(item, index) in allAttachments" :key="item.id" :value="index" :style="{
        borderBottom: index !== allAttachments.length - 1 ? '3px dotted #e0e0e0' : 'none',
        paddingBottom: '1px',
        paddingTop: '5px',
      }">
      <v-list-item-content class="my-0 py-0">
        <v-list-item-title>
          <a style="font-size: 18px; line-height: 35px" :href="item.url" target="_blank">
            {{ item.name }}
          </a>
        </v-list-item-title>
      </v-list-item-content>
      
      <v-list-item-action class="my-0 py-0">
        <div class="d-flex">
          <v-btn @click="downloadFile(item.url)" icon title="Download this file">
            <v-icon style="color: blue">mdi-download</v-icon>
          </v-btn>
          
          <!-- LƯU Ý: dùng canApproval() (hàm) nếu đó là method, đừng dùng canApproval (sẽ luôn truthy) -->
          <v-btn v-if="editMode && canEditByStatus || (combinedDialogData.status === 'waiting_submitter' && activeUser.empno === combinedDialogData.submitter.empno)" @click="removeAttachment(item)" icon
          :title="item.kind === 'existing' ? 'Remove existing file' : 'Remove new file'">
          <v-icon style="color: red">mdi-close</v-icon>
        </v-btn>
      </div>
    </v-list-item-action>
  </v-list-item>
</v-list-item-group>
</v-list>
</v-card-text>
</v-card>

<v-btn v-if="combinedDialogData.status === 'processing' && isEmpInStaffGa" large color="teal"
class="white--text mt-3" block @click="showDialogApproveReq()">
{{ $t("Confirm Processed") }}
</v-btn>

<v-btn v-if="isEmpInStaffGa || activeUser.empno == '41638'" large color="orange" class="white--text mt-3"
block @click="openCompPrint(combinedDialogData)">
<v-icon left>mdi-printer</v-icon>
{{ $t("Print") }}
</v-btn>
</v-col>



<v-col cols="9">
  
  
  <v-card class="px-4 py-2 noPrint">
    <v-card-title class="pa-0 mb-0" :title="$t('Category Name')">
      {{ $t('Category Name:') }}
    </v-card-title>
    
    <!-- Category name -->
    <div class="d-flex mb-3">
      <v-text-field ref="categoryField-vi" outlined dense hide-details class="flex-grow-1"
      :label="$t('Category VI')" v-model="combinedDialogData.category.vi" :readonly="!editMode" />
      
      <v-text-field ref="categoryField-en" outlined dense hide-details class="mx-3 flex-grow-1"
      :label="$t('Category EN')" v-model="combinedDialogData.category.en" :readonly="!editMode" />
      
      <v-text-field ref="categoryField-cn" outlined dense hide-details class="flex-grow-1"
      :label="$t('Category CN')" v-model="combinedDialogData.category.cn" :readonly="!editMode" />
    </div>
    
    <v-row>
      <v-col cols="6">
        <v-card-title class="pa-0 mb-1 d-flex align-center" :title="$t('Asset code')">
          {{ $t('Asset code') }}
        </v-card-title>
        
        <!-- Asset code -->
        <div class="mb-3">
          <v-textarea ref="assetCodeField" rows="9" outlined dense hide-details :label="$t('Asset code')"
          v-model="combinedDialogData.asset_code" :readonly="!editMode" />
        </div>
      </v-col>
      
      <v-col cols="6">
        <v-card-title class="pa-0 mb-0" :title="$t('Cause of the problem')">
          {{ $t('Cause of the problem:') }}
        </v-card-title>
        
        <v-tabs v-model="activeTab" background-color="teal" color="yellow" grow dark>
          <v-tab>{{ $t('Problem EN') }}</v-tab>
          <v-tab>{{ $t('Problem VI') }}</v-tab>
          <v-tab>{{ $t('Problem CN') }}</v-tab>
          
          <!-- Problem EN -->
          <v-tab-item>
            <v-textarea ref="problemField-en" class="pt-2" rows="7" outlined dense hide-details
            :label="$t('Problem EN')" v-model="combinedDialogData.problem.en" :readonly="!editMode" />
          </v-tab-item>
          
          <!-- Problem VI -->
          <v-tab-item>
            <v-textarea ref="problemField-vi" class="pt-2" rows="7" outlined dense hide-details
            :label="$t('Problem VI')" v-model="combinedDialogData.problem.vi" :readonly="!editMode" />
          </v-tab-item>
          
          <!-- Problem CN -->
          <v-tab-item>
            
            <v-textarea ref="problemField-cn" class="pt-2" rows="7" outlined dense hide-details
            :label="$t('Problem CN')" v-model="combinedDialogData.problem.cn" :readonly="!editMode" />
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
  </v-card>
  
  
  <v-row v-if="!editMode">
    <v-btn
    v-if="combinedDialogData.status !== 'waiting_submitter' && combinedDialogData.status !== 'processing' && combinedDialogData.status !== 'declined' && combinedDialogData.status !== 'processed' && canApproval()"
    large color="error" class="ml-5 my-5" @click="showDialogDenyReq()">
    {{ $t("Deny") }}
  </v-btn>
  <v-btn
  v-if="combinedDialogData.status !== 'waiting_submitter' && combinedDialogData.status !== 'declined' && combinedDialogData.status !== 'processed' && (canApproval() || isEmpInStaffGa)"
  large color="orange" style="color: red" class="ml-5 my-5" @click="showDialogRevertReq()">
  {{
    $t(
      ['processing','waiting_division_ga','waiting_bu'].includes(combinedDialogData.status)
        ? 'Revert to waiting GA Department'
        : 'Revert to previous status'
    )
  }}
</v-btn>

<v-btn v-if="
combinedDialogData.status === 'processed' && isEmpInDataDeptFlow
" large color="error" class="white--text ml-5 my-5" @click="showDialogDenyReq()">
{{ $t("Confirm Not Completed") }}
</v-btn>
<v-spacer></v-spacer>
<v-btn
v-if="combinedDialogData.status !== 'processing' && combinedDialogData.status !== 'declined' && combinedDialogData.status !== 'processed' && canApproval()"
large color="primary" class="mr-5 my-5" @click="showDialogApproveReq()">
{{ $t(combinedDialogData.status !== 'waiting_submitter' ? "Approve" : "Re-Submit") }}
</v-btn>
<v-btn v-if="
combinedDialogData.status === 'processed' && isEmpInDataDeptFlow
" large color="teal" class="white--text mr-5 my-5" @click="showDialogApproveReq()">
{{ $t("Confirm Completed") }}
</v-btn>
</v-row>
</v-col>
</v-card>
</v-col>
<!-- v-if="showPrintContent" -->
<div>
  <RequestFormPrint id="print-content" :dialogDataDetailPrint="combinedDialogData" />
</div>

<v-dialog v-model="uploadQuoteFileDialog" max-width="500px" persistent>
  <v-card>
    <v-card-title class="text-h5">
      {{ $t("Upload Quote File") }}
    </v-card-title>
    <v-card-text class="pb-0">
      <!-- v-file-input ẩn đi -->
      <v-file-input ref="fileInput" style="display: none" truncate-length="50" counter show-size
      v-model="quotationFiles" multiple @change="onFileSelected"></v-file-input>
      
      <!-- Khối chứa để căn giữa -->
      <div style="text-align: center;">
        <v-btn color="primary" outlined @click="$refs.fileInput.$el.querySelector('input').click()">
          {{ $t('Choose Quote File') }}
        </v-btn>
        
        <!-- Hiển thị tên file đã chọn -->
        <div v-if="quotationFiles && quotationFiles.length" class="mt-2">
          <div v-for="(file, index) in quotationFiles" :key="index" class="text-caption"
          style="text-align: center; font-size:20px !important; margin-bottom: 10px;">
          {{ index + 1 }}. {{ file.name }} ({{ (file.size / 1024).toFixed(2) }} KB)
        </div>
      </div>
    </div>
  </v-card-text>
  <v-divider></v-divider>
  <v-card-actions>
    <v-btn color="primary" text @click.native="uploadQuoteFileDialog = false">{{ $t("Close") }}</v-btn>
    <v-spacer></v-spacer>
    <v-btn :disabled="!quotationFiles" color="primary" text @click="uploadQuoteFile()">{{ $t("Upload File")
    }}</v-btn>
  </v-card-actions>
</v-card>
</v-dialog>

<v-dialog v-model="showFileQuoteFileDialog" fullscreen>
  <v-card>
    <v-toolbar dense dark color="teal">
      <v-btn icon dark @click="dialog = false">
        <v-icon @click="showFileQuoteFileDialog = false">mdi-arrow-left-bold</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="pb-0">
      <embed :src="quoteFile" type="application/pdf" width="100%" height="1000px" />
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</v-dialog>

<v-dialog v-model="dialogApproveReq" max-width="800px" persistent>
  <v-card>
    <v-toolbar dense color="teal" dark>
      <v-toolbar-title title="Approve Request" class="d-flex" style="align-items: center">
        {{
          combinedDialogData.status === "processing"
          ? $t("Confirm Processed")
          : combinedDialogData.status === "processed"
          ? $t("Confirm Completed")
          : $t("Approve Request")
        }}
      </v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-card-title class="text-h6 font-weight-bold">
      {{ $t("Please provide your comments ( if any )") }}
    </v-card-title>
    
    <v-card-text>
      <v-textarea hide-details v-model="approvalComment" :label="$t('Enter your comment')" outlined dense rows="4"
      clearable></v-textarea>
    </v-card-text>
    
    <v-card-actions>
      <v-btn outlined text color="black" @click="dialogApproveReq = false">
        {{ $t("Close") }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="teal" class="white--text" @click="approveReq()">
        {{ $t("Confirm") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
<v-dialog v-model="dialogDeclineReq" max-width="800px" persistent>
  <v-card>
    <v-toolbar dense color="error" dark>
      <v-toolbar-title class="text-h6">
        {{
          combinedDialogData.status === "processed"
          ? $t("Confirm Not Completed")
          : $t("Decline Request")
        }}
      </v-toolbar-title>
    </v-toolbar>
    
    <v-card-title class="text-h6"> 
      {{ $t("Please input reason for refusal") }}
    </v-card-title>
    <v-card-text class="pb-0">
      <v-textarea hide-details outlined v-model="decline_reason"></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-btn color="blue darken-1" outlined text @click="dialogDeclineReq = false">
        {{ $t("Close") }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :disabled="!decline_reason" color="error" @click="declineReq()">
        {{
          combinedDialogData.status === "processed"
          ? $t("Confirm Not Completed")
          : $t("Confirm decline")
        }}
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<v-dialog v-model="dialogRevertReq" max-width="800px" persistent>
  <v-card>
    <v-toolbar dense color="error" dark>
      <v-toolbar-title class="text-h6">
        {{
          $t("Confirm Revert to previous status")
        }}
      </v-toolbar-title>
    </v-toolbar>
    
    <v-card-title class="text-h6">
      {{ $t("Please input reason for Revert") }}
    </v-card-title>
    <v-card-text class="pb-0">
      <v-textarea hide-details outlined v-model="revert_reason"></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-btn color="blue darken-1" outlined text @click="dialogRevertReq = false">
        {{ $t("Close") }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :disabled="!revert_reason" color="error" @click="revertReq()">
        {{
          $t("Confirm Revert to previous status")
        }}
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</v-row>
</template>

<script>
import dayjs, { Dayjs } from "dayjs";
import auth from "~/components/auth";
import VfaAppFlow from "../../../../@global-component/vfa-updated2"; //vfa-app-flow
export default {
  name: "RequestFormSign",
  components: { VfaAppFlow, auth },
  props: {
    dialogDataDetail: Object,
  },
  data() {
    return {
      
      activeTab: 0,
      quotationFile: null,
      quotationFiles: [],
      dialogDeclineReq: false,
      dialogRevertReq: false,
      dialogApproveReq: false,
      decline_reason: null,
      revert_reason: null,
      test: false,
      api: "http://gmo021.cansportsvg.com/api/rpaAwDemo/",
      msgApi: "http://gmo021.cansportsvg.com/api/msg-center/",
      repairType: [
      { text: this.$t("Internal"), value: "internal" },
      { text: this.$t("External"), value: "external" },
      ],
      activeUser: {},
      listEmailDivisonManager: [],
      selected_repair_type: null,
      externalValue: 0,
      uploadQuoteFileDialog: false,
      showFileQuoteFileDialog: false,
      quoteFile: null,
      quoteFiles: [],
      attachedFile: [],
      attachmentsToDelete: [],
      approvalComment: null,
      listStaffGa: [],
      showPrintContent: false,
      localDialogData: null,
      
      itemsType: [
      { text: this.$t("Machinery & Equipment"), value: "machine" },
      { text: this.$t("Molds"), value: "molds" },
      { text: this.$t("Electricity/water"), value: "electricity" },
      { text: this.$t("Renovation"), value: "renovation" },
      { text: this.$t("Other"), value: "other" },
      ],
      itemsArea: [],
      editType: false,
      editArea: false,
      editMode: false,
      backupSnapshot: null,
      
      edited: false,
      addNewAttachmentFiles: [],
      newAttachmentPreviews: [],
      uploadProgress: 0,
      dataAppFlowChanged: [],
    };
  },
  methods: {
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
    getActiveDeputies(deputies) {
      // Filter deputies to only include active ones
      return deputies.filter(d => d.status);
    },
    async addFiles(files) {
      const list = Array.isArray(files) ? files : (files ? [files] : []);
      if (!list.length) return;
      
      // 3.1) Tạo preview ngay
      const batch = list.map(file => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const url = URL.createObjectURL(file);
        return { id, kind: 'new', name: file.name, url, file, status: 'uploading' };
      });
      this.newAttachmentPreviews.push(...batch);
      
      // 3.2) Upload lên server
      const formData = new FormData();
      formData.append('id', this.combinedDialogData.id);  // <- gửi id để server cập nhật đúng record
      batch.forEach((item, idx) => {
        formData.append(`files[${idx}]`, item.file);
      });
      
      this.uploadingAttachments = true;
      this.uploadProgress = 0;
      
      try {
        const res = await this.$axios.post(
        this.api + 'uploadNewAttachmentFiles', // <- bạn sẽ tạo API này ở PHP
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            if (e.total) {
              this.uploadProgress = Math.round((e.loaded * 100) / e.total);
            }
          },
        }
        );
        
        // Kỳ vọng PHP trả về dạng:
        // { saved: ["<filename1>", "<filename2>", ...] }
          const saved = (res && res.data && res.data.saved) || [];
          const newUrls = saved.map(name => this.attachmentBaseUrl + name);
          
          // 3.3) Hợp nhất vào danh sách từ DB để UI dùng nguồn "chính thức"
          if (!Array.isArray(this.attachedFile)) this.attachedFile = [];
          this.attachedFile = [...this.attachedFile, ...newUrls];
          
          
          // Optional: thông báo
          this.showMsg && this.showMsg('success', this.$t('Upload attachment(s) success'));
        } catch (err) {
          console.error('uploadAttachmentFiles', err);
          // Đánh dấu preview lỗi để người dùng biết
          this.newAttachmentPreviews = this.newAttachmentPreviews.map(it =>
          it.kind === 'new' && it.status === 'uploading'
          ? { ...it, status: 'error' }
          : it
          );
          this.showMsg && this.showMsg('error', this.$t('Upload failed'));
        } finally {
          this.uploadingAttachments = false;
        }
      },
      
      async removeAttachment(item) {
        let c = confirm(this.$t('Are you sure to remove this attachment?'));
        if (!c) return;
        if (item.kind === 'existing') {
          // Chỉ xóa hiển thị; gom vào danh sách để gửi PHP xoá DB sau
          this.attachedFile = this.attachedFile.filter(u => u !== item.url);
          if (!Array.isArray(this.attachmentsToDelete)) this.attachmentsToDelete = [];
          this.attachmentsToDelete.push(item.url.split('/').pop()); // lưu lại filename
        } else {
          // Xóa preview mới
          this.newAttachmentPreviews = this.newAttachmentPreviews.filter(x => x.id !== item.id);
        }
        
        //gửi ten item lên php
        const res = await this.$axios.post(this.api + "deleteAttachmentFile", {
          id: this.dialogDataDetail.id,
          fileName: item.url.split('/').pop(),
        });
        if (res.status === 200) {
          this.showMsg && this.showMsg('success', this.$t('Delete attachment success'));
        } else {
          this.showMsg && this.showMsg('error', this.$t('Delete attachment failed'));
        }
        
      },
      
      triggerFileInput() {
        this.$refs.fileInput.$el.querySelector('input').click();
      },
      _snapshot() {
        const d = this.combinedDialogData || {}
        return {
          // đơn giản hoá cấu trúc để so sánh chắc chắn và rẻ
          submitter_ext_no: d?.submitter?.ext_no ?? '',
          category_vi: d?.category?.vi ?? '',
          category_en: d?.category?.en ?? '',
          category_cn: d?.category?.cn ?? '',
          location: d?.location ?? '',
          asset_code: this._normalizeAssetCode(d?.asset_code),
          problem_en: d?.problem?.en ?? '',
          problem_vi: d?.problem?.vi ?? '',
          problem_cn: d?.problem?.cn ?? '',
          area: d?.area ?? '',
          date_request: (d?.date_request ?? '').toString().trim(),
          // nếu muốn tính cả date_need (đang cho sửa), mở comment:
          // date_need: (d?.date_need ?? '').toString().trim(),
        }
      },
      _normalizeAssetCode(val) {
        if (Array.isArray(val)) return val.join(',').trim()
        return (val ?? '').toString().trim()
      },
      _isEdited() {
        if (!this.backupSnapshot) return false
        try {
          return JSON.stringify(this.backupSnapshot) !== JSON.stringify(this._snapshot())
        } catch (e) {
          // fallback an toàn
          return true
        }
      },
      
      
      startGlobalEdit() {
        if (!this.canEditByStatus) return
        this.backupSnapshot = this._snapshot()
        this.edited = false
        this.editMode = true
        
        // this.$nextTick(() => {
        //   const ref = this.$refs.extNoField || this.$refs.categoryFieldVi || this.$refs.locationField
        //   if (ref?.focus) ref.focus()
        //   else ref?.$el?.querySelector('input,textarea')?.focus()
        // })
      },
      
      async confirmGlobalEdit() {
        this.edited = this._isEdited()
        this.editMode = false
        this.backupSnapshot = null
        // (tuỳ bạn) có thể POST cập nhật ngay nếu muốn
      },
      
      cancelGlobalEdit() {
        if (!this.backupSnapshot) { this.editMode = false; return }
        const b = this.backupSnapshot
        const d = this.combinedDialogData
        
        if (!d.submitter) this.$set(d, 'submitter', {})
        if (!d.category) this.$set(d, 'category', {})
        if (!d.problem) this.$set(d, 'problem', {})
        
        d.submitter.ext_no = b.submitter_ext_no
        d.location = b.location
        d.asset_code = b.asset_code
        d.category.vi = b.category_vi
        d.category.en = b.category_en
        d.category.cn = b.category_cn
        d.problem.en = b.problem_en
        d.problem.vi = b.problem_vi
        d.problem.cn = b.problem_cn
        d.area = b.area
        d.date_request = b.date_request
        // nếu có track date_need: d.date_need = b.date_need
        
        this.edited = false
        this.editMode = false
        this.backupSnapshot = null
      },
      
      editTypeRequest() {
        this.editType = !this.editType;
      },
      editAreaRequest() {
        this.editArea = !this.editArea;
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
      onFileSelected() {
        // Xử lý thêm nếu cần sau khi chọn file
        console.log("Files selected:", this.quotationFiles);
      },
      truncateQuoteFileName(filename) {
        // Loại bỏ phần tiền tố "RPA_###_" bằng regex
        const cleaned = filename.replace(/^RPA_\d+_/, '');
        
        const maxLength = 25;
        const extIndex = cleaned.lastIndexOf('.');
        
        if (cleaned.length <= maxLength) return cleaned;
        
        if (extIndex > 0) {
          const base = cleaned.substring(0, extIndex);
          const ext = cleaned.substring(extIndex);
          const visibleChars = maxLength - ext.length - 3;
          return base.substring(0, visibleChars) + '...' + ext;
        } else {
          return cleaned.substring(0, maxLength - 3) + '...';
        }
      },
      openQuoteFile(fileUrl) {
        console.log("Opening quote file:", fileUrl);
        window.open(fileUrl, '_blank');
      },
      async deleteQuoteFileName(file) {
        const fileName = file.split('/').pop();
        if (!confirm(`${this.$t("Are you sure you want to delete this file?")}\n${fileName}`)) {
          return;
        }
        let params = {
          id: this.dialogDataDetail.id,
          fileName: fileName,
        };
        this.$axios
        .post(this.api + "deleteQuoteFileName", params)
        .then((res) => {
          if (res.status === 200) {
            this.getDataForId(); // Refresh data after deletion
            this.showMsg("success", "File deleted successfully");
          } else {
            this.showMsg("error", "Failed to delete file");
          }
        })
        .catch((error) => {
          console.log(error);
        });
        console.log('Quote file name:', fileName);
      },
      openCompPrint(item) {
        this.showPrintContent = true;
        this.$nextTick(() => {
          setTimeout(() => {
            window.print();
            this.showPrintContent = false;
          }, 300);
        });
      },
      async downloadFile(fileUrl) {
        try {
          const response = await fetch(fileUrl);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.setAttribute("download", fileUrl.split("/").pop());
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        } catch (error) {
          console.error("Download failed:", error);
        }
      },
      
      gaConfirmComplete() {
        if (!confirm(this.$t("Are you sure the confirmation is complete.?"))) {
          return;
        }
        let params = {
          dataReq: this.dialogDataDetail,
        };
        this.$axios
        .post(this.api + "gaConfirmComplete", params)
        .then((res) => {
          this.$emit("closeDialogDetailRegistration");
        })
        .catch((error) => {
          console.log(error);
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
      
      async getDataForId() {
        let params = {
          id: this.dialogDataDetail.id,
          area: this.dialogDataDetail.area,
          empno: this.dialogDataDetail.submitter.empno,
          dept: this.dialogDataDetail.dept,
          high_dept: this.dialogDataDetail.high_dept,
        };
        
        await this.$axios
        .post(this.api + "getDataById", params)
        .then((res) => {
          if (res.data) {
            if (res.data.file_quotation) {
              try {
                // Nếu là chuỗi JSON array
                const parsed = JSON.parse(res.data.file_quotation);
                if (Array.isArray(parsed)) {
                  this.quoteFiles = parsed.map(file =>
                  "http://gmo021.cansportsvg.com/api/storage/app/rpa_aw/quote_file/" + file
                  );
                } else {
                  // Trường hợp không phải array (fallback)
                  this.quoteFiles = [
                  "http://gmo021.cansportsvg.com/api/storage/app/rpa_aw/quote_file/" + res.data.file_quotation
                  ];
                }
              } catch (e) {
                // Nếu không phải JSON array, giả sử là 1 file duy nhất
                this.quoteFiles = [
                "http://gmo021.cansportsvg.com/api/storage/app/rpa_aw/quote_file/" + res.data.file_quotation
                ];
              }
            }
            
            // Xử lý attachment (đã là mảng từ PHP)
            if (res.data.attachment.length) {
              this.attachedFile = res.data.attachment.map(
              (file) =>
              "http://gmo021.cansportsvg.com/api/storage/app/rpa_aw/attachment/" +
              file
              );
            }
            
            // Gán dataFlow vào biến của component
            this.localDialogData = {
              ...this.dialogDataDetail,
              asset_code: res.data.asset_code,
              dataFlow: res.data.dataFlow || [],
              quote: res.data.quote,
              staff_ga_confirm: res.data.staff_ga_confirm,
              completed_logs: res.data.completed_logs,
              dept_manager_logs:
              res.data.dept_manager_logs,
              division_manager_logs:
              res.data.division_manager_logs,
              ga_manager_logs: res.data.ga_manager_logs,
              division_ga_logs: res.data.division_ga_logs,
              bu_logs: res.data.bu_logs,
            };
          }
        })
        .catch((error) => {
          console.log("getFileData", error);
        });
      },
      
      async openFileQuoteFileDialog() {
        this.showFileQuoteFileDialog = true;
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
        .post(this.api + "uploadQuoteFilesNew", formData) //uploadQuoteFiles , uploadQuoteFilesNew
        .then((res) => {
          this.uploadQuoteFileDialog = false;
          this.getDataForId();
        })
        .catch((err) => {
          console.log("uploadQuoteFiles", err);
        });
      },
      uploadQuoteFile__() {
        if (
        !confirm(
        "Confirm Upload Quote File ? \n xác nhận tải lên File báo giá \n 確認上傳報價文件"
        )
        )
        return;
        
        let formData = new FormData();
        formData.append("id", this.dialogDataDetail.id);
        formData.append("file_quotation", this.quotationFile);
        
        this.$axios
        .post(this.api + "uploadQuoteFile", formData)
        .then((res) => {
          this.uploadQuoteFileDialog = false;
        })
        .catch((err) => {
          console.log("uploadQuoteFile", err);
        });
      },
      
      showDialogUploadQuoteFile() {
        this.uploadQuoteFileDialog = true;
      },
      async confirmCompleted() {
        if (
        !confirm(
        this.$t(
        "Confirm this request is complete? \n Xác nhận yêu cầu này đã hoàn thành? \n 确认此请求已完成?"
        )
        )
        ) {
          return;
        }
        let params = {
          dataReq: this.dialogDataDetail,
        };
        await this.$axios
        .post(this.api + "confirmCompleted", params)
        .then((res) => {
          this.$emit("closeDialogDetailRegistration");
        })
        .catch((error) => {
          console.log("confirmCompleted", error);
        });
      },
      async declineReq() {
        const confirmMessage =
        this.dialogDataDetail.status === "processed"
        ? this.$t("Are you sure you want to Confirmation not completed?")
        : this.$t("Are you sure you want to decline this request?");
        
        if (!confirm(confirmMessage)) {
          return;
        }
        
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
          confirmer: {
            empno: this.activeUser.empno,
            name: this.activeUser.name,
            dept: this.activeUser.dept,
            high_dept: this.activeUser.hight_dept,
            email: this.activeUser.email,
            comment: this.decline_reason,
            time: time,
          },
        };
        await this.$axios.post(this.api + "declineReq", params).then((res) => {
          this.dialogDeclineReq = false;
          this.decline_reason = null;
          this.$emit("closeDialogDetailRegistration");
        });
      },
      async revertReq() {
        const confirmMessage = this.$t("Are you sure you want to Confirmation revert this request?");
        
        if (!confirm(confirmMessage)) {
          return;
        }
        
        let params = {
          dataReq: this.combinedDialogData,
          confirmer: {
            empno: this.activeUser.empno,
            name: this.activeUser.name,
            dept: this.activeUser.dept,
            high_dept: this.activeUser.hight_dept,
            email: this.activeUser.email,
            comment: this.revert_reason,
          },
          status: "revert",
          edited: this.edited,
        };
        await this.$axios.post(this.api + "revertReq", params).then((res) => {
          this.dialogRevertReq = false;
          this.revert_reason = null;
          this.$emit("closeDialogDetailRegistration");
        });
      },
      async approveReq() {
        if (this.combinedDialogData.status === "waiting_ga") {
          if (!this.selected_repair_type) {
            alert(
            this.$t(
            "You have not selected a repair type \n bạn chưa chọn loại sửa chữa \n 你还没有选择修理类型"
            )
            );
            this.dialogApproveReq = false;
            return;
          }
          if (this.selected_repair_type === "external" && !this.externalValue) {
            alert(
            this.$t(
            "You have not entered the USD value \n bạn chưa nhập giá USD \n 你还没有输入USD值"
            )
            );
            this.dialogApproveReq = false;
            return;
          }
        }
        
        const confirmMessage =
        this.combinedDialogData.status === "processing"
        ? this.$t("Are you sure you want to confirm this processed?")
        : this.combinedDialogData.status === "processed"
        ? this.$t("Are you sure you want to confirm this completed?")
        : this.$t("Are you sure you want to approve this request?");
        
        if (!confirm(confirmMessage)) {
          return;
        }
        
        let params = {
          dataReq: this.combinedDialogData,
          repair_type: this.selected_repair_type,
          quote: this.externalValue
          ? this.externalValue
          : this.combinedDialogData.quote,
          confirmer: {
            empno: this.activeUser.empno,
            name: this.activeUser.name,
            dept: this.activeUser.dept,
            high_dept: this.activeUser.hight_dept,
            email: this.activeUser.email,
            comment: this.approvalComment,
            // time: time,
          },
          status: "approved",
          edited: this.edited,
        };
        
        try {
          const res = await this.$axios.post(this.api + "approveReq", params);
          // console.log("listEmailDivisonManager", res.data.listEmailDivisonManager);
          this.dialogApproveReq = false;
          this.$emit("closeDialogDetailRegistration");
        } catch (error) {
          console.error("approveReq", error);
        }
      },
      canApproval() {
        const statusMapping = {
          waiting_dept: 0,
          waiting_division: 1,
          waiting_ga: 2,
          waiting_dept_2: 0,
          waiting_division_ga: 3,
          waiting_bu: 4,
          waiting_ceo: 5,
          processing: -1, // Xử lý riêng cho "processing"
        };
        
        const activeEmpno = this.activeUser.empno;
        const flowIndex = statusMapping[this.combinedDialogData.status];
        
        // Nếu trạng thái là "processing", kiểm tra listStaffGa
        if (this.combinedDialogData.status === "processing") {
          const isStaffGa = this.listStaffGa.some(
          (staff) => staff.empno === activeEmpno
          );
          return !isStaffGa; // Nếu có trong listStaffGa, nút Approve sẽ bật
        }
        
        // Nếu trạng thái không khớp với bất kỳ flow nào
        if (flowIndex === undefined) {
          return true;
        }
        
        const managers =
        this.combinedDialogData.dataFlow?.[flowIndex]?.managers || [];
        
        // Kiểm tra nếu activeUser.empno tồn tại trong managers.empno
        const isManager = managers.some(
        (manager) => manager.empno === activeEmpno
        );
        
        // Kiểm tra nếu activeUser.empno tồn tại trong deputies.empno và có status === true
        const isDeputy = managers.some((manager) =>
        manager.deputies?.some(
        (deputy) => deputy.empno === activeEmpno && deputy.status === true
        )
        );
        
        // Nếu activeUser là Manager hoặc Deputy thì nút Approve sẽ được bật
        // console.log("isManager:", isManager, "isDeputy:", isDeputy);
        
        return (isManager || isDeputy);
      },
      
      
      locale(tg) {
        this.$i18n.setLocale(tg);
        $nuxt.$emit("change-locale", tg);
        this.$vuetify.lang.current = tg;
        if (tg === 'en') this.activeTab = 0;
        else if (tg === 'vi') this.activeTab = 1;
        else if (tg === 'cn') this.activeTab = 2;
      },
      closeDialogDetailRegistration() {
        this.edited = false
        this.backupSnapshot = null
        this.combinedDialogData = null;
        this.attachedFile = null;
        this.quoteFile = null;
        this.quoteFiles = null;
        this.approvalComment = null;
        this.localDialogData = null;
        this.selected_repair_type = null;
        this.externalValue = 0;
        this.attachmentsToDelete = [];
        this.newAttachmentPreviews = [];
        this.uploadProgress = 0;
        this.uploadingAttachments = false;
        this.addNewAttachmentFiles = []; 
        this.combinedDialogData = {};
        this.$emit("closeDialogDetailRegistration");
      },
      showDialogApproveReq() {
        this.dialogApproveReq = true;
      },
      showDialogDenyReq() {
        this.dialogDeclineReq = true;
      },
      showDialogRevertReq() {
        this.dialogRevertReq = true;
      },
    },
    computed: {
      
      allAttachments() {
        const existing = (this.attachedFile || []).map(url => ({
          id: 'ex:' + url,
          kind: 'existing',
          url,
          name: url.split('/').pop(),
        }));
        return [...existing, ...this.newAttachmentPreviews];
      },
      // allAttachments() {
      //   const existing = Array.isArray(this.attachedFile)
      //     ? this.attachedFile.map(url => ({
      //       id: 'ex:' + url,
      //       kind: 'existing',
      //       url,
      //       name: url.split('/').pop(),
      //     }))
      //     : [];
      
      //   const previews = Array.isArray(this.newAttachmentPreviews)
      //     ? this.newAttachmentPreviews
      //     : [];
      
      //   return existing.concat(previews);
      // },
      canEditByStatus() {
        const s = this.combinedDialogData?.status
        return (
        s !== 'processing' &&
        s !== 'declined' &&
        s !== 'processed' &&
        this.canApproval()
        )
      },
      combinedDialogData: {
        get() {
          return this.localDialogData || this.dialogDataDetail;
        },
        set(value) {
          this.localDialogData = value;
        }
      },
      isEmpInStaffGa() {
        const result = this.listStaffGa.some(
        (staff) => staff.empno === this.activeUser.empno
        );
        // console.log("isEmpInStaffGa result:", result);
        return result;
      },
      isManagerGa() {
        if (!this.dialogDataDetail.dataFlow) return false;
        
        const allowedLevels = ["ga_manager_test"];
        
        return this.dialogDataDetail.dataFlow
        .filter((flow) => allowedLevels.includes(flow.lvl_code))
        .some((flow) => {
          
          return flow.managers.some((manager) => {
            if (manager.empno === this.activeUser.empno) {
              return true;
            }
            return manager.deputies.some(
            (deputy) =>
            deputy.empno === this.activeUser.empno &&
            deputy.status === true
            );
          });
        });
      },
      isEmpInDataFlow() {
        if (!this.combinedDialogData.dataFlow) return false;
        const result = this.combinedDialogData.dataFlow.some((flow) => {
          return flow.managers.some((manager) => {
            if (manager.empno === this.activeUser.empno) {
              return true;
            }
            return manager.deputies.some(
            (deputy) =>
            deputy.empno === this.activeUser.empno && deputy.status === true
            );
          });
        });
        // console.log("isEmpInDataFlow result:", result);
        return result;
      },
      isEmpInDataDeptFlow() {
        if (!this.dialogDataDetail.dataFlow) return false;
        
        const allowedLevels = ["dept_manager", "division_manager", "ga_division", "general_manager"];
        
        return this.dialogDataDetail.dataFlow
        .filter((flow) => allowedLevels.includes(flow.lvl_code))
        .some((flow) => {
          return flow.managers.some((manager) => {
            // if (manager.empno === this.activeUser.empno) {
            //   return true;
            // }
            if (String(manager.empno) === String(this.activeUser.empno)) return true;
            return manager.deputies.some(
            (deputy) =>
            deputy.empno === this.activeUser.empno &&
            deputy.status === true
            );
          });
        });
      },
    },
    watch: {
      combinedDialogData: {
        immediate: true,
        handler(v) {
          this.selected_repair_type = v?.repair_type ?? null;
          this.externalValue = v?.quote ?? 0;
        }
      },
      dialogDataDetail: {
        immediate: true,
        handler(newVal) {
          if (newVal && newVal.submitter) {
            this.combinedDialogData = { ...newVal }; // Use setter
            this.getDataForId();
          }
        },
      },
      '$i18n.locale': function (newLocale) {
        if (newLocale === 'en') this.activeTab = 0;
        else if (newLocale === 'vi') this.activeTab = 1;
        else if (newLocale === 'cn') this.activeTab = 2;
      }
    },
    mounted() {
      this.activeUser = this.$session.get("aw_rpa_demo");
      // this.getDataForId();
      this.getListStaffGa();
      this.getArea();
    },
  };
</script>
<style scoped>
.v-tabs {
  border-bottom: 1px solid #ccc;
}

.v-tab {
  text-transform: uppercase;
  font-weight: bold;
}

#print-content {
  display: none;
}

@media print {
  .noPrint {
    display: none;
  }
  
  /* #print-content {
    display: block;
  } */
  #print-content {
    display: block !important;
    max-height: 100vh;
    /* <= tối đa một chiều cao trang */
    overflow: hidden;
    /* hoặc 'auto' nếu muốn scroll khi xem bản in PDF */
    box-sizing: border-box;
  }
}
</style>
<i18n>
  {
    "en":{
      "Approve Request": "Approve Request",
      "Confirm Not Completed": "Confirm Not Completed",
      "Confirm Processed": "Confirm Processed",
      "Enter your comment": "Enter your comment",
      "Please provide your comments ( if any )": "Please provide your comments ( if any )",
      "Detailed registration information": "Detailed registration information",
      "Submitter": "Submitter",
      "Empno": "Empno",
      "Name": "Name",
      "Department": "Department",
      "Division": "Division",
      "Date Request": "Date Request",
      "Date Need": "Date Need",
      "Extension no": "Extension no",
      "Type Request": "Type Request",
      "Area": "Area",
      "Location": "Location",
      "Type Repair": "Type Repair",
      "Quote (USD)": "Quote (USD)",
      "Select repair type": "Select repair type",
      "USD": "USD",
      "Upload quote file ": "Upload quote file",
      "Show Quote File": "Show Quote File",
      "List of attachments": "List of attachments",
      "Confirm Completed": "Confirm Completed",
      "Asset code": "Asset code",
      "Category Name:": "Category Name:",
      "Category VI": "Category VI",
      "Category EN": "Category EN",
      "Category CN": "Category CN",
      "Cause of the problem:": "Cause of the problem:",
      "Problem VI": "Problem VI",
      "Problem EN": "Problem EN",
      "Problem CN": "Problem CN",
      "Deny": "Deny",
      "Approve": "Approve",
      "Upload Quote File": "Upload Quote File",
      "Choose Quote file": "Choose Quote file",
      "Close": "Close",
      "Upload File": "Upload File",
      "Confirm": "Confirm"
    },
    "vi":{
      "Re-Submit": "Gửi lại",
      "Confirm Revert to previous status": "Xác nhận quay lại trạng thái trước",
      "Please input reason for Revert": "Vui lòng nhập lý do để quay lại",
      "Confirm Revert to previous status": "Xác nhận quay lại trạng thái trước",
      "Edit request": "Chỉnh sửa yêu cầu",
      "Revert to previous status": "Quay lại trạng thái trước",
      "Revert to waiting GA Department": "Quay lại chờ GA phê duyệt",
      "Approve Request": "Phê duyệt yêu cầu",
      "Confirm Not Completed": "Xác nhận chưa hoàn thành",
      "Confirm Processed": "Xác nhận đã xử lý",
      "Enter your comment": "Nhập ý kiến của bạn",
      "Please provide your comments ( if any )": "Vui lòng cung cấp ý kiến của bạn (nếu có)",
      "Detailed registration information": "Thông tin đăng ký chi tiết",
      "Submitter": "Người gửi",
      "Empno": "Mã nhân viên",
      "Name": "Tên",
      "Department": "Phòng ban", 
      "Division": "Bộ phận",
      "Date Request": "Ngày yêu cầu",
      "Date Need": "Ngày cần",
      "Extension no": "Số máy lẻ",
      "Type Request": "Loại yêu cầu",
      "Area": "Khu vực",
      "Location": "Vị trí",
      "Type Repair": "Loại sửa chữa",
      "Quote (USD)": "Báo giá (USD)",
      "Select repair type": "Chọn loại sửa chữa",
      "USD": "USD",
      "Upload quote file ": "Tải lên tệp báo giá",
      "Show Quote File": "Hiển thị tệp báo giá",
      "List of attachments": "Danh sách tệp đính kèm",
      "Confirm Completed": "Xác nhận hoàn thành",
      "Asset code": "Mã tài sản",
      "Category Name:": "Tên danh mục:",
      "Category VI": "Danh mục VI",
      "Category EN": "Danh mục EN",
      "Category CN": "Danh mục CN",
      "Cause of the problem:": "Nguyên nhân của vấn đề:",
      "Problem VI": "Vấn đề VI",
      "Problem EN": "Vấn đề EN",
      "Problem CN": "Vấn đề CN",
      "Deny": "Từ chối",
      "Approve": "Phê duyệt",
      "Upload Quote File": "Tải lên tệp báo giá",
      "Choose Quote file": "Chọn tệp báo giá",
      "Close": "Đóng",
      "Upload File": "Tải tệp lên",
      "Confirm": "Xác nhận"
    },
    "cn":{
      "Re-Submit": "重新提交",
      "Confirm Revert to previous status": "确认恢复到之前的状态",
      "Please input reason for Revert": "请输入恢复原因",
      "Confirm Revert to previous status": "确认恢复到之前的状态",
      "Edit request": "编辑请求",
      "Revert to previous status": "恢复到之前的状态",
      "Revert to waiting GA Department": "恢复到等待GA批准",
      "Approve Request": "批准请求",
      "Confirm Not Completed": "确认未完成",
      "Confirm Processed": "确认已处理",
      "Enter your comment": "输入您的评论",
      "Please provide your comments ( if any )": "请提供您的意见（如果有）",
      "Detailed registration information": "详细注册信息",
      "Submitter": "提交者",
      "Empno": "员工编号",
      "Name": "姓名",
      "Department": "部门",
      "Division": "分部",
      "Date Request": "请求日期",
      "Date Need": "需要日期",
      "Extension no": "分机号",
      "Type Request": "请求类型",
      "Area": "区域",
      "Location": "位置",
      "Type Repair": "维修类型",
      "Quote (USD)": "报价 (USD)",
      "Select repair type": "选择维修类型",
      "USD": "美元",
      "Upload quote file ": "上传报价文件",
      "Show Quote File": "显示报价文件",
      "List of attachments": "附件列表",
      "Confirm Completed": "确认完成",
      "Asset code": "资产代码",
      "Category Name:": "类别名称:",
      "Category VI": "类别 VI",
      "Category EN": "类别 EN",
      "Category CN": "类别 CN",
      "Cause of the problem:": "问题原因:",
      "Problem VI": "问题 VI",
      "Problem EN": "问题 EN",
      "Problem CN": "问题 CN",
      "Deny": "拒绝",
      "Approve": "批准",
      "Upload Quote File": "上传报价文件",
      "Choose Quote file": "选择报价文件",
      "Close": "关闭",
      "Upload File": "上传文件",
      "Confirm": "确认"
    }
  }
</i18n>
