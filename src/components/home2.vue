<template>
<div>
    <div class="homebody">
          <b-carousel
            id="carousel-fade"
            style="text-shadow: 0px 0px 2px #000"
            fade
            indicators
            img-width="1920"
            img-height="1080"
            >
                <b-carousel-slide
                caption="First slide"
                img-src="../assets/bg.jpg"
                ></b-carousel-slide>
                <b-carousel-slide
                caption="Second Slide"
                img-src="../assets/bg2.jpg"
                ></b-carousel-slide>
                <b-carousel-slide
                caption="Third Slide"
                img-src="../assets/bg.jpg"
                ></b-carousel-slide>
        </b-carousel>
    </div>

    <div class="container">
        <div class="mt-4">
            <b-card-group deck>
                <b-card bg-variant="dark" class="mcard bi" v-on:click="go('/analyze')">
                    <img src="../assets/analysis.png">
                    <b-card-text>관광객 통계</b-card-text>
                </b-card>

                <b-card bg-variant="dark" class="mcard bi" v-on:click="go('/analyze')">
                    <img src="../assets/map.png">
                    <b-card-text>관광지</b-card-text>
                </b-card>

                <b-card bg-variant="dark" class="mcard bi" v-on:click="go('/analyze')">
                    <img src="../assets/accomodation.png">
                    <b-card-text>숙박시설</b-card-text>
                </b-card>

                <b-card bg-variant="dark" class="mcard bi" v-on:click="go('/analyze')">
                    <img src="../assets/map-location.png">
                    <b-card-text>내 주변은?</b-card-text>
                </b-card>
            </b-card-group>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: "home",
    data() {
        return {
            msg: 'Hi!~ GyeongJu',
            slide: 0,
            sliding: null
        }
    },
    methods: {
        go: function (targetName) {
            this.$router.push(targetName);
        },
        onSlideStart: function () {
            this.sliding = true;
        },
        onSlideEnd: function () {
            this.sliding = false;
        },

    }
}
</script>

<style scoped>
container {
    display: block;
}

img {
    margin-bottom: 10px;
    width: 67px;
    height: 65px;
}

.bi {
    opacity: 0.66;
}

.bi:hover {
    opacity: 1;
}

.mcard {
    color: white;
    font-size: 18px;
    text-align: center;
}

.homebody {
    /* background-image: url('../assets/bg.jpg'); */
    background-color: azure;
    width: 100%;
    display: block;
}
</style>
