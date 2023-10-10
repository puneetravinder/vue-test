<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import axios from "axios";

const categoryList = ref([])
const categoryData = reactive<any>({
  data: []
})
const showSpinner = ref(false)


onMounted(() => {
  getData()
})

const getCategoryData = (): void => {
  for (let index = 0; index < categoryList.value.length; index++) {
    const categoryName = categoryList.value[index];
    axios.get(`https://fakestoreapi.com/products/category/${categoryName}`).then(response => {
      const categoryRecords = response.data;
      const length = categoryRecords.length - 1
      const latestCatData = categoryRecords[length]
      categoryData.data.push(latestCatData)
    })
  }
}

const getData = (): void => {
  showSpinner.value = true
  axios.get('https://fakestoreapi.com/products/categories').then(response => {
    showSpinner.value = false
    categoryList.value = response.data;
    getCategoryData()
  })
}

</script>

<template>
  <div class="container-fluid">
    <div class="shadow p-3 mb-3 bg-body-tertiary rounded">Categories</div>
    <div class="row" v-if="categoryData.data?.length">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));grid-gap: 5px;">
        <div class="col-md-3" v-for="product in categoryData.data">
          <div class="card shadow p-3" style="width: 18rem; height: 100%;" role="button"
            @click="$router.push({ name: 'productList', params: { category: product.category } })">
            <img :src="product.image" class="card-img-top" alt="products" style="height: 250px;">
            <div class="card-body">
              <h5 class="card-title">{{ product.category }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container-fluid" v-if="showSpinner">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>
