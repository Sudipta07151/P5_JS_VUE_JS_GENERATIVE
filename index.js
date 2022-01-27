const { onMounted, ref, onUpdated, reactive, watch } = Vue;

// const radius = Math.sqrt(0.5);
// const dotSize = 0.05;
// const PHI = (1 + Math.sqrt(5)) / 2;

const app = Vue.createApp({
  setup() {
    const radius = ref(Math.sqrt(0.5));
    const dotSize = ref(0.05);
    const PHI = ref((1 + Math.sqrt(5)) / 2);

    const height = ref(400);
    const width = ref(400);
    const angleState = ref(1);
    const myp5 = ref(null);
    const dotsize_list = ref("0.05");
    const dot_space_list = ref("1");
    const spiral_list = ref("1");
    const sk1 = ref(null);
    const sk2 = ref(null);
    const dots_density = ref(100);

    const togglePattern = ref("pattern1");

    const handleToggle = () => {
      if (togglePattern.value == "pattern1") {
        togglePattern.value = "pattern2";
      } else {
        togglePattern.value = "pattern1";
      }
    };

    const invertColor = reactive({
      fill: 1,
      background: 0,
      dark: false,
    });
    const handleInvert = () => {
      if (invertColor.fill == 1) {
        invertColor.fill = 0;
        invertColor.background = 1;
        invertColor.dark = true;
      } else {
        invertColor.fill = 1;
        invertColor.background = 0;
        invertColor.dark = false;
      }
    };

    const handleSave = () => {
      myp5.value.saveCanvas("canvas", "jpg");
    };

    var sketch1 = function (p) {
      p.setup = () => {
        console.log("sketch1 ran");
        var val = p.createCanvas(height.value, width.value);
        val.parent("#myCanvas");
        p.colorMode(p.RGB, 1);
        p.noStroke();
      };
      p.draw = () => {
        p.scale(p.width, p.height);
        p.background(invertColor.background);
        p.fill(invertColor.fill);
        const count = 1000;
        for (let i = 1; i < count; i++) {
          const f = i / count;
          const angle = i * angleState.value * PHI.value;
          const dist = f * radius.value;
          const x = 0.5 + p.sin(angle * p.TWO_PI) * dist;
          const y = 0.5 + p.cos(angle * p.TWO_PI) * dist;
          const r = f * parseFloat(dotsize_list.value);
          p.circle(x, y, r);
        }
      };
    };

    var sketch2 = function (p) {
      p.setup = () => {
        console.log("sketch2 ran");
        var val = p.createCanvas(height.value, width.value);
        val.parent("#canvas2");
        p.colorMode(p.RGB, 1);
        p.noStroke();
      };
      p.draw = () => {
        var radius = 0.25;
        p.scale(p.width, p.height);
        p.background(invertColor.background);
        p.fill(invertColor.fill);
        // const count = 100;
        for (let i = 0; i < dots_density.value; i++) {
          const f = (i * parseFloat(dot_space_list.value)) / dots_density.value;
          const a = (i * parseFloat(spiral_list.value)) / 10;
          const dist = f * radius;
          const x = 0.5 + p.cos(a * p.TWO_PI) * dist;
          const y = 0.5 + p.sin(a * p.TWO_PI) * dist;
          const r = 0.01;
          p.circle(x, y, r);
        }
      };
    };

    onMounted(() => {
      togglePattern.value == "pattern1"
        ? (sk1.value = new p5(sketch1))
        : (sk2.value = new p5(sketch2));
    });

    watch(togglePattern, () => {
      console.log("watch ran");
      if (togglePattern.value == "pattern1") {
        console.log("watch pattern1");
        sk2.value.remove();
        sk1.value = new p5(sketch1);
        myp5.value = sk1.value;
      } else if (togglePattern.value == "pattern2") {
        console.log("watch pattern2");
        sk1.value.remove();
        sk2.value = new p5(sketch2);
        myp5.value = sk2.value;
      }
    });

    // var myp5 = new p5(sketch);

    handleHeight = () => {
      height.value += 50;
    };
    handleWidth = () => {
      width.value += 50;
    };
    handleHeightDec = () => {
      height.value -= 50;
    };
    handleWidthDec = () => {
      width.value -= 50;
    };
    console.log("running vue");

    onUpdated(() => {
      console.log("updated ran");
      if (togglePattern.value == "pattern1")
        sk1.value.createCanvas(height.value, width.value);
      else sk2.value.createCanvas(height.value, width.value);
    });

    return {
      height,
      width,
      handleHeight,
      handleWidth,
      handleHeightDec,
      handleWidthDec,
      invertColor,
      angleState,
      handleInvert,
      radius,
      dotSize,
      PHI,
      dotsize_list,
      handleSave,
      togglePattern,
      handleToggle,
      spiral_list,
      dot_space_list,
      dots_density,
    };
  },
});

app.mount("#app");
