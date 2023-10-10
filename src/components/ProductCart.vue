<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import useCart from "../composables/useCart";
import router from "@/router";

const cart = useCart()
const cartData = ref<any>([])
const priceTotal = ref(0)
const totalQty = ref(0)

onMounted(() => {
    let data = cart.getCart()
    if (data) {
        const productCart = data.reduce((acc: any, value: any) => {
            if (acc.length === 0) acc.push(value)
            else acc = checkDuplicate(acc, value)
            return acc
        }, [])
        cartData.value = productCart
    }
})

const checkDuplicate = (acc: any, value: any): string[] => {
    const index = acc.findIndex((ele: any) => ele.id === value.id)
    if (index === -1) acc.push(value)
    else acc[index].quantity += 1
    return acc
}

watch([cartData, totalQty], () => {
    totalQty.value = 0
    priceTotal.value = 0
    cartData.value.forEach((element: any) => {
        totalQty.value += element.quantity
        if (element.quantity == 1) priceTotal.value += element.price
        else priceTotal.value += element.price * element.quantity
    });
})

const removeItem = (id: number): void => {
    cartData.value = cartData.value.filter((element: any) => element.id != id)
}

const qtyChange = (type: number, id: number): void => {
    const index = cartData.value.findIndex((elem: any) => elem.id === id)
    if (type === 0) {
        totalQty.value -= 1
        cartData.value[index].quantity -= 1
    } else {
        totalQty.value += 1
        cartData.value[index].quantity += 1
    }
}

const emptyCart = (): void => {
    localStorage.removeItem('cart')
    router.back()
}

</script>

<template>
    <div class="container-fluid">
        <button class="btn btn-primary mb-2 me-4" @click="$router.back()">Go back</button>
        <button v-if="cartData?.length" class="btn btn-primary mb-2" @click="emptyCart">Empty cart</button>
        <!-- <div class="shadow p-3 mb-3 bg-body-tertiary rounded">Cart Item(s)</div> -->
        <div v-if="cartData?.length" class="d-flex justify-content-center">
            <div class="card" style="width: 100rem;">
                <div class="card-header fw-bold"> Product(s) in cart </div>
                <ul class="list-group list-group-flush">
                    <li v-for="product in cartData" class="list-group-item d-flex">
                        <div class="col">
                            <img :src="product.image" class="card-img-top" alt="products" style="height: 50px;width: 50px;">
                        </div>
                        <div class="col mt-3">
                            <button class="btn btn-light btn-sm me-2" type="button" :disabled="product.quantity == 1"
                                @click="qtyChange(0, product.id)">-</button>
                            {{ product.quantity }}
                            <button class="btn btn-light btn-sm ms-2" type="button"
                                @click="qtyChange(1, product.id)">+</button>
                        </div>
                        <div class="col me-4">{{ product.title }}</div>
                        <div class="col">${{ product.price }}</div>
                        <div class="col mt-3">
                            <button class="btn btn-danger btn-sm" type="button" @click="removeItem(product.id)">X</button>
                        </div>
                    </li>
                </ul>
                <div class="card-footer">
                    <div class="row align-items-start">
                        <div class="fw-bold">Total quantity : {{ totalQty }}</div>
                        <div class="fw-bold">Total Price : ${{ priceTotal.toFixed(2) }}</div>
                    </div>
                </div>
            </div>
        </div>
        <p v-if="!cartData?.length">No product in cart</p>
    </div>
</template>