<template>
  <v-container>
    <v-row class="text-center">
      <template>
        <v-data-table
          :headers="headers"
          :items="desserts"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Mi CRUD</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="800px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Nuevo producto
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>
                  <v-form @submit.prevent="save" lazy-validation ref="form">
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.name"
                              label="Nombre"
                              :rules="[(v) => !!v || 'El Nombre es requerido']"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-textarea
                              v-model="editedItem.description"
                              label="Descripcion"
                              :rules="[
                                (v) => !!v || 'El Descripcion es requerido',
                              ]"
                            ></v-textarea>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-file-input
                              v-model="img"
                              label="Imagen"
                              variant="filled"
                              :rules="[(v) => !!v || 'El Imagen es requerido']"
                              prepend-icon="mdi-camera"
                            ></v-file-input>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close">
                        Cancel
                      </v-btn>
                      <v-btn type="submit" color="blue darken-1" text>
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </template>
        </v-data-table>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import axiosInstance from "./../api/api";
// import axios from "axios";

export default {
  name: "ProductsComponent",

  data: () => ({
    dialog: false,
    dialogDelete: false,
    img: null,
    headers: [
      {
        text: "ID",
        value: "id",
      },
      { text: "Nombre", value: "name" },
      { text: "Descripcion", value: "description" },
      { text: "img", value: "img" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      name: "",
      description: "",
      img: "",
    },
    defaultItem: {
      id: "",
      name: "",
      description: "",
      img: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Producto" : "Editar Producto";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      axiosInstance
        .get("/product")
        .then((response) => {
          console.log(response.data);

          this.desserts = response.data.products;
        })
        .catch((error) => {
          console.error("Error al obtener los usuarios:", error);
        });
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.$refs.form.reset()
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      axiosInstance
            .delete(`/product/${this.editedItem.id}`)
            .then((response) => {
              console.log(response.data);
              this.initialize();
            })
            .catch((error) => {
              console.error("Error al modificar producto:", error);
            });
      // this.$nextTick(() => {
      //   this.editedItem = Object.assign({}, this.defaultItem);
      //   this.editedIndex = -1;
      // });
    },

    async save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          const formData = new FormData();
          if (this.img) {
            formData.append("img", this.img);
          } else {
            formData.append("img", this.editedItem.img);
          }

          formData.append("name", this.editedItem.name);
          formData.append("description", this.editedItem.description);
          for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }
          console.log('rrrrrrrrr')
          console.log(formData)
          console.log('rrrrrrrrr')
          await axiosInstance
            .post(`/product/${this.editedItem.id}`, formData)
            .then((response) => {
              console.log("modificado");
              console.log(response.data);
              this.initialize();
              this.img = null;
            })
            .catch((error) => {
              console.error("Error al modificar producto:", error);
            });
        } else {
          const formData = new FormData();
          formData.append("img", this.img);
          formData.append("name", this.editedItem.name);
          formData.append("description", this.editedItem.description);
          axiosInstance
            .post(`/product/create`, formData)
            .then((response) => {
              console.log("creado");
              console.log(response.data);
              this.initialize();
              this.img = null;
            })
            .catch((error) => {
              console.error("Error al modificar producto:", error);
            });
        }
        this.close();
      }
    },
  },
};
</script>
