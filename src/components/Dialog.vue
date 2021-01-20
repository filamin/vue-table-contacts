<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn small dark type="success" v-bind="attrs" v-on="on">
        Добавить контакт
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark>
        <v-toolbar-title>Добавить контакт</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <div class="submit-form mt-3 mx-auto d-flex flex-column justify-center">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="contact.title"
            :rules="[(v) => !!v || 'Необходимо ввести имя!']"
            label="Имя"
            required
          ></v-text-field>

          <v-text-field
            v-model="contact.number"
            :rules="[(v) => !!v || 'Необходимо ввести номер телефона!']"
            label="Номер телефона"
            required
          ></v-text-field>

          <v-select
            @click="getAllBosses"
            v-model="contact.boss"
            :items="bosses"
            label="Начальник"
            outlined
            class="mt-3"
          ></v-select>
        </v-form>
        <v-btn small :disabled="!valid" @click="saveContact">Сохранить</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import ContactsDataService from "../services/ContactsDataService";
export default {
  data() {
    return {
      contact: {
        id: null,
        title: "",
        number: "",
        bossId: null,
      },
      bosses: [],
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      valid: false,
      submitted: false,
    };
  },
  methods: {
    getAllBosses() {
      ContactsDataService.getAll()
        .then((response) => {
          this.bosses = response.data.map(function (contact) {
            return {
              value: contact.id,
              text: contact.title,
            };
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    saveContact() {
      if (this.$refs.form.validate()) {
        var data = {
          title: this.contact.title,
          number: this.contact.number,
          bossId: this.contact.boss,
        };
        ContactsDataService.create(data)
          .then((response) => {
            this.contact.id = response.data.id;
            this.submitted = true;
            location.reload();
            this.dialog = false;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },

    newContact() {
      this.submitted = false;
      this.contact = {};
    },

    created() {
      this.getAllContactsNames();
    },
  },
};
</script>

<style>
.submit-form {
  max-width: 300px;
  min-width: 200px;
}
</style>