<template>
  <div v-if="currentContact" class="edit-form py-3">
    <p class="headline">Редактировать контакт</p>

    <v-form ref="form" lazy-validation>
      <v-text-field
        v-model="currentContact.title"
        :rules="[(v) => !!v || 'Необходимо ввести имя!']"
        label="Имя"
        required
      ></v-text-field>

      <v-text-field
        v-model="currentContact.number"
        :rules="[(v) => !!v || 'Необходимо ввести номер телефона!']"
        label="Номер телефона"
        required
      ></v-text-field>

      <v-select
        @click="getAllContactsNames"
        v-model="currentContact.boss"
        :items="contactsNames"
        label="Начальник"
        outlined
        class="mt-3"
        hide-details="true"
      ></v-select>

      <v-divider class="my-5"></v-divider>
      <div class="d-flex justify-space-between">
        <v-btn small @click="updateContact"> Сохранить изменения </v-btn>
        <v-btn color="error" small @click="deleteContact"> Удалить </v-btn>
      </div>
    </v-form>

    <p class="mt-3">{{ message }}</p>
  </div>

  <div v-else>
    <p>Нажмите на контакт...</p>
  </div>
</template>

<script>
import ContactsDataService from "../services/ContactsDataService";

export default {
  name: "contact",
  data() {
    return {
      currentContact: null,
      contactsNames: [],
      message: "",
    };
  },
  methods: {
    getContact(id) {
      ContactsDataService.get(id)
        .then((response) => {
          this.currentContact = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getAllContactsNames() {
      ContactsDataService.getAll()
        .then((response) => {
          this.contactsNames = response.data.map((contact) => contact.title);
          console.log(this.contactsNames);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    updatePublished(status) {
      var data = {
        id: this.currentContact.id,
        title: this.currentContact.title,
        number: this.currentContact.number,
        published: status,
      };

      ContactsDataService.update(this.currentContact.id, data)
        .then((response) => {
          this.currentContact.published = status;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    updateContact() {
      ContactsDataService.update(this.currentContact.id, this.currentContact)
        .then((response) => {
          console.log(response.data);
          this.message = "Контакт успешно сохранен!";
        })
        .catch((e) => {
          console.log(e);
        });
    },

    deleteContact() {
      ContactsDataService.delete(this.currentContact.id)
        .then((response) => {
          console.log(response.data);
          this.$router.push({ name: "contacts" });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.message = "";
    this.getContact(this.$route.params.id);
  },
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>