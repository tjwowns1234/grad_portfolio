<template>
    <div>
        <form id="searchForm" @submit.prevent="searchTarget">
            <b-input-group 
                class="mt-3" 
                id="search"
                style="search"
            >
                    <b-form-input
                        v-model.trim="target"
                    ></b-form-input>
                    <b-button variant="danger" type="submit">Search</b-button>
            </b-input-group>
        </form>
    </div>
</template>

<script>
export default {
    data(){
        return{
            target : ''
        };
    },
    methods :{
        searchTarget : function(){
            let ps = new kakao.maps.services.Places(); 
            ps.keywordSearch(this.target, this.placesSearchCB); 
        },
        placesSearchCB : function(data, status, pagination){
            if(searchMarker != null){
                    searchMarker.setMap(null); // 지도에서 제거한다.
            }
            if (status === kakao.maps.services.Status.OK) {
                let position = new kakao.maps.LatLng(data[0].y, data[0].x);
                let imageSrc = "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 
                let imageSize = new kakao.maps.Size(24, 35); 
                let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); 
                searchMarker = new kakao.maps.Marker({
                    map: map, // 마커를 표시할 지도
                    position: position, // 마커를 표시할 위치
                    title : data[0].place_name, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                    image : markerImage // 마커 이미지 
                });
                map.setCenter(position);
                map.setLevel(4, {animate: true});
                searchMarker.setZIndex(1);
                searchMarker.setMap(map); // 지도에 올린다.
            }
            else{
                let geocoder = new kakao.maps.services.Geocoder();
                geocoder.addressSearch(this.target, function(result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    console.log(result);
                    let coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                    let imageSrc = "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 
                    let imageSize = new kakao.maps.Size(24, 35); 
                    let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); 
                    searchMarker = new kakao.maps.Marker({
                        map: map, // 마커를 표시할 지도
                        position: coords, // 마커를 표시할 위치
                        title : result[0].address_name, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                        image : markerImage // 마커 이미지 
                    });
                    map.setCenter(position);
                    map.setLevel(3, {animate: true});
                    searchMarker.setZIndex(1);
                    searchMarker.setMap(map); // 지도에 올린다.
                }
                else{
                    alert("검색결과가 없습니다.");
                }
            });  
            }
        }
    }
    
}
</script>

<style scoped>
#search{
    position: absolute;
    width: 50%;
    z-index: 1;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 80px 0 rgba(0, 0, 0, 0.19);
    top : 1vh;
    left: 30%;
    opacity : 0.8;
}
</style>