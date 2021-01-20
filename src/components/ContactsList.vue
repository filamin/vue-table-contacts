<template>
  <v-row align="center" justify="space-between" class="list px-3 mx-auto">
    <v-col cols="12" md="6" sm="6">
      <v-text-field
        :rules="[(v) => !!v || 'Необходимо ввести имя для поиска!']"
        v-model="title"
        label="Поиск по имени"
      ></v-text-field>
    </v-col>
    <v-col md="6" sm="6">
      <div class="d-flex justify-space-between">
        <v-btn small @click="searchTitle"> Поиск </v-btn>
        <Dialog />
      </div>
    </v-col>
    <v-col cols="12" sm="12">
      <v-card class="mx-auto" tile>
        <v-card-title>Контакты Vuetify</v-card-title>
        <v-data-table
          :headers="headers"
          :items="contacts"
          disable-pagination
          :hide-default-footer="true"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editContact(item.id)"
              >mdi-pencil</v-icon
            >
            <v-icon small @click="deleteContact(item.id)">mdi-delete</v-icon>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              Больше информации о {{ item.name }}
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12">
      <v-card class="mx-auto" tile>
        <v-card-title>Контакты Vue-Tree-Table</v-card-title>
        <table-contacts v-if="fetched" v-bind:contacts="contacts" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Dialog from "./Dialog.vue";
import ContactsDataService from "../services/ContactsDataService";
import TableContacts from "./TableContacts.vue";

export default {
  components: { Dialog, TableContacts },
  name: "contacts-list",
  data() {
    return {
      title: "",
      submited: false,
      contacts: [],
      fetched: false,
      headers: [
        { text: "Имя", align: "start", sortable: true, value: "title" },
        { text: "Телефон", value: "number", sortable: true },
        { text: "Действия", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    retrieveContacts() {
      ContactsDataService.getAll()
        .then((response) => {
          let unstructuredContacts = response.data.map(this.getDisplayContacts);
          this.contacts = this.getStructuredContacts(unstructuredContacts);
          this.fetched = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveContacts();
    },

    searchTitle() {
      if (this.title !== "")
        ContactsDataService.findByTitle(this.title)
          .then((response) => {
            this.contacts = response.data.map(this.getDisplayContacts);
            console.log(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
    },

    editContact(id) {
      this.$router.push({ name: "contact-details", params: { id: id } });
    },

    deleteContact(id) {
      ContactsDataService.delete(id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getDisplayContacts(contact) {
      return {
        id: contact.id,
        title:
          contact.title.length > 30
            ? contact.title.substr(0, 30) + "..."
            : contact.title,
        number: contact.number,
        bossId: contact.bossId,
        children: [],
      };
    },

    getStructuredContacts(contacts) {
      let getSortedContacts = contacts.sort((a, b) => a.bossId - b.bossId);
      getSortedContacts.forEach((item) => {
        item.children = getSortedContacts.filter(
          (contact) => contact.bossId == item.id
        );
      });
      let filteredContacts = getSortedContacts.filter(
        (item) => !item.bossId && item.children
      );
      return filteredContacts;
    },
  },
  mounted() {
    this.retrieveContacts();
  },
  updateContact() {
    this.retrieveContacts();
  },
};
</script>

<style>
.list {
  max-width: 750px;
}
</style>