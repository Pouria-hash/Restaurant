
// Create an instance of the Stripe object with your publishable API key
var stripe = Stripe('pk_test_51INFNJBt4WY41fkQYXDxgFew0G78xJAAYFC1svCXO9HZYUNdJRswkIoOE85j1jKNClK8QzpMZV8l1paJ3gGYJhha00QtKnopIF');
var checkoutButton = document.getElementById("checkout-button");
checkoutButton.addEventListener("click", async function (e) {
    e.target.textContent = "processing..."
    const orderId = e.target.dataset.orderId
    try {
        const { data } = await axios.get(`/create-checkout-session/${orderId}`)
        console.dir(data)
        stripe.redirectToCheckout({ sessionId: data.id })
    } catch (err) {
        alert(err.message)
    }
    // fetch(`/create-checkout-session/${orderId}`, {
    //     method: "get",
    // })
    //     .then(function (response) {
    //         return response.json();
    //     })
    //     .then(function (session) {
    //         return stripe.redirectToCheckout({ sessionId: session.id });
    //     })
    //     .then(function (result) {
    //         // If redirectToCheckout fails due to a browser or network
    //         // error, you should display the localized error message to your
    //         // customer using error.message.
    //         if (result.error) {
    //             alert(result.error.message);
    //         }
    //     })
    //     .catch(function (error) {
    //         console.error("Error:", error);
    //     });
});
