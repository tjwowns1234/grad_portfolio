<template>
<div id="botNavDiv" :style="botNavDivStyle">
    <b-button variant="outline-danger" v-b-modal.botNav @mouseenter="botNavDivHover()" @mouseleave="botNavDivLeave()">
        <strong>청주시 통계</strong>
        <!-- <img src="../assets/analysis.png" width="50" height="48"> -->
    </b-button>
    <b-modal id=botNav size="xl" hide-footer header-bg-variant="light" title="청주시 매매가,매매량 동향 ">
        <b-container>
            <b-nav tabs fill pills align="center">
                <b-nav-item v-bind:active="tab === 1" v-on:click="navClick(1)">요약</b-nav-item>
                <b-nav-item v-bind:active="tab === 2" v-on:click="navClick(2)">'구'별</b-nav-item>
                <b-nav-item v-bind:active="tab === 3" v-on:click="navClick(3)">기타</b-nav-item>
            </b-nav>
            <b-row  v-if="tab === 1">
                <b-col>
                    <h3>전체 평균</h3>
                    <apexchart height="500" type="line" :options="chartOptions_all" :series="series_all"/>
                </b-col>
            </b-row>
            <b-row  v-if="tab === 2">
                <!-- <b-col md="6">
                    <h3>{{title}}</h3>
                    <apexchart height="300" type="line" :options="chartOptions_gu1" :series="series_gu1"/>
                </b-col>
                <b-col md="6">
                    <apexchart height="300" type="line" :options="chartOptions_gu2" :series="series_gu2"/>
                </b-col>
                <b-col md="6">
                    <apexchart height="300" type="line" :options="chartOptions_gu3" :series="series_gu3"/>
                </b-col>
                <b-col md="6">
                    <h3>{{gu_data[3].name}}</h3>
                    <apexchart height="300" type="line" :options="chartOptions_gu4" :series="series_gu4"/>
                </b-col> -->
            </b-row>
        </b-container>
    </b-modal>
</div>
</template>

<script>
import axios from 'axios'
export default {
    components :{

    },
    data(){
        return{
            msg : "botNav.vue",
            title : "tti",
            tab : 1,
            botNavDivStyle :{
                position: "absolute",
                zIndex: "1",
                top : "84vh",
                left: "44%",
                opacity: "0.7",
            },
            series_all: null,
            chartOptions_all : null,
            all_data : null,
            gu_data : null,

            series_gu1 : null,
            chartOptions_gu1 : null,
            series_gu2 : null,
            chartOptions_gu2 : null,
            series_gu3 : null,
            chartOptions_gu3 : null,
            series_gu4 : null,
            chartOptions_gu5 : null,
        };// return data end
    },// data() end
    methods:{
        botNavDivHover : function(){
            this.botNavDivStyle.opacity = "1";
        },
        botNavDivLeave : function(){
            this.botNavDivStyle.opacity = "0.7";
        },
        navClick : function(num){
            if(num == 1){
                this.tab = 1;
            }
            else if(num == 2){
                this.tab =2;
            }
            else if(num == 3){
                this.tab = 3;
            }
            else{
                this.tab = 1;
            }
        },
        fillData : function() {
            this.chartOptions_all ={
                stroke: {
                    width: [0, 4]
                },
                title: {
                    text: "기간 : " + "2010-02" + " ~ " + "2015-02"
                },
                // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                labels: ['2001-01-08', '2001-02-08', '2001-03-08', '2001-04-08', '2001-05-08', '2001-06-08',
                    '2001-07-08', '2001-08-08', '2001-09-08', '2001-09-08', '2001-11-08', '2001-12-08'
                ],
                xaxis: {
                    type: 'datetime',
                    labels: {
                            format: 'yyyy-MM',
                        }
                },
                yaxis: [
                    {
                        title: {
                        text: '매매량',
                        },

                    }, 
                    {
                        opposite: true,
                        title: {
                        text: '매매가'
                        }
                    }
                ]
            };
            this.series_all = [
                {
                    name: '매매량',
                    type: 'column',
                    data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
                }, 
                {
                    name: '매매가',
                    type: 'line',
                    data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
                }
            ];
        },
        getAllData : function(){
            // let targetAddr = "http://localhost:5000/api/getAllData";
            axios.get(targetAddr).then(res =>{
                this.all_data = JSON.parse(res.data);
                // 청주시 전체 정보 저장
                this.all_data.name = res.name;
                this.all_data.durationList = res.durationList;
                this.all_data.Prices  = res.Prices;
                this.all_data.amountList = res.amountList;
                

                // apexchart 데이터,옵션 설정
                this.chartOptions_1 ={
                    stroke: {
                        width: [0, 4]
                    },
                    title: {
                        text: "기간 : " + "2010-02" + " ~ " + "2015-02"
                    },
                    // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    labels: this.all_data.durationList,
                    xaxis: {
                        type: 'datetime',
                        labels: {
                                format: 'yyyy-MM',
                            }
                    },
                    yaxis: [
                        {
                            title: {
                            text: '매매량',
                            },

                        }, 
                        {
                            opposite: true,
                            title: {
                            text: '매매가'
                            }
                        }
                    ]
                };
                this.series_1 = [
                    {
                        name: '매매량',
                        type: 'column',
                        data: this.all_data.amountList
                    }, 
                    {
                        name: '매매가',
                        type: 'line',
                        data: this.all_data.Prices
                    }
                ];
            }).catch(e =>{
            console.log("error :", e);
            });
        }
    },
    mounted() {
        this.getAllData();
    }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Nanum+Gothic&display=swap");
#botNavDiv{
    font-family: 'Nanum Gothic', sans-serif;
    background-color: aliceblue;
    z-index: 1;
    position: absolute;
}

#botNav{
    background-color: aliceblue;
    text-align: center;
}

h1,h2,h3,h4,h5 {
    margin-top: 20px;
    margin-bottom: 0px;
    padding: 0;
    text-align: center;
}
</style>