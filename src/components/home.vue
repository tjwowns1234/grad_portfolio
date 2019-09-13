<template>

<div>
    <div class="vld-parent">
        <loading 
                :active.sync="isPageLoading" 
                :is-full-page="true"
                :color ="SpinnerColor"
                :width ="SpinnerWidth"
                :height = "SpinnerHeight"
                :z-index = "SpinnerZindex"
        >
        </loading>
    </div>

    <div id="map" style="width:vh;height:100vh;"
        @click.native = "mapStyleClick()">
    </div>
    
    <search v-if="!mapNavVisible"></search>

    <b-card
        ref="mapLeftNav"
        id="mapNav" 
        v-bind:style="mapNavStyle"
        v-if="mapNavVisible"
        @click.native = "mapNavStyleClick()"
        style="vld-parent" 
    >
        <div class="cardHead">
            <b-button 
                @click="mapNavNonVisibleClick()" variant="outline" class="closeButton">×
            </b-button>
            <h2 class="cardTitle">{{curInfo.name}}</h2>
            <h5 class="cardSubTitle">{{curInfo.addr}}</h5>
            <h5 class="cardSubTitle">({{curInfo.newaddr}})</h5>
        </div>
        <b-tabs card fill pills content-class="mt-3" justified>
            <!-- tab 1 -->
            <loading 
                :active.sync="isLoading" 
                :is-full-page="false"
                :color ="SpinnerColor"
                :width ="SpinnerWidth"
                :height = "SpinnerHeight"
            >
            </loading>
            <b-tab title="매매" active @click="setTotalAvgSave()">
                <!-- chart(area) Button, Title -->
                <h5 class="cardBodyText">매매가/매매량 차트</h5>
                <div>
                    <b-button-group>
                        <!-- 면적구분 버튼 -->
                        <b-dropdown text="면적구분" size="sm" variant="outline-primary" style="width:17.2vh;">
                            <b-dropdown-item-button
                                @click="setTotalAvgSave()"
                            >
                                전체평균
                            </b-dropdown-item-button>
                            <b-dropdown-divider></b-dropdown-divider>
                            <b-spinner class="mx-4" large variant="primary" v-if="isAreadLoading"></b-spinner>
                            <b-dropdown-item-button
                                variant="outline-primary" 
                                @click="viewAreaChart(index)"
                                v-for ="(item,index) in area_info"
                                v-bind:key ="item['전용면적']"
                            >{{item["전용면적"]}}
                            </b-dropdown-item-button>
                        </b-dropdown>
                        <!-- 기간 버튼 -->
                        <b-dropdown text="기간" size="sm" variant="outline-primary" style="width:17.2vh;">
                            <b-dropdown-item @click="changeDuration('x')">전체 기간</b-dropdown-item>
                            <b-dropdown-divider></b-dropdown-divider>
                            <b-dropdown-item @click="changeDuration('1Y')">최근 1년</b-dropdown-item>
                            <b-dropdown-item @click="changeDuration('2Y')">최근 2년</b-dropdown-item>
                            <b-dropdown-item @click="changeDuration('3Y')">최근 3년</b-dropdown-item>
                            <b-dropdown-item @click="changeDuration('5Y')">최근 5년</b-dropdown-item>
                            <b-dropdown-item @click="changeDuration('1m')">최근 1달</b-dropdown-item>
                            <b-dropdown-item @click="changeDuration('3m')">최근 3달</b-dropdown-item>
                            <b-dropdown-item @click="changeDuration('6m')">최근 6달</b-dropdown-item>
                        </b-dropdown>
                        <b-button 
                            variant="outline-danger"
                            size="sm"
                            :pressed="isTerrain"
                            @click="chkTerrain()"
                        >지적편집도</b-button>
                    </b-button-group>
                </div>
                <!-- chart -->
                <apexchart class="chart" height="300px" type="line" :options="chartOptions_1" :series="series_1"/>

                <!-- 최근 실거래 데이터 -->
                <div v-if="apt_info.tranPriceList == null">
                    <h5 class="cardBodyText" >최근 실거래 데이터 없음</h5>
                </div>
                <div v-else>
                    <h5 class="cardBodyText" v-if="curInfo.area =='전체평균'">최근 실거래 데이터({{curInfo.area}})</h5>
                    <h5 class="cardBodyText" v-else>최근 실거래 데이터({{curInfo.area}}m<sup>2</sup>)</h5>
                    <b-table striped hover :items="apt_info.tranPriceList"></b-table>
                </div>

                <!-- 단지정보 -->
                <h5 class="cardBodyText">단지정보</h5>
                <b-table-simple striped hover>
                    <b-tr>
                        <b-th style="width:10vh;">구분</b-th>
                        <b-th>정보</b-th>
                    </b-tr>
                    <b-tr>
                        <b-td>단지명</b-td>
                        <b-td>{{apt_info.dangeeInfo["단지명"]}}</b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>전용면적</b-td>
                        <b-td>{{apt_info.dangeeInfo["전용면적"]}}</b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>총세대수</b-td>
                        <b-td>{{apt_info.dangeeInfo["총세대수"]}}</b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>난방방식</b-td>
                        <b-td>{{apt_info.dangeeInfo["난방방식"]}}</b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>총동수</b-td>
                        <b-td>{{apt_info.dangeeInfo["총동수"]}}</b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>학군</b-td>
                        <b-td>
                            {{apt_info.dangeeInfo["학군(1)"]}}
                            {{apt_info.dangeeInfo["학군(2)"]}}
                            {{apt_info.dangeeInfo["학군(3)"]}}
                        </b-td>
                    </b-tr>
                </b-table-simple>
            </b-tab>
            <!-- tab 2 -->
            <b-tab title="분석" @click="targetAnalysis()">
                <div style="overflow-y:hidden">
                    <!-- 동 전체 평균 -->
                    <h5 class="cardBodyText">{{curInfo.dongName}} 동향</h5>
                    <apexchart class="chart" height="300px" type="line" :options="chartOptions_3" :series="series_3"/>

                    <!-- 구 전체 평균 -->
                    <h5 class="cardBodyText">{{curInfo.guName}} 동향</h5>
                    <apexchart class="chart" height="300px" type="line" :options="chartOptions_2" :series="series_2"/>

                    <!-- 청주 전체 평균 -->
                    <h5 class="cardBodyText">{{curInfo.siName}} 동향</h5>
                    <apexchart class="chart" height="300px" type="line" :options="chartOptions_4" :series="series_4"/>
                </div>
            </b-tab>
            <b-tab title="Big Data">
                <div style="overflow-y:hidden">
                    <p>준비중...</p>
                    <h5 class="cardBodyText">{{curInfo.addr + ' '+ curInfo.name}} 분석결과</h5>
                    <apexchart class="chart" height="300px" type="line" :options="chartOptions_1" :series="series_1"/>
                </div>
            </b-tab>
        </b-tabs>
    </b-card>

    <div v-if="!mapNavVisible && !isBegin" style="position:absolute; z-index:1; top:2vh; left:1vh">
        <b-button 
            variant="outline-light"
            @click="initChart(); mapNavVisibleClick();">
            <img src="../assets/add-circular.png" width="30" height="28">
        </b-button>
    </div>

    <!-- <botNav></botNav> -->
        
</div>
</template>

<script>
import axios from 'axios'
import JSON from 'JSON'
import search from './search'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
export default {
    name: "home",
    components: {
        search,
        Loading
    },
    data() {
        return {
            isBegin : true,
            SpinnerColor: '#ff3366',
            SpinnerWidth : 220,
            SpinnerHeight : 220,
            SpinnerZindex : 4,
            isAreadLoading : true,
            isLoading: true,
            isPageLoading : true,
            fullPage: true,
            isTerrain : false,
            title : "CS2",
            maxTime : new Date(),
            minTime : new Date(),
            mapNavVisible : false,
            target : "CS2",
            curAddr : "CS2",
            targetResult :[
                {id :"0", name : "a"},
                {id :"1", name : "b"},
                {id :"2", name : "c"}
            ],
            mapNavStyle : {
                position: "absolute",
                zIndex : "5",
                width: "51vh",
                maxWidth: "51vh",
                height: "90vh",
                top : "1vh",
                left: "-51vh",
                opacity: "1",
                borderRadius:"0.4vh",
                boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 60px 80px 0 rgba(0, 0, 0, 0.19)",
                backgroundColor: "white",
                overflowY:"hidden",
            },
            mapNavHeader : {
                position: "relative",
                backgroundColor: "#211339",
                opacity: "1",
                borderRadius:"0.8vh 0.8vh 0 0",
                zIndex : "1",
                width : "100%",
                color : "white",
            },
            search :{
                opacity : 0.8
            },
            apt_info_list :[
                {
                    id : "0",
                    addr : "구주소",
                    newaadr : "신주소",
                    name : "단지명",
                    minPrice : "최소 실거래가격",
                    maxPrice : "최대 실거래가격",
                    duration : "가격산정 기간"
                }
            ],
            apt_info : {
                durationList : ['0','1'],
                Prices  : ['0','1'],
                dangeeInfo : ['0','1'],
                tranPriceList : ['0','1'],
                amountList : ['0','1'],
            },
            chartOptions_1 : null,
            series_1 : null,
            chartOptions_2 : null,
            series_2 : null,
            chartOptions_3 : null,
            series_3 : null,
            chartOptions_4 : null,
            series_4 : null,
            curInfo : {
                addr : "",
                newaddr :"",
                name : "",
                minPrice :"",
                maxPrice : "",
                duration : "",
                area : "",
                cDate : "",
                guName : "",
                siName : "",
                dongName : "",
            },
            area_info : [
                {
                    "거래가격" : "",
                    "거래날짜" : "",
                    "매매량" :"",
                    "전용면적" : ""
                },
            ],
        };
    },
    methods: {
        mapNavStyleClick : function(){
            this.mapNavStyle.opacity = "1";
            this.search.opacity = "0.8";
        },
        mapStyleClick : function(){
            this.mapNavStyle.opacity = "0.8";
            this.search.opacity = "0.8";
        },
        searchStyleClick : function(){
            this.search.opacity = "1";
            this.mapNavStyle.opacity = "0.8";
        },
        mapNavVisibleClick : function(){
            this.mapNavVisible = true;
        },
        mapNavNonVisibleClick : function(){
            this.mapNavVisible = false;
        },
        searchTarget : function(){
            // if (!this.target.replace(/^\s+|\s+$/g, '')) {
            if (!'충북 청주시 서원구 대림로 491'.replace(/^\s+|\s+$/g, '')) {
                alert('다시 입력해주세요!');
                return false;
            }
            else{
                let ps = new kakao.maps.services.Places();
                ps.keywordSearch( '충북 청주시 서원구 대림로 491', this.placesSearchCB);
            }
        },
        chkTerrain : function(){
            if(!this.isTerrain){
                map.addOverlayMapTypeId(kakao.maps.MapTypeId.USE_DISTRICT); 
                this.isTerrain = true;
            }
            else{
                 map.removeOverlayMapTypeId(kakao.maps.MapTypeId.USE_DISTRICT);
                 this.isTerrain = false;
            }
            return this.isTerrain;
        },
        placesSearchCB : function(data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
                console.log(data[0]);
                
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

                alert('검색 결과가 존재하지 않습니다.');
                return;

            } else if (status === kakao.maps.services.Status.ERROR) {

                alert('검색 결과 중 오류가 발생했습니다.');
                return;

            }
        },
        getCurAddrInfo : function() {
            // alert("받을대상 : " + this.curAddr);
            this.isLoading = true;
            let targetAddr = "http://localhost:5000/api/getCurAddrInfo?addr="+this.curInfo.addr + ' '+ this.curInfo.name;
            // let targetAddr = "http://113.198.137.210:5000/api/getCurAddrInfo?addr="+this.curInfo.addr + ' '+ this.curInfo.name;
            axios.get(targetAddr).then(res =>{
                // this.isLoading = false;
                // 아파트 정보 저장
                this.apt_info = res.data;
                // console.log(this.apt_info);
                // this.apt_info.durationList = res.durationList;
                // this.apt_info.Prices  = res.Price;
                // this.apt_info.dangeeInfo = res.dangeeInfo;
                // this.apt_info.tranPriceList = res.tranPriceList;
                // this.apt_info.amountList = res.amountList;
                if(this.apt_info.tranPriceList === null || this.apt_info.tranPriceList == null){
                    this.apt_info.tranPriceList = ['2000-01-01', '2010-01-01'];
                }

                this.curInfo.cDate = this.apt_info.durationList;

                let arrTmp = this.apt_info.dangeeInfo["전용면적"];
                let re = '';
                for(let i = 0 ; i<arrTmp.length; i++){
                    re += this.apt_info.dangeeInfo["전용면적"][i] + ', ';
                }
                this.apt_info.dangeeInfo['전용면적'] = re.substring(0, re.length-2);
                this.curInfo.area = "전체평균";

                this.initChart();

            }).catch(e =>{
            console.log("error :", e);
            });

            this.isPageLoading=true;
            this.isAreadLoading = true;
            targetAddr = "http://localhost:5000/api/area_info?addr="+this.curInfo.addr + ' '+ this.curInfo.name;
            // targetAddr = "http://113.198.137.210:5000/api/area_info?addr="+this.curInfo.addr + ' '+ this.curInfo.name;
            axios.get(targetAddr).then(res =>{
                this.isPageLoading=false;
                this.isAreadLoading = false;
                this.area_info = res.data;
            }).catch(e =>{
                console.log("error : ", e);
            });
            this.isLoading = false;
            this.initChart();
        },
        targetAnalysis : function(){
            this.isLoading = true;
            let targetAddr = "http://localhost:5000/api/one_gu_data?addr="+this.curInfo.addr + ' '+ this.curInfo.name;
            axios.get(targetAddr).then(res =>{
                this.isLoading = false;
                this.curInfo.guName = res.data["구이름"]
                this.chartOptions_2 = {
                    stroke: {
                        width: [0, 4]
                    },
                    title: {
                        text: "전체기간 : " + res.data["가장옛날"]+ " ~ " + res.data["가장최근"]
                    },
                    // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    labels: res.data["기간"],
                            
                    tooltip: {
                        x: {
                            format: 'yyyy MM'
                        }
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            formatter: function (value) {
                                let d = new Date(value);
                                let y = d.getFullYear();
                                let m = d.getMonth();
                                m += 1;
                                let result = y+"년 " +m +"월";
                                return result;
                            },
                        format: 'yyyy MM',
                        },
                    },
                    yaxis: [
                        {
                            title: {
                            text: '매매량(건)',
                            },
                            labels: {
                                    formatter: (value) => { return parseInt(value) },
                            },
                        }, 
                        {
                            opposite: true,
                            title: {
                            text: '매매가(만원)'
                            }
                        }
                    ],
                };
                this.series_2 = [
                    {
                        name: '매매량(건)',
                        type: 'column',
                        data: res.data["매매량"]
                    }, 
                    {
                        name: '매매가(만원)',
                        type: 'line',
                        data: res.data["매매가"]
                    }
                ];
            }).catch(e =>{
                console.log("error : ", e);
            });

            this.isLoading = true;
            targetAddr = "http://localhost:5000/api/one_dong_data?addr="+this.curInfo.addr + ' '+ this.curInfo.name;
            axios.get(targetAddr).then(res =>{
                this.isLoading = false;
                this.curInfo.dongName = res.data["동이름"]
                this.chartOptions_3 = {
                    stroke: {
                        width: [0, 4]
                    },
                    title: {
                        text: "전체기간 : " + res.data["가장옛날"]+ " ~ " + res.data["가장최근"]
                    },
                    // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    labels: res.data["기간"],
                            
                    tooltip: {
                        x: {
                            format: 'yyyy MM'
                        }
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            formatter: function (value) {
                                let d = new Date(value);
                                let y = d.getFullYear();
                                let m = d.getMonth();
                                m += 1;
                                let result = y+"년 " +m +"월";
                                return result;
                            },
                        format: 'yyyy MM',
                        },
                    },
                    yaxis: [
                        {
                            title: {
                            text: '매매량(건)',
                            },
                            labels: {
                                    formatter: (value) => { return parseInt(value) },
                            },
                        }, 
                        {
                            opposite: true,
                            title: {
                            text: '매매가(만원)'
                            }
                        }
                    ],
                };
                this.series_3 = [
                    {
                        name: '매매량(건)',
                        type: 'column',
                        data: res.data["매매량"]
                    }, 
                    {
                        name: '매매가(만원)',
                        type: 'line',
                        data: res.data["매매가"]
                    }
                ];
            }).catch(e =>{
                console.log("error : ", e);
            });

            this.isLoading = true;
            targetAddr = "http://localhost:5000/api/si_data?addr="+this.curInfo.addr + ' '+ this.curInfo.name;
            axios.get(targetAddr).then(res =>{
                this.isLoading = false;
                this.curInfo.siName =  this.curInfo.addr.split(" ")[1];
                this.chartOptions_4 = {
                    stroke: {
                        width: [0, 4]
                    },
                    title: {
                        text: "전체기간 : " + res.data["가장옛날"]+ " ~ " + res.data["가장최근"]
                    },
                    // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    labels: res.data["기간"],
                            
                    tooltip: {
                        x: {
                            format: 'yyyy MM'
                        }
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            formatter: function (value) {
                                let d = new Date(value);
                                let y = d.getFullYear();
                                let m = d.getMonth();
                                m += 1;
                                let result = y+"년 " +m +"월";
                                return result;
                            },
                        format: 'yyyy MM',
                        },
                    },
                    yaxis: [
                        {
                            title: {
                            text: '매매량(건)',
                            },
                            labels: {
                                    formatter: (value) => { return parseInt(value) },
                            },
                        }, 
                        {
                            opposite: true,
                            title: {
                            text: '매매가(만원)'
                            }
                        }
                    ],
                };
                this.series_4 = [
                    {
                        name: '매매량(건)',
                        type: 'column',
                        data: res.data["매매량"]
                    }, 
                    {
                        name: '매매가(만원)',
                        type: 'line',
                        data: res.data["매매가"]
                    }
                ];
            }).catch(e =>{
                console.log("error : ", e);
            });

        },
        viewAreaChart : function(index){
            this.updateChart(index);
            this.apt_info.tranPriceList = this.area_info[index]["lately_data"];
            
            if(this.area_info[index]["lately_data"] == undefined || this.area_info[index]["lately_data"] == null){
                this.apt_info.tranPriceList = null;
                this.curInfo.area = null;
            }
            else{
                this.apt_info.tranPriceList = this.area_info[index]["lately_data"];
                this.curInfo.area = this.area_info[index]["전용면적"];
            }
        },
        updateChart(index) {
            let duration = ['2000-01','2000-12'];
            let tmpDate = this.area_info[index]["거래날짜"];
            duration = tmpDate[0] + ' ~ '  + tmpDate[tmpDate.length-1];
            this.curInfo.cDate = this.area_info[index]["거래날짜"];
            this.chartOptions_1 ={
                stroke: {
                    width: [0, 4]
                },
                title: {
                    text: "전체기간 : " + duration
                },
                // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                labels: this.area_info[index]["거래날짜"],
                        
                tooltip: {
                    x: {
                        format: 'yyyy MM'
                    }
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        formatter: function (value) {
                            let d = new Date(value);
                            let y = d.getFullYear();
                            let m = d.getMonth();
                            m += 1;
                            let result = y+"년 " +m +"월";
                            return result;
                        },
                    format: 'yyyy MM',
                    },
                },
                yaxis: [
                    {
                        title: {
                        text: '매매량(건)',
                        },
                        labels: {
                                formatter: (value) => { return parseInt(value) },
                        },
                    }, 
                    {
                        opposite: true,
                        title: {
                        text: '매매가(만원)'
                        }
                    }
                ],
            };
            this.series_1 = [
                {
                    name: '매매량(건)',
                    type: 'column',
                    data: this.area_info[index]["매매량"]
                }, 
                {
                    name: '매매가(만원)',
                    type: 'line',
                    data: this.area_info[index]["거래가격"]
                }
            ];
        },
        changeDuration : function(option){
            let cDate = new Date(this.curInfo.cDate[this.curInfo.cDate.length-1]);
            let minDate = 0;
            if(option == '1Y'){
                minDate = new Date(cDate.setMonth(cDate.getMonth()-12));
            }
            else if(option == '2Y'){
                minDate = new Date(cDate.setMonth(cDate.getMonth()-24));
            }
            else if(option == '3Y'){
                minDate = new Date(cDate.setMonth(cDate.getMonth()-36));
            }
            else if(option == '5Y'){
                minDate = new Date(cDate.setMonth(cDate.getMonth()-60));
            }
            else if(option == '1m'){
                minDate = new Date(cDate.setMonth(cDate.getMonth()-3));
            }
            else if(option == '3m'){
                minDate = new Date(cDate.setMonth(cDate.getMonth()-3));
            }
            else if(option == '6m'){
                minDate = new Date(cDate.setMonth(cDate.getMonth()-6));
            }
            else{
                minDate = new Date(this.curInfo.cDate[0]);
            }
            this.chartOptions_1 = {
                xaxis: {
                  min: minDate.getTime()
                }
            }
        },
        initChart : function(){
            // apexchart 데이터,옵션 설정
            this.chartOptions_1 ={
                stroke: {
                    width: [0, 4]
                },
                title: {
                    text: "전체기간 : " + this.curInfo.duration,
                },
                // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                labels: this.apt_info.durationList,
                        
                tooltip: {
                    x: {
                        format: 'yyyy MM'
                    }
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        formatter: function (value) {
                            let d = new Date(value);
                            let y = d.getFullYear();
                            let m = d.getMonth();
                            m += 1;
                            let result = y+"년 " +m +"월";
                            return result;
                        },
                    format: 'yyyy MM',
                    },
                },
                yaxis: [
                    {
                        title: {
                        text: '매매량(건)',
                        },
                        labels: {
                            formatter: (value) => { return parseInt(value) },
                        },

                    }, 
                    {
                        opposite: true,
                        title: {
                        text: '매매가(만원)'
                        }
                    }
                ],
            };
            this.series_1 = [
                {
                    name: '매매량(건)',
                    type: 'column',
                    data: this.apt_info.amountList
                }, 
                {
                    name: '매매가(만원)',
                    type: 'line',
                    data: this.apt_info.Price
                }
            ];
        },
        setTotalAvgSave : function(){
            this.initChart();
        },
        fillData : function() {
            this.chartOptions_1 ={
                stroke: {
                    width: [0, 4]
                },
                title: {
                    text: "CS2 마커를 클릭하세요"
                },
                // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                labels: ['2001-01-08', '2001-02-08', '2001-03-08', '2001-04-08', '2001-05-08', '2001-06-08',
                    '2001-07-08', '2001-08-08', '2001-09-08', '2001-10-08'],
                xaxis: {
                    min: new Date('2001-08').getTime(),
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
                    name: '마커를 클릭하세요',
                    type: 'column',
                    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }, 
                {
                    name: '마커를 클릭하세요',
                    type: 'line',
                    data: [100, 90, 80, 70, 60, 50, 40, 30, 20, 10]
                }
            ];
            this.chartOptions_2 ={
                stroke: {
                    width: [0, 4]
                },
                title: {
                    text: "CS2 마커를 클릭하세요"
                },
                // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                labels: ['2001-01-08', '2001-02-08', '2001-03-08', '2001-04-08', '2001-05-08', '2001-06-08',
                    '2001-07-08', '2001-08-08', '2001-09-08', '2001-10-08'],
                xaxis: {
                    min: new Date('2001-08').getTime(),
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
            this.series_2 = [
                {
                    name: '마커를 클릭하세요',
                    type: 'column',
                    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }, 
                {
                    name: '마커를 클릭하세요',
                    type: 'line',
                    data: [100, 90, 80, 70, 60, 50, 40, 30, 20, 10]
                }
            ];
            this.chartOptions_3 ={
                stroke: {
                    width: [0, 4]
                },
                title: {
                    text: "CS2 마커를 클릭하세요"
                },
                // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                labels: ['2001-01-08', '2001-02-08', '2001-03-08', '2001-04-08', '2001-05-08', '2001-06-08',
                    '2001-07-08', '2001-08-08', '2001-09-08', '2001-10-08'],
                xaxis: {
                    min: new Date('2001-08').getTime(),
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
            this.series_3 = [
                {
                    name: '마커를 클릭하세요',
                    type: 'column',
                    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }, 
                {
                    name: '마커를 클릭하세요',
                    type: 'line',
                    data: [100, 90, 80, 70, 60, 50, 40, 30, 20, 10]
                }
            ];
            this.chartOptions_4 ={
                stroke: {
                    width: [0, 4]
                },
                title: {
                    text: "CS2 마커를 클릭하세요"
                },
                // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                labels: ['2001-01-08', '2001-02-08', '2001-03-08', '2001-04-08', '2001-05-08', '2001-06-08',
                    '2001-07-08', '2001-08-08', '2001-09-08', '2001-10-08'],
                xaxis: {
                    min: new Date('2001-08').getTime(),
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
            this.series_4 = [
                {
                    name: '마커를 클릭하세요',
                    type: 'column',
                    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }, 
                {
                    name: '마커를 클릭하세요',
                    type: 'line',
                    data: [100, 90, 80, 70, 60, 50, 40, 30, 20, 10]
                }
            ];
        },
    },
    mounted(){
        this.fillData();
        // this.searchTarget();
        container = document.getElementById('map');
        mapOptions = { //지도를 생성할 때 필요한 기본 옵션
            center: new kakao.maps.LatLng(36.625637, 127.454394), //지도의 중심좌표.
            level: 6, //지도의 레벨(확대, 축소 정도)
            disableDoubleClick: false,
            disableDoubleClickZoom : false,
            draggable : true
        };

        map = new kakao.maps.Map(container, mapOptions); //지도 생성 및 객체 리턴
        // mapTypeControl = new kakao.maps.MapTypeControl();
        // map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
        zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
        clusterer = new kakao.maps.MarkerClusterer({
            map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
            averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
            minLevel: 5 // 클러스터 할 최소 지도 레벨 
        });

        let vm = this;
        axios.get("http://localhost:5000/api/targetList").then(res =>{
            vm.targetResult = res.data;
            let tmpResult = vm.targetResult;
            for( let i =0 ; i<tmpResult.length; i++)
            // for( let i =0 ; i<10; i++)
            {
                let targetAddrName = tmpResult[i].addr;
                let geocoder = new kakao.maps.services.Geocoder();
                geocoder.addressSearch(targetAddrName, function(result, status) {
                if (status === kakao.maps.services.Status.OK) 
                {
                    // console.log(result);
                    let addr  = '';
                    let name = '';
                    let newaddr ='';
                    let minPrice = '';
                    let maxPrice = '';
                    let duration = ['2000-01-01','2000-01-01']

                    if(tmpResult[i].addr === undefined || tmpResult[i].addr === null) {addr = 'x'}
                    else{
                        addr  = tmpResult[i].addr;
                    }
                    if(tmpResult[i].name === undefined || tmpResult[i].name === null) {name = 'x'}
                    else{
                        name = tmpResult[i].name;
                    }
                    if(tmpResult[i].newaddr === undefined || tmpResult[i].newaddr === null) {newaddr = 'x'}
                    else{
                        newaddr = tmpResult[i].newaddr;
                    }
                    if(tmpResult[i].minPrice === undefined || tmpResult[i].minPrice === null) {minPrice = 'x'}
                    else{
                        minPrice = tmpResult[i].minPrice;
                    }
                    if(tmpResult[i].maxPrice === undefined || tmpResult[i].maxPrice === null) {maxPrice = 'x'}
                    else{
                        maxPrice = tmpResult[i].maxPrice;
                    }
                    if(tmpResult[i].duration === undefined || tmpResult[i].duration === null) {duration = ['2000-01-01','2000-01-01']}
                    else{
                        duration = tmpResult[i].duration["가장옛날"] + " ~ " + tmpResult[i].duration["가장최근"];
                    }

                    
                    let coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                    // let imageSrc = "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 
                    // let imageSrc = "https://img.icons8.com/dusk/64/000000/city.png";
                    let imageSrc = "https://image.flaticon.com/icons/svg/1259/1259768.svg";
                    let imageSize = new kakao.maps.Size(34, 35); 
                    let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); 
                    let markerResult = new kakao.maps.Marker({
                        title : tmpResult[i].addr + ' ' +tmpResult[i].name,
                        map: map,
                        position: coords,
                        zIndex: 2,
                        image : markerImage
                    });

                    // console.log(addr + ' ' + name + ' '+ newaddr + ' '+ minPrice + ' '+ maxPrice + ' '+ duration);
                    let content = '<div class="card" style="width: 38vh; border:1px solid gray; padding :0px;">';
                        content += '<div class="card-body">';
                        content += '<h5 class="card-title" style="font-weight:900; white-space:normal;">'+name+'</h5>';
                        content += '<h6 class="card-subtitle mb-2 text-muted" style="white-space:normal; font-size:1.5vh;">'
                                    +addr+'</h6>';
                        content += '<h6 class="card-subtitle mb-2 text-muted" style="white-space:normal; font-size:1.5vh;">('
                                    +newaddr+')</h6>';
                        content += '<p class="card-text" style="margin-top:5px; margin-bottom:0px; padding:0; font-weight:600">평균 실거래가 : '
                                    +'<span style="color:blue">'+minPrice+ '</span> ~ <span style="color:red">'+maxPrice+'</span>(만원)</p>';
                        content += '<p class="card-text" style="font-size:1vh; float:right; margin-top:5px; margin-bottom:0px; padding:0;">'+
                        duration+' 기준</p>';
                        content += '</div>';
                        content += '</div>';

                    let mapCustomOverlay = new kakao.maps.CustomOverlay({
                        position: coords,
                        content: content,
                        xAnchor: 0.5, // 커스텀 오버레이의 x축 위치입니다. 1에 가까울수록 왼쪽에 위치합니다. 기본값은 0.5 입니다
                        yAnchor: 1.27, // 커스텀 오버레이의 y축 위치입니다. 1에 가까울수록 위쪽에 위치합니다. 기본값은 0.5 입니다
                        zIndex : 3
                    });
                                        
                    kakao.maps.event.addListener(markerResult, 'mouseover', function() {
                        mapCustomOverlay.setMap(map);
                    });
                    kakao.maps.event.addListener(markerResult, 'mouseout', function() {
                        mapCustomOverlay.setMap(null);
                    });
                    kakao.maps.event.addListener(markerResult, 'click', function() {
                        // console.log("click");
                        vm.title = name;
                        vm.curAddr = addr;

                        vm.curInfo.addr = addr;
                        vm.curInfo.name = name;
                        vm.curInfo.newaddr = newaddr;
                        vm.curInfo.minPrice = minPrice;
                        vm.curInfo.maxPrice = maxPrice;
                        vm.curInfo.duration = duration;

                        vm.area_info = [];
                        
                        vm.getCurAddrInfo();
                        vm.targetAnalysis();
                        vm.mapNavVisibleClick();
                        vm.initChart();
                        vm.isBegin = false;
                        // map.panTo(coords);
                        map.setCenter(coords);
                        map.setLevel(4, {animate: true});
                        

                        // console.log("apex op : ",vm.chartOptions_1);
                        // console.log("apex se ",vm.series_1);
                    });
                    marker.push(markerResult);
                    clusterer.addMarker(markerResult);
                }
                else{
                    console.log("지오코더문제");
                }}); 
            }
        vm.isPageLoading = false;
        })
        .catch(e =>{
            console.log("error :", e);
        });
    },//mounted end
    created(){
        // container = document.getElementById('map');
    }
}
</script>

<style scoped>
.chart{
    margin-top:0px;
}
#mapNav{
    z-index: 4;
    /* animation: fadein 0.5s;
    -moz-animation: fadein 0.5s;
    -webkit-animation: fadein 0.5s;
    -o-animation: fadein 0.5s; */
    -webkit-animation: slide 0.5s forwards;
    -webkit-animation-delay: 0.5s;
    animation: slide 0.5s forwards;
    animation-delay: 0s;
}

.cardHead{
    position: relative;
    font-weight: normal;
    display: inline-block;
    width: 100%;
    text-align: center;
    margin : 0px;
    /* background-color: #474747; */
    background-color: #2e3131;
    color : white;
}
.cardTitle{
    letter-spacing: 6px;
    font-weight: bold;
    margin-top: 10px;
}
.cardSubTitle{
    font-size:14px;
    font-weight: 100;
    color: lightgray;
}
.cardBodyText{
    margin-top :20px;
    margin-bottom: 4px;
    font-size:3vh;
    font-weight: 900;
}
.closeButton{
    color:white;
    font-weight: 900;
    position: absolute;
    font-size:30px;
    margin: 0;
    padding : 0;
    left:92.8%;
    top : -6%;
    z-index: 1;
}
.card-body{
    padding : 0;
    overflow-y: auto;
    
}
.card-body::-webkit-scrollbar {
    display: none;
}
/* .vld-icon{
    position: absolute; 
    width: 100%;
    height: 100%;
    z-index:999; 
    top:100%;
} */

@keyframes fadein {
    from {
        opacity:0;
    }
    to {
        opacity:1;
    }
}
@-moz-keyframes fadein { /* Firefox */
    from {
        opacity:0;
    }
    to {
        opacity:1;
    }
}
@-webkit-keyframes fadein { /* Safari and Chrome */
    from {
        opacity:0;
    }
    to {
        opacity:1;
    }
}
@-o-keyframes fadein { /* Opera */
    from {
        opacity:0;
    }
    to {
        opacity: 1;
    }
}

@-webkit-keyframes slide {
    100% { left: 1vh; }
}

@keyframes slide {
    100% { left: 1vh; }
}


</style>
