export default function useCart() {

    const setCart = (product) => {
        const data = [product]
        const cartData = JSON.parse(localStorage.getItem('cart'));
        if (cartData)
            localStorage.setItem('cart', JSON.stringify([...cartData, ...data]));
        else
            localStorage.setItem('cart', JSON.stringify([...data]));
    }

    const getCart = () => {
        const cartData = JSON.parse(localStorage.getItem('cart'));
        return cartData
    }
    return { setCart, getCart }
}