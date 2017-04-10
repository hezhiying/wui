<template>
    <Input v-model="inputValue" :readonly="readonly">
    <template slot="append">
            <transition name="fade" v-if="!loading"  mode="out-in">
            <Upload ref="upload" 
                :action="url"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :max-size="maxSize"
                :format="['jpg','jpeg','png']"
                :on-error="handleUploadFail"
                :before-upload="handleBefore"
                multiple
                >
                <Button icon="upload" :loading="loading"></Button>
            </Upload>
            </transition>
            <transition name="fade" v-else  mode="out-in">
                <Spin ></Spin>
            </transition>
    </template>
   
    </Input>
</template>

<script lang="babel">
    export default {
        name: 'UploadInput',
        props: {
            value: {
                type: String,
                default: ''
            },
            url:{
                type:String,
                required:true
            },
            readonly:{
                type: Boolean
            },
            maxSize:{
                type: Number,
                default:2048
            }
        },
        computed:{
            inputValue:{
                get(){
                    return this.currentValue;
                },
                set(val){
                    this.$emit("input",val)
                }
            }
        },
        data() {
            return {
                uploadList:[],
                loading:false,
                currentValue:this.value
            }
        },
        watch:{
            value(val){
                this.currentValue = val;
            }
        },
        mounted () {
            console.log(this.$refs.upload)
            this.uploadList = this.$refs.upload?this.$refs.upload.fileList:[];
        },

        methods: {
            handleBefore(file){
                this.loading = true;
            },
           handleSuccess (res, file) {
               this.loading=false;
                // 因为上传过程为实例，这里模拟添加 url
                file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
                file.name = '7eb99afb9d5f317c912f08b5212fd69a';
                this.$emit("input",file.url);
            },
            handleFormatError (file) {
                this.loading=false;
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
            },
            handleMaxSize (file) {
                this.loading=false;
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 '+this.maxSize+'Kb。'
                });
            },
            handleUploadFail (error, response,file) {
                this.loading=false;
                this.$Notice.error({
                    title: '上传失败'
                });
            },
    
        },
        components: {}
    }
</script>
