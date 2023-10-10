<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import debounce from 'lodash.debounce'
import useCart from "../composables/useCart";

const route = useRoute()
const router = useRouter()
let category = ref()
let searchText = ref('')
const showSpinner = ref(false)
const productData = reactive<any>({
    data: []
})
const dataBackup = ref(null)
const priceSort = ref(0)
const cart: any = useCart()

onMounted(() => {
    category.value = route.params.category
    getProductsData()
})

const getProductsData = (): void => {
    showSpinner.value = true
    axios.get(`https://fakestoreapi.com/products/category/${category.value}`).then(response => {
        showSpinner.value = false
        productData.data = response.data;
        dataBackup.value = JSON.parse(JSON.stringify(productData.data));
    })
}

const handleSearch = debounce((): void => {
    if (searchText.value == '') {
        productData.data = dataBackup.value
        return
    }
    productData.data = productData.data.filter((data: any) => {
        const title = data.title.toLowerCase()
        const description = data.description.toLowerCase()
        if (searchText.value &&
            (title.includes(searchText.value.toLowerCase()) || description.includes(searchText.value.toLowerCase()))) {
            return data
        }
    })

}, 500)

watch(searchText, () => {
    handleSearch()
})

watch(priceSort, () => {
    sortByPrice()
})

function sortByPrice(): void {
    productData.data.sort((val1: any, val2: any) => {
        if (priceSort.value == 1) {
            if (val1.price < val2.price)
                return -1
            return 1;
        }
        else {
            if (val1.price < val2.price)
                return 1
            else return -1;
        }
    })
}

const getRating = (rating: number): string => {
    let ratingVal;
    const decimalVal = rating.toString().split('.');
    ratingVal = getDecimalRating(decimalVal, rating)
    return `--rating: ${ratingVal}`;
}

const getDecimalRating = (decimalVal: string[], rating: number): number => {
    if (+decimalVal[1] < 3) return Math.floor(rating)
    else if (+decimalVal[1] >= 3 && +decimalVal[1] <= 7) return +(decimalVal[0] + '.5')
    else if (+decimalVal[1] > 7) return Math.ceil(rating)
    else return rating
}

const handleGotoCart = (): void => {
    router.push({ name: 'cart' })
}

const handleAddtoCart = (product: any): void => {
    product['quantity'] = 1
    cart.setCart(product)
    window.location.reload()
}

</script>

<template>
    <div class="container-fluid">
        <button class="btn btn-primary mb-2" @click="$router.back()">Go back</button>
        <div class="row mb-3">
            <div class="col-auto">
                <input v-model="searchText" type="text" class="form-control" id="search" placeholder="Search product...">
            </div>
            <div class="col-auto">
                <div class="row g-3 align-items-center">
                    <div class="col-auto">
                        <select v-model="priceSort" class="form-select" aria-label="Default select example" role="button">
                            <option selected disabled value="0">Sort by Price</option>
                            <option value="1">Low to high</option>
                            <option value="2">High to low</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-auto" v-if="cart.getCart()?.length">
                <button type="button" class="btn btn-primary position-relative" @click="handleGotoCart">
                    Go to Cart
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {{ cart.getCart().length }}
                        <span class="visually-hidden">unread messages</span>
                    </span>
                </button>
            </div>
        </div>
        <div class="shadow p-3 mb-3 bg-body-tertiary rounded">{{ category?.toUpperCase() }}</div>
        <div class="row" v-if="productData.data?.length">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); grid-gap: 10px;">
                <div class="col-md-3" v-for="product in productData.data">
                    <div class="card mb-2 p-3 shadow" style="width: 18rem; height: 100%;">
                        <img :src="product.image" class="card-img-top" alt="products" style="height: 250px;">
                        <div class="card-body">
                            <div class="d-flex justify-content-end mb-3">
                                <div class="col">Rating: {{ product.rating.rate }}/5
                                </div>
                                <div class="Stars p-1 ps-2" :style="getRating(product.rating.rate)"
                                    aria-label="Rating of this product is 2.3 out of 5.">
                                </div>
                            </div>
                            <h5 class="card-title">{{ product.title }}</h5>
                            <p class="card-text">{{ product.description }}</p>
                        </div>
                        <div class="card-footer">
                            <p class="card-text">Price : ${{ product.price }}</p>
                        </div>
                        <div class="d-flex justify-content-end mt-3">
                            <button class="btn btn-primary" @click="handleAddtoCart(product)">Add to cart</button>
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
        <p v-if="!productData.data?.length && !showSpinner">No data Found</p>
    </div>
</template>

<style>
:root {
    --star-size: 25px;
    --star-color: #fff;
    --star-background: #fc0;
}

.Stars {
    --percent: calc(var(--rating) / 5 * 100%);

    display: inline-block;
    font-size: var(--star-size);
    font-family: Times;
    /* make sure ★ appears correctly */
    line-height: 1;
    background: #6a6a6a;
    border-radius: 20px;

    &::before {
        content: '★★★★★';
        letter-spacing: 3px;
        background: linear-gradient(90deg, var(--star-background) var(--percent), var(--star-color) var(--percent));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
}
</style>