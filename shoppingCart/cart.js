//全局过滤器的用法
Vue.filter("money",function(value,type){
    return "￥"+value.toFixed(2)+type;
});
var vm = new Vue({
    el:'#app',
    data:{
        totalMoney:0,
        productList:[],
        checkAllFlag:false,
        totalPrize:0,
        delFlag:false,
        curIndex:'',
        trueArr:[],
        indexArr:[],
    },
    //过滤器
    filters:{
        //金额的过滤器(这里用的局部过滤器)
        formatMoney:function (value){
            return "￥" + value.toFixed(2);
        }
    },
    //加载完成1.0版本是reday,加载完成之后执行里面的函数
    mounted:function(){
        this.cartView();
        // this.init(this.productList);
    },
    methods:{
        cartView:function(){
            var _this = this;
            this.$http.get("data/cartData.json").then(function(res){
                _this.productList = res.data.result.list;
                _this.totalMoney = res.data.totalMoney;
            });
        },        
        //改变金额
        changeMoney:function(item,index,way){
            if(typeof item.checked == "undefined"){
                Vue.set(item,'isActive',false);
            }
            if(way>0){
                item.productQuantity++;
                this.productList[index].isActive = false;
            }else{
                item.productQuantity--;
                if(item.productQuantity < 2){
                    this.productList[index].isActive = true;
                    item.productQuantity = 1;
                }
            }
            this.calcTotalPrize();
        },
        //增加check选项
        selectedProduct:function(item,index){
            var _this = this;
            if(!item.checked){
                //this.$set(item,'checked',true);//在data中添加checked只在#app中使用
                Vue.set(item,'checked',true);//在Vue全局中添加checked属性
                this.trueArr.push(item.checked);
            }else{
                item.checked = !item.checked;
                this.trueArr.splice(0,1);             
                _this.checkAllFlag = false;
            }
            if(this.trueArr.length == this.productList.length){
                this.checkAllFlag = true;
            }
            this.calcTotalPrize();
        },
        //全选和取消全选功能
        checkAll:function(flag){
            this.checkAllFlag = flag;
            var _this = this;
            this.productList.forEach(function(item,index){
                //如果没有这个属性的时候还是需要给所有的重新注册checked属性
                if(typeof item.checked == "undefined"){
                    Vue.set(item,'checked',_this.checkAllFlag);//在Vue全局中添加checked属性
                    // _this.calcTotalPrize();
                }else{
                    item.checked = _this.checkAllFlag;
                    _this.trueArr = [];
                }
            });
            this.calcTotalPrize();
        },
        //计算总金额
        calcTotalPrize:function(){
            var _this = this;
            _this.totalPrize = 0;
            this.productList.forEach(function(item,index){
                if(item.checked){
                    _this.totalPrize += item.productPrice*item.productQuantity;
                }
            })
        },
        //点击商品的索引保存
        delConfirm:function(index){
            this.delFlag = true;
            this.curIndex = index;
            
        },
        //删除商品的方法
        delProduct:function(){
            //返回删除商品的索引
            this.productList.splice(this.curIndex,1);
            this.delFlag = false;
            this.calcTotalPrize();
        }
    }
})
