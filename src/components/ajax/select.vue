<template>
    <Select v-model="value" filterable ref="ajaxSelect">
        <slot>
            <Option v-for="item in items" :value="item.value" :key="item">{{ item.label }}</Option>
        </slot>
    </Select>
</template>
<script lang="babel">
    import $ from 'jquery'
    export default{
        name:'AjaxSelect',
        props:{
            value: {
                type: [String, Number, Array],
                default: ''
            },
            url:{
                type:String,
                required:true
            },
            params:{
                type:Object
            }
        },
        data(){
            return{
                items:[{value:1,label:11111}],
                model:this.value
            }
        },
        methods:{
            search(val){
                let that = this;
                console.log(val);

                $.ajax({
                    url     : this.url,
                    dataType: 'json',
                    data:{key:val},
                    method  : 'get'
                }).done(function (data) {
                    that.items = data.items;
                }).always(function (data) {
                });
            }
        },
        computed:{
          query(){
              return this.$refs.ajaxSelect.query;
          }
        },
        mounted(){
            this.$watch(function () {
                return this.query;
            },function (val,oldVal) {
                if(val)
                this.search(val);
            })
        }
    }
</script>
