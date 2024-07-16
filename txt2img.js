const sdwebui = require('node-sd-webui');
const fs = require('fs');

// StableDiffusionのURL
// ※末尾に "/" を付けない
const STABLE_DIFFUSION_URL = "http://127.0.0.1:7860";

async function main() {
  const client = sdwebui.default({apiUrl: STABLE_DIFFUSION_URL});

  try {
    const response = await client.txt2img({
      prompt: '1girl, solo, blue hair, samurai, looking at viwer',
      negativePrompt: 'More than five fingers, less than five fingers',
      samplingMethod: sdwebui.SamplingMethod.Euler_A,
      width: 800,
      height: 400,
      steps: 20,
      seed: 5, // シード値.-1でランダム
      batchSize: 1, // 生成する画像数
    });

    const parameters = response.parameters;
    console.log("parameters", parameters); // 各種生成パラメータ

    const info = JSON.parse(response.info); // 生成時のシード情報など
    console.log("info", info);

    const images = response.images;

    for (let i=0; i<images.length; ++i) {
      const image = images[i]; // Base64で画像データ
      const seed = info.all_seeds[i];

      // image-<タイムスタンプ>-<seed>.png として画像保存
      const filename = `./out/image-${info.job_timestamp}-${seed}.png`;
      console.log("save: ", filename);

      fs.writeFileSync(filename, image, 'base64');
    }
  } catch (err) {
    console.error(err)
  }
}

main();