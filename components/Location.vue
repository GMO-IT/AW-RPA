<template>
    <div>
        <v-dialog v-model="locationDialog" max-width="600px">
            <v-card>
                <v-toolbar color="teal" dense high-details > 
                    <v-btn @click="locationDialog = false" nuxt small class="mr-2" color="orange" dark>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title class="white--text">Location</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn dense>
                        <v-icon>mdi-plus</v-icon>
                        Add Location
                    </v-btn>
                </v-toolbar>
                <v-card-text class="mt-2">
                    <v-data-table
                    :headers="headers"
                    :items="locations"
                    :items-per-page="10"
                    class="elevation-1">
                    <template v-slot:item.action="{ item }">
                        <v-icon small class="mr-2" @click="editLocation(item)">mdi-pencil</v-icon>
                        <v-icon small @click="deleteLocation(item)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'Location',
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
  data() {
    return {
        api: "http://gmo021.cansportsvg.com/api/rpa/",
        headers: [
            { text: 'Zone', value: 'zone' },
            { text: 'Location', value: 'location' },
            { text: 'Action', value: 'action', sortable: false },
        ],
        locations: [],
    }
  },
  computed: {
    locationDialog: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        }
    },
  methods:{
    async fetchLocations() {
        try {
            const response = await this.$axios.post(this.api + 'getArea');
            this.locations = response.data;
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    }
  },
  watch: {
    locationDialog(val) {
        if (val) {
            this.fetchLocations();
        }
    }
  }
}
</script>