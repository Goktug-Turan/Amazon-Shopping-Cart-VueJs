Vue.component('Vuecart', {
    props:{
        cart:{ type: Array, required: true },
        title:{ type: String, required: true },
        type:{ type: String, required: true },
    },
    methods:{
        removeFromCart(index){
           return this.cart.splice(index, 1);
        },
        changeCart(index){
            const item = this.removeFromCart(index);
            this.$emit('itemchangedoncart', item[0], this.type)
        },
    },
    computed:{
        cartTotal(){
            let total = 0;
            this.cart.forEach((item) => {
                total += parseFloat(item.price, 10)
            });
            return total.toFixed(2);
        },
        isShoppingCart(){
            return this.type == "shoppingCart"
        },
        isSavedCart(){
            return this.type == "savedCart"
        }
    },
    template:`
    <div class="cart-wrapper">
        <h2>Shopping Cart</h2>
        <p v-if="!cart.length">No item in cart</p>
        <div class="cart">
            <div class="item" v-for="(item, index) in cart">
                <div class="image">
                    <a v-bind:href="item.url">
                        <img v-bind:src="item.image">
                    </a>
                </div>
                <div class="info">
                    <h4>{{item.name}}</h4>
                    <p class="seller">by {{item.seller}}</p>
                    <p class="status available" v-if="item.isAvailable">In Stock</p>
                    <p class="shipping" v-if="item.isEligible">Eligible for FREE Shipping & FREE Returns</p>
                    <a href="#" v-on:click="removeFromCart(index)">Delete</a>
                    <a href="#" class="secondary" v-on:click="changeCart(index)" v-if = "isShoppingCart" >Save for Later</a>
                    <a href="#" class="secondary" v-on:click="changeCart(index)" v-if = "isSavedCart" >Move to cart</a>
                </div>
                <p class="price">$ {{item.price}} </p>
            </div>
        </div>
        <div class="subtotal" v-if = "cart.length">
        Subtotal ({{cart.length}} items):<span class="price">\${{cartTotal}}</span>
        </div>
    </div>
    `
})

window.addEventListener('load', () => {
    window.vue = new Vue({
        el:'#app',
        data:{
            isLoading: true,
            cart: [],
            saved: []
        },
        methods:{
            handleItemChange(item, cartType){
                if (cartType === "shoppingCart") {
                    this.saved.push(item)
                } else {
                    this.cart.push(item)
                }
            }
        },
        created(){
                fetch('https://gist.githubusercontent.com/Goktug-Turan/74b9a11aaec6995d6a367f45406a35a9/raw/b91c35ea057dc159379feebe89cf038b2016cc5a/Amazon%2520shopping%2520cart%2520updated%2520data.json')
                .then((response) => { return response.json() })
                .then((response) => { this.isLoading = false 
                    this.cart = response.cart;
                    this.saved = response.saved;
                })       
        },       
    });
});
