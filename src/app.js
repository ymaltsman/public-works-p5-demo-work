import * as p5 from 'p5';
//import * as kmeans from 'node-kmeans';
import {generateTraits} from "./traits";

function importAll(r) {
    return r.keys().map(r);
}

// import wall_img from './assets/wall.JPG';
const img_modules = importAll(require.context('./assets/', false, /\.(png|jpe?g|JPE?G|svg)$/));
const images = Object.entries(img_modules).map(module => module[1].default);
const img_ct = images.length;

let devMode = false;
if(devMode){
    /**
     * Enable new hashes on click during development.
     */
    const freshHash = () => {
        window.location = '?hash=' + generateTxHash()
    }
    window.addEventListener('touchend', function () {
        freshHash()
    });
    document.addEventListener('keyup', (e) => {
        if (e.key === ' ') {
            freshHash()
        }
    })
}

function getRandImg() {
    let rand_idx = Math.floor(Math.random() * img_ct);
    return images[rand_idx];
}

let s = (sk) => {
    const {traits, attributes} = generateTraits(createPrng());
    setProperties(attributes, traits);
    let dimensions;
    let back;
    let clusters;
    let l1;
    let load;

    sk.setup = () => {
        dimensions = getDimensions();
        sk.createCanvas(...dimensions);
        // sk.background(125);
        back = sk.loadImage(getRandImg(), img => {
            sk.image(img, 0, 0, ...dimensions);
        });
        sk.loadPixels();
        sk.updatePixels();
        load = 0;
        


        // back = sk.loadImage("assets/wall.JPG", img => {
        //     sk.image(img, 0, 0);
        //   });
        //sk.loadPixels();
    }

    const kMeans = (data, k = 1) => {
        const centroids = data.slice(0, k);
        const distances = Array.from({ length: data.length }, () =>
          Array.from({ length: k }, () => 0)
        );
        const classes = Array.from({ length: data.length }, () => -1);
        let itr = true;
      
        while (itr) {
          itr = false;
      
          for (let d in data) {
            for (let c = 0; c < k; c++) {
              distances[d][c] = Math.hypot(
                ...Object.keys(data[0]).map(key => data[d][key] - centroids[c][key])
              );
            }
            const m = distances[d].indexOf(Math.min(...distances[d]));
            if (classes[d] !== m) itr = true;
            classes[d] = m;
          }
      
          for (let c = 0; c < k; c++) {
            centroids[c] = Array.from({ length: data[0].length }, () => 0);
            const size = data.reduce((acc, _, d) => {
              if (classes[d] === c) {
                acc++;
                for (let i in data[0]) centroids[c][i] += data[d][i];
              }
              return acc;
            }, 0);
            for (let i in data[0]) {
              centroids[c][i] = parseFloat(Number(centroids[c][i] / size).toFixed(2));
            }
          }
        }
      
        return classes;
      };


    sk.draw = () => {
        sk.loadPixels();
        sk.updatePixels();
        let a = [];
        for (let x = 0; x < sk.width; x++){
            for (let y = 0; y < sk.height; y++){
                let c = sk.get(x, y);
                a.push(c);
            }
        }
        let clusters = kMeans(a, 3);
        console.log("pixels", a[0]);
        console.log("clusters", clusters);
        setPreviewReady();
        //sk.noLoop();
    }
    const getDimensions = () => {
        let desiredHeight = sk.windowHeight
        let desiredWidth = sk.windowHeight;
        if (desiredWidth > sk.windowWidth) {
            desiredWidth = sk.windowWidth;
            desiredHeight = sk.windowWidth;
        }
        return [desiredWidth, desiredHeight]
    }
    sk.windowResized = () => {
        if (!isPWPreview()) {
            const dimensions = getDimensions();
            sk.resizeCanvas(...dimensions);
            // redraw at new dimensions
            sk.loop()
        }
    }
}

export const createSketch = () => {
    return new p5(s, document.getElementById('root'));
}
