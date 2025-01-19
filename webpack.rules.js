const path = require("path");

module.exports = [
  // Add support for native node modules
  {
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.jsx?$/,
    use: {
      loader: "babel-loader",
      options: {
        exclude: /node_modules/,
        presets: ["@babel/preset-react"],
      },
    },
  },
  {
    // Loads .css files
    test: /\.css$/,
    include: [path.resolve(__dirname, "app/src")],
    use: ["style-loader", "css-loader", "postcss-loader"],
  },
  {
    // Loads image files
    test: /\.(png|jpe?g|gif|svg)$/i,
    type: "asset/resource",
    generator: {
      filename: "images/[name][ext]",
    },

  },
  {
    // Loads .mp3 files
    test: /\.mp3$/i,
    type: "asset/resource", // Or use 'url-loader' if you want to inline base64 encoded files
    generator: {
      filename: "audio/[name][ext]", // This specifies the output folder for mp3 files
    },
  }
  // Add other rules here if needed
];
