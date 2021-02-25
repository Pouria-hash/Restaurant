

const items = document.querySelector('#items')
const orderButton = document.querySelector('#orderButton')
const shippingForm = document.querySelector('#shippingForm')

const numItems = parseInt(items.innerText.slice(1))
let shipping = 0
if (numItems > 100) {
    shipping = 0
} else {
    shipping = 10
}

const total = numItems + shipping

const price = async () => {
    await axios.put('/api/addprice', { total, shipping })
}


orderButton.addEventListener('click', price)
