<template>
      <svg
        class="base-change"
        :width="38"
        :height="19"
      >
      	<g class="HV">
					<g>
						<line class="white-line" x1="10.1" y1="9.5" x2="16.9" y2="9.5"/>
						<polygon class="white-fill" points="10.8,12 6.5,9.5 10.8,7"/>
						<polygon class="white-fill" points="16.2,12 20.5,9.5 16.2,7"/>
					</g>
					<g>
						<line class="white-line" x1="28.5" y1="13.4" x2="28.5" y2="5.6"/>
						<polygon class="white-fill" points="31,12.7 28.5,17 26,12.7"/>
						<polygon class="white-fill" points="31,6.3 28.5,2 26,6.3"/>
					</g>
				</g>
				<g class="DA">
					<g>
						<line class="white-line" x1="14.3" y1="12.3" x2="8.7" y2="6.7"/>
						<polygon class="white-fill" points="15.5,10 16.8,14.8 12,13.5"/>
						<polygon class="white-fill" points="11,5.5 6.2,4.2 7.5,9"/>
					</g>
					<g>
						<line class="white-line" x1="29.3" y1="6.7" x2="23.7" y2="12.3"/>
						<polygon class="white-fill" points="27,5.5 31.8,4.2 30.5,9"/>
						<polygon class="white-fill" points="22.5,10 21.2,14.8 26,13.5"/>
					</g>
				</g>
				<g class="LR">
					<g>
						<path class="white-line" d="M5.1,8.7c0-2.9,2.4-5.3,5.3-5.3s5.3,2.4,5.3,5.3s-2.4,5.3-5.3,5.3c-0.1,0-0.3,0-0.4,0"/>
						<polygon class="white-fill" points="11.6,11.8 6.7,12.6 9.9,16.4 			"/>
					</g>
					<g>
						<path class="white-line" d="M33,8.7c0-2.9-2.4-5.3-5.3-5.3s-5.3,2.4-5.3,5.3s2.4,5.3,5.3,5.3c0.1,0,0.3,0,0.4,0"/>
						<polygon class="white-fill" points="28.2,16.4 31.4,12.6 26.4,11.8 			"/>
					</g>
				</g>
      </svg>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  components: {
  },
  props: {
  },
})
</script>

<style scoped lang="scss">
.white-line {
	fill: none;
	stroke: #FFFFFF;
	stroke-miterlimit: 10;
}
.white-fill {
	fill: #FFFFFF;
}
</style>
