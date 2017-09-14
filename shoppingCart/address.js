var vm = new Vue({
    el:'.container',
    data:{
        addressList:[],
        addressLimit:3,
        curIndex:0,
        checkNum:1,
        msg:'全部',
        checkActive:true,
    },
    mounted:function(){
        this.cartView();
    },
    computed:{
        filterAddress:function(){
            return this.addressList.slice(0,this.addressLimit);
        }
    },
    methods:{
        cartView:function(){
            var _this = this;
            this.$http.get("data/address.json").then(function(res){
                _this.addressList = res.data.result;
            });
        },
        setDefault:function(addressId){
            console.log(addressId);
            this.addressList.forEach(function(value,index){
                if(value.addressId == addressId){
                    value.isDefault = true;
                }else{
                    value.isDefault = false;
                }
            });
        },
        togglerClick:function(){
            if(this.addressLimit == 3){
                this.msg = '收起';
                this.addressLimit = this.addressList.length;
            }else{
                this.addressLimit = 3;
                this.msg = '全部';
            }
        }
    }
})