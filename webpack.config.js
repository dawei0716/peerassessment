
module.exports = {
  module: {

    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader"
            }
         },
         {
            test: /\.svg$/,
            use: [
              {
                loader: 'svg-url-loader',
              },
            ],
          },

        {
          test: /\.css$/,
          loader: ['style-loader', 'css-loader'],

        }
    ]
  }
}
