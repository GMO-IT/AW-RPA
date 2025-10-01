<template>
    <div>
        <v-dialog v-model="dialogVisible" max-width="1200">
            <v-card>
                <v-toolbar dense color="teal">
                    <v-btn @click="dialogVisible = false" nuxt small class="mr-2" color="orange" dark>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title class="white--text">GA Staff List</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn dense >Add New Staff</v-btn>
                </v-toolbar>
                <v-card-text class="mt-2">
                    <v-data-table
                        :headers="headers"
                        :items="staffs"
                        :items-per-page="5"
                        class="elevation-1"
                    >
                        <template v-slot:item.action="{ item }">
                            <v-icon small @click="editStaff(item)">mdi-pencil</v-icon>
                            <v-icon small @click="deleteStaff(item)">mdi-delete</v-icon>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'staff',
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            api: "http://gmo021.cansportsvg.com/api/rpa/",
            staffs: [],
            headers: [
                { text: 'Employee No', value: 'empno' },
                { text: 'Name', value: 'name' },
                { text: 'Email', value: 'email' },
                { text: 'Extension', value: 'extno' },
                { text: 'Department', value: 'dept' },
                { text: 'Division', value: 'high_dept' },
                { text: 'Actions', value: 'action' }
            ],
        }
    },
    computed: {
        dialogVisible: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        }
    },
    methods: {
        async fetchStaffData() {
            try {
                const response = await this.$axios.get(this.api + 'getListStaffGa');
                this.staffs = response.data;
            } catch (error) {
                console.error('Error fetching GA staff:', error);
            }
        },
        
        editStaff(item) {
            // Implement edit functionality
            console.log('Edit staff:', item);
        },
        deleteStaff(item) {
            // Implement delete functionality
            console.log('Delete staff:', item);
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.fetchStaffData();
            }
        }
    }
}
</script>