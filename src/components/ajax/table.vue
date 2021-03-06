<template>
<div class="wula-table" :class="{'none-border':noneBorder}">
    <Form
            v-if="showForm"
            ref = "serach"
            :rules="tableData.rules"
            :model="tableData.forms"
            :label-width="labelWidth"
            :label-position="labelPosition"
            :inline="inline">
        <slot name="search"> </slot>

        <Form-item>
            <Button type="primary" @click="search('serach')" :loading="loading" >搜索</Button>
            <Button @click="rightBarVisible = !rightBarVisible"  v-if="showRightBar">高级搜索</Button>
        </Form-item>
    </Form>

    <Table :columns="columns" :data="items" :is-group="isGroup" :is-ajax="isAjax" :context="self" ref="table" style="z-index: 0;" 
    @on-sort-change="sortSearch" 
    @on-row-click="(row)=>this.$emit('on-row-click',row)"
    @on-select="(selection,row)=>this.$emit('on-select',[selection,row])"
    @on-selection-change="(selection)=>this.$emit('on-selection-change',selection)"
    @on-current-change="(currentRow,oldCurrentRow)=>this.$emit('on-current-change',[currentRow,oldCurrentRow])"
    :no-data-text="noDataText" 
    :no-filtered-data-text="noFilteredDataText">
        <div class="page-footer" slot="footer" v-show="page.total || isShowActions">
            <div class="page-footer-left">
                <slot name="actions">
                </slot>
            </div>

            <div class="page-footer-cell pull-right" >
                <Page
                        v-show="page.total"
                        :total="page.total"
                        size="small"
                        :current="page.current"
                        :page-size="page.size"
                        :page-size-opts="page.sizeOpts" @on-change="handlePage"
                        show-total  > </Page>
            </div>


        </div>

    </Table>

    <wula-right-bar v-if="showRightBar" v-model="rightBarVisible">
        <Form
                ref = "extraSearch"
                :rules="tableData.rules"
                :model="tableData.forms"
                :label-width="55"
                label-position="right"
        >
            <slot name="search-extra"> </slot>

            <Form-item>
                <Button type="primary" @click="search('extraSearch')" :loading="loading" >搜索</Button>
            </Form-item>
        </Form>
    </wula-right-bar>
</div>
</template>
<style lang="scss">
    .none-border{
        .ivu-table-wrapper{
            border-left: 0;
        }
        .ivu-table:after{
            background-color: transparent;
        }
    }
    .page-footer{
        padding: 12px 0;
        overflow: hidden;
        .page-footer-left{
            padding: 0 18px;
            float: left;
        }
        &-cell{
            padding: 0 18px;
        }
    }
</style>
<script>
import $ from 'jquery'
import {oneOf} from '../../utils/fn'
import ajax from '../../utils/ajax'

export default {
    name: 'AjaxTable',
    props: {
        url: {
            type: String,
            required: true
        },
		noneBorder:{
            type:Boolean,
            default:false
        },
        method: {
            type: String,
            validator(value) {
                return oneOf(value, ['get', 'post', 'put', 'delete']);
            },
            default: 'get'
        },
        tableData:{
            type:Object,
            required:true,
            default: {forms:{},rules:{},columns:[]}
        },
        labelWidth: {
            type: Number
        },
        labelPosition: {
            type:String,
        },
        inline: {
            type: Boolean,
            default: true
        },
        isGroup:{
            type: Boolean,
            default: false
        },
        isAjax:{
            type: Boolean,
            default: true
        },
        noDataText: {
            type: String
        },
        noFilteredDataText: {
            type: String
        }
    },
    data() {
        return {
            isShowActions:false,
            self:this.$parent,
            rightBarVisible:false,
            loading: false,
            columns:[],
            sortOrder:{
                field:'',
                order:''
            },
            page:{
                total:0,
                current:1,
                size:10,
                sizeOpts:[5,10,15,20,30,50]
            },
            permits:{},
            filter:{
                key:'',
                value:''
            },
            items:[],
            showForm:true,
            showRightBar:false
        }
    },
    created() {
        this.showForm = this.$slots['search'] !== undefined;
        this.showRightBar = this.$slots['search-extra'] !== undefined;
        this.isShowActions = this.$slots['actions'] !== undefined;
        this.getData();
    },
    mounted(){
        this.cloneColumns();
    },
    methods: {
        cloneColumns(){
            let columns = this.tableData.columns;
            columns.map(column=>{
                if(column.filters){
                    if(!column.filterMethod)
                    {
                        column.filterRemote = function(value, key,column){
                            this.filterRemote(value, key,column)
                        }
                    }
                }
            })
            this.columns = columns;
        },
        getData(){
            let params = Object.assign({
                page:{
                    current:this.page.current,
                    size:this.page.size
                },
                sort:{
                    field:this.sortOrder.field,
                    order:this.sortOrder.order
                }
            },{filter:this.filter},this.tableData.forms);
            ajax.any({
                url     : this.url,
                dataType: 'json',
                method  : this.method,
                data:params,
                loaderObject:this
            }).json(data=>{
                this.items = data.items;
                if(data.page && data.page.total){
                    this.page.total = data.page.total;
                }
             
                if(data.permits){
                    this.permits = data.permits;
                }
            })
        },
        sortSearch({column,key,order}){
            if(this.isAjax){
                this.sortOrder.field = order=="normal"?"": key;
                this.sortOrder.order= order=="normal"?"":order;
                this.page.current = 1;
                this.getData();
            }
        },
        search(ref){
            this.$refs[ref].validate((valid) => {
                if (valid) {
                    this.handlePage(1)
                } else {
                    console.log('表单验证失败!');
                }
            })
        },
        handlePage(page){
            this.page.current = page;
            this.getData();
        },
        reload(){
            this.handlePage(1);
        },
        filterRemote(value, key,column){
            this.filter.key = key;
            this.filter.value = value.join(',');
            this.page.current = 1;
            this.getData();
        },
        selectAll(){
            this.$refs.table.selectAll(true);
        },
        deleteRow(index){
        	this.items.splice(index,1);
        }
    },
    components: {}
}
</script>
